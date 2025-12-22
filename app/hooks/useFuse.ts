import type { ItemDomain } from "~/domain/item.domain";
import Fuse from "fuse.js";
import { useCallback, useMemo } from "react";

export const useFuse = (items: ItemDomain[], limit: number = 50) => {
  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: ["sku", "title"],
        ignoreLocation: true,
      }),
    [items]
  );

  const search = useCallback(
    (pattern: string) => fuse.search(pattern, { limit }),
    [fuse, limit]
  );

  return { search };
};
