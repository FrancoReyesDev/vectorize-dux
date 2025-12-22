import type { PriceListDomain, PriceListItemDomain } from "./price-list.domain";

export interface ListPriceDomain {
  metadata: PriceListDomain["metadata"];
  price: PriceListItemDomain;
}

export interface ItemDomain {
  sku: string; // CODIGO
  title: string; // PRODUCTO
  heading: string; // RUBRO
  subHeading?: string; // SUB RUBRO
  vendor: string; // PROVEEDOR
  cost: number; // COSTO
  measureUnit: string; // UNIDAD MEDIDA
  unitsPerPallet: number; // UNIDADES POR BULTO
  brand: string; // MARCA
  iva: number; // PORCENTAJE IVA
  externalCode: string; // CODIGO EXTERNO
  barcode: string; // COD BARRA
  totalCost: number; // COSTO TOTAL
  usesVariants: boolean; // UTILIZA VARIANTES (S/N)
  productType: string; // TIPO DE PRODUCTO
  description: string; // DESCRIPCION
  currency: string; // MONEDA
  internalTax: number; // IMPUESTO INTERNO

  //   priceLists: PriceListDomain[];
  priceLists: {
    list?: ListPriceDomain; // 3 pagos sin interés
    card?: ListPriceDomain; // 1 pago con crédito/débito
    cash?: ListPriceDomain; // Efectivo/transferencia
  };
}
