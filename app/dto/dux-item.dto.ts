export interface DuxItemDTO {
  CODIGO: string;
  PRODUCTO: string;
  COSTO: number;
  "DISPONIBLE PARA": string;
  RUBRO: string;
  "SUB RUBRO": string;
  PROVEEDOR: string;
  "UNIDAD MEDIDA": string;
  "UNIDADES POR BULTO": number;
  MARCA: string;
  "PORCENTAJE IVA": number;
  "CODIGO EXTERNO": string;
  "COD BARRA": string;
  "COSTO TOTAL": number;
  STOCKEABLE: "S" | "N";
  "UTILIZA VARIANTES": "S" | "N";
  "ACEPTA STOCK NEGATIVO": "S" | "N";
  "TIPO DE PRODUCTO": string;
  DESCRIPCION: string;
  "ULTIMA ACT. COSTO": string; // o Date si lo parseás
  MONEDA: string;
  "IMPUESTO INTERNO": number;
  COMPUESTO: "S" | "N";
}
