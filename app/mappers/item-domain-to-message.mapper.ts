import type { ItemDomain } from "~/domain/item.domain";

export const itemDomainToMessage = (itemDomain: ItemDomain) => {
  return `*\`${itemDomain.title}\`* 

\`$${itemDomain.priceLists.list?.price.ivaSellPrice || itemDomain.priceLists.list?.price.sellPrice}\` *PRECIO LISTA 3 CUOTAS SIN INTERES*

\`$${itemDomain.priceLists.card?.price.ivaSellPrice || itemDomain.priceLists.card?.price.sellPrice}\` con *TARJETA DE CREDITO EN 1 PAGO o DEBITO*. 💳 

\`$${itemDomain.priceLists.cash?.price.ivaSellPrice || itemDomain.priceLists.cash?.price.sellPrice}\` en *EFECTIVO o TRANSFERENCIA BANCARIA* 💵`;
};
