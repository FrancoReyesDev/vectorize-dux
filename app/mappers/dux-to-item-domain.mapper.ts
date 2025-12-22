import type { DuxItemDTO } from "../dto/dux-item.dto";
import type { ItemDomain, ListPriceDomain } from "../domain/item.domain";
import type {
  PriceListDomain,
  PriceListItemDomain,
} from "../domain/price-list.domain";

function mapToListPrice(
  metadata?: PriceListDomain["metadata"],
  price?: PriceListItemDomain
): ListPriceDomain | undefined {
  return metadata && price
    ? {
        metadata,
        price,
      }
    : undefined;
}

interface Params {
  itemDTO: DuxItemDTO;
  listMetadata?: PriceListDomain["metadata"];
  listPrice?: PriceListItemDomain;
  cardMetadata?: PriceListDomain["metadata"];
  cardPrice?: PriceListItemDomain;
  cashMetadata?: PriceListDomain["metadata"];
  cashPrice?: PriceListItemDomain;
}

export function duxToItemDomain({
  itemDTO,
  listMetadata,
  listPrice: listItem,
  cardMetadata,
  cardPrice: cardItem,
  cashMetadata,
  cashPrice: cashItem,
}: Params): ItemDomain {
  return {
    sku: itemDTO.CODIGO,
    title: itemDTO.PRODUCTO,
    heading: itemDTO.RUBRO,
    subHeading: itemDTO["SUB RUBRO"] || undefined,
    vendor: itemDTO.PROVEEDOR,
    cost: itemDTO.COSTO,
    measureUnit: itemDTO["UNIDAD MEDIDA"],
    unitsPerPallet: itemDTO["UNIDADES POR BULTO"],
    brand: itemDTO.MARCA,
    iva: itemDTO["PORCENTAJE IVA"],
    externalCode: itemDTO["CODIGO EXTERNO"],
    barcode: itemDTO["COD BARRA"],
    totalCost: itemDTO["COSTO TOTAL"],
    usesVariants: itemDTO["UTILIZA VARIANTES"] === "S",
    productType: itemDTO["TIPO DE PRODUCTO"],
    description: itemDTO.DESCRIPCION,
    currency: itemDTO.MONEDA,
    internalTax: itemDTO["IMPUESTO INTERNO"],
    priceLists: {
      list: mapToListPrice(listMetadata, listItem),
      card: mapToListPrice(cardMetadata, cardItem),
      cash: mapToListPrice(cashMetadata, cashItem),
    },
  };
}
