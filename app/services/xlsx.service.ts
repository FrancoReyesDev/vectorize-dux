import { Effect } from "effect";
import * as XLSX from "xlsx";
import type { PriceListDomain } from "~/domain/price-list.domain";
import type { DuxPriceListItemDTO } from "~/dto/dux-price-list-item.dto";

export const parseXlsx = <T>(
  file: File,
  options: XLSX.Sheet2JSONOpts = { defval: undefined }
) =>
  Effect.gen(function* () {
    const arrayBuffer = yield* Effect.tryPromise(() => file.arrayBuffer());
    const workbook = yield* Effect.try(() =>
      XLSX.read(arrayBuffer, { type: "array" })
    );
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    return yield* Effect.try(() =>
      XLSX.utils.sheet_to_json<T>(worksheet, options)
    );
  });

export const parsePriceListFile = (
  file: File
): Effect.Effect<PriceListDomain, Error> =>
  Effect.gen(function* () {
    const metadata = yield* Effect.gen(function* () {
      const aoa = yield* parseXlsx<string[]>(file, {
        header: 1,
        range: "A3:B6",
      });

      const map = new Map(aoa.map((row) => [row[0], row[1]]));

      return {
        id: map.get("ID") || "",
        name: map.get("LISTA DE PRECIO") || "",
        type: map.get("Tipo de Lista de Precio") || "",
        relatedList: map.get("Lista de Precio Relacionada"),
      };
    });

    const items = yield* Effect.gen(function* () {
      const aoj = yield* parseXlsx<DuxPriceListItemDTO>(file, { range: 7 });
      return aoj.map((item) => ({
        sku: item["Cod Producto"],
        currency: item.Moneda,
        cost: item.Costo,
        costRelatedList: item["Costo de Lista Asociado"],
        refPercentage: item["Porc Referencia"],
        sellPrice: item["Precio de Venta"],
        ivaSellPrice: item["Precio De Venta Con Iva"],
      }));
    });

    return { metadata, items };
  });
