import { Chunk, Console, Effect, Option, Stream } from "effect";
import { runCollect } from "effect/Stream";
import { itemsDb } from "~/database/lmdb.database";
import type { ItemDomain } from "~/domain/item.domain";
import { lmdbService } from "~/services/lmdb.service";

export const duxItemsRepository = Effect.gen(function* () {
  const db = yield* itemsDb;
  const dbService = lmdbService(db);

  const get = dbService.get;

  const getPage = (pageSize?: number, afterKey?: string) =>
    Effect.gen(function* () {
      const range = yield* dbService.getRange({
        start: afterKey,
        limit: pageSize,
      });

      return yield* Effect.sync(() => range.asArray);

      // return yield* Stream.fromIterable(range).pipe(
      //   Stream.tap(Console.log),

      //   Stream.runCollect,
      //   Effect.tap(Console.log),
      //   Effect.map((chunk) => ({
      //     items: Chunk.toArray(chunk),
      //     afterKey: Option.getOrUndefined(Chunk.last(chunk))?.key,
      //   }))
      // );
    });

  const batchPut = (items: ItemDomain[]) =>
    dbService.batchPut(items.map((item) => ({ key: item.sku, value: item })));

  const batchDelete = dbService.batchDelete;

  const getMany = dbService.getMany;

  const listKeys = Effect.gen(function* () {
    const skuRange = yield* dbService.getKeys();

    return yield* Stream.fromIterable(skuRange).pipe(
      runCollect,
      Effect.map((chunk) => Chunk.toArray(chunk))
    );
  });

  return {
    get,
    batchPut,
    batchDelete,
    listKeys,
    getPage,
    getMany,
  };
});
