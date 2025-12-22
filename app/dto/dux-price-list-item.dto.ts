export interface DuxPriceListItemDTO {
  "Cod Producto": string;
  Producto: string;
  "Cod Barra": string | number;

  Rubro: string;
  "Sub Rubro"?: string;

  Proveedor: string;
  Marca: string;
  Moneda: string;

  Costo: number;
  "Costo de Lista Asociado": number;
  "Porc Referencia": number;

  "Precio de Venta": number;
  "Precio De Venta Con Iva": number;

  "Fecha Ultima Modificacion": string;
  "Código Externo"?: string;
}
