export interface PriceListMetadataDomain {
  id: string;
  name: string;
  type: string;
  relatedList?: string;
}

export interface PriceListItemDomain {
  sku: string;
  currency: string;
  cost: number;
  costRelatedList: number;
  refPercentage: number;
  sellPrice: number;
  ivaSellPrice: number;
}

export interface PriceListDomain {
  metadata: PriceListMetadataDomain;
  items: PriceListItemDomain[];
}
