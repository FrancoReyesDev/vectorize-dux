import {
  Console,
  Effect,
  Fiber,
  HashMap,
  HashSet,
  Option,
  pipe,
  Ref,
} from "effect";
import type { DuxItemDTO } from "~/dto/dux-item.dto";
import { parseXlsx, parsePriceListFile } from "~/services/xlsx.service";
import { duxToItemDomain } from "~/mappers/dux-to-item-domain.mapper";
import { duxItemsRepository } from "~/repository/dux-items.repository.server";
// import { embed } from "~/services/ollama.service";
// import { titleVectorsRepository } from "~/repository/title-vectors.repository";

interface Params {
  productsFile: File;
  listPriceListFile: File;
  cardPriceListFile: File;
  cashPriceListFile: File;
}

export const duxEtlUseCase = (params: Params) =>
  Effect.gen(function* () {
    const duxItemsRepo = yield* duxItemsRepository;
    // const titleVectorRepo = yield* titleVectorsRepository;

    const sheetItems = yield* pipe(
      getItemArray(params),
      Effect.map((items) =>
        HashMap.fromIterable(items.map((item) => [item.sku, item]))
      )
    );

    const incomingSku = HashSet.fromIterable(HashMap.keys(sheetItems));
    const existingSku = yield* duxItemsRepo.listKeys.pipe(
      Effect.map(HashSet.fromIterable)
    );

    // const newSku = HashSet.difference(incomingSku, existingSku);
    // const intersectionSku = HashSet.intersection(incomingSku, existingSku);
    const remainingSku = HashSet.difference(existingSku, incomingSku);
    // const existingIntersectionVectorSku = yield* titleVectorRepo
    //   .retrieve(HashSet.toValues(intersectionSku).map((key) => key.toString()))
    //   .pipe(
    //     Effect.map((vectors) => HashSet.fromIterable(vectors.map((v) => v.id)))
    //   );
    // const missingVectorSku = HashSet.difference(
    //   intersectionSku,
    //   existingIntersectionVectorSku
    // );

    yield* duxItemsRepo.batchPut(HashMap.toValues(sheetItems));
    yield* duxItemsRepo.batchDelete(HashSet.toValues(remainingSku));

    // const intersectionItems = yield* duxItemsRepo
    //   .getMany(HashSet.toValues(intersectionSku))
    //   .pipe(
    //     Effect.map((data) =>
    //       data.filter(<T>(x: T | undefined): x is T => x !== undefined)
    //     ),
    //     Effect.map((items) =>
    //       HashMap.fromIterable(items.map((item) => [item.sku, item]))
    //     )
    //   );

    // const toEmbedItems = HashMap.filter(
    //   sheetItems,
    //   (item, sku) =>
    //     HashSet.has(newSku, sku) ||
    //     HashSet.has(missingVectorSku, sku) ||
    //     pipe(
    //       HashMap.get(intersectionItems, sku),
    //       Option.exists(({ title }) => item.title !== title)
    //     )
    // );

    // console.log({ toEmbedItems });

    // const embeddings = yield* pipe(HashMap.toEntries(toEmbedItems), (items) =>
    //   pipe(
    //     items.map(([sku, item]) => item.title),
    //     embed,
    //     Effect.tap(Console.log),
    //     Effect.tapError(Console.error),
    //     Effect.map((embeddings) =>
    //       items.map(([sku], index) => ({
    //         key: sku,
    //         vector: embeddings.embeddings[index],
    //       }))
    //     )
    //   )
    // );

    // console.log({ embeddings });

    // const results = yield* titleVectorRepo.batchPut(embeddings);
    // console.log({ results });
    // yield* titleVectorRepo.batchDelete(
    //   HashSet.toValues(remainingSku).map((key) => key.toString())
    // );
    // console.log("ETL process completed successfully");
  }).pipe(
    Effect.tap(() => Console.log("Etl Process Completed Successfully")),
    Effect.tapError((error) => Console.error("Etl Process Failed", error))
  );

const getItemArray = ({
  productsFile,
  listPriceListFile,
  cardPriceListFile,
  cashPriceListFile,
}: Params) =>
  Effect.gen(function* () {
    const duxItemDtoArray = yield* parseXlsx<DuxItemDTO>(productsFile);

    const [listPriceList, cardPriceList, cashPriceList] = yield* Effect.all([
      parsePriceListFile(listPriceListFile),
      parsePriceListFile(cardPriceListFile),
      parsePriceListFile(cashPriceListFile),
    ]);

    const indexedListPrices = HashMap.fromIterable(
      listPriceList.items.map((item) => [item.sku, item])
    );
    const indexedCardPrices = HashMap.fromIterable(
      cardPriceList.items.map((item) => [item.sku, item])
    );
    const indexedCashPrices = HashMap.fromIterable(
      cashPriceList.items.map((item) => [item.sku, item])
    );

    return duxItemDtoArray.map((product) =>
      duxToItemDomain({
        itemDTO: product,
        listMetadata: listPriceList.metadata,
        listPrice: Option.getOrUndefined(
          HashMap.get(indexedListPrices, product.CODIGO)
        ),
        cardMetadata: cardPriceList.metadata,
        cardPrice: Option.getOrUndefined(
          HashMap.get(indexedCardPrices, product.CODIGO)
        ),
        cashMetadata: cashPriceList.metadata,
        cashPrice: Option.getOrUndefined(
          HashMap.get(indexedCashPrices, product.CODIGO)
        ),
      })
    );
  });

// export interface EtlStatus {
//   fiber: Fiber.RuntimeFiber<unknown, unknown>;
//   startedAt: number;
// }

// export const EtlState = Effect.gen(function* () {
//   const ref = yield* Ref.make<Option.Option<EtlStatus>>(Option.none());
//   return ref;
// });

// export const startEtl = (params: Params) =>
//   Effect.gen(function* () {
//     const state = yield* EtlState;

//     const fiber = yield* duxEtlUseCase(params).pipe(Effect.fork);

//     yield* Ref.set(
//       state,
//       Option.some({
//         fiber,
//         startedAt: Date.now(),
//       })
//     );

//     return { status: "started" };
//   });

// export const getEtlStatus = Effect.gen(function* () {
//   const state = yield* EtlState;
//   const current = yield* Ref.get(state);

//   return yield* Option.match(current, {
//     onNone: () => Effect.succeed({ status: "idle" }),
//     onSome: ({ fiber, startedAt }) =>
//       pipe(
//         fiber.status,
//         Effect.map((status) => ({ status, startedAt }))
//       ),
//   });
// });
