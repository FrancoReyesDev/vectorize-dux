import type { Route } from "./+types/search";
import { Effect } from "effect";
import { duxItemsRepository } from "~/repository/dux-items.repository.server";
import { useFuse } from "~/hooks/useFuse";
import { useDebounce } from "use-debounce";
import { useEffect, useMemo, useState } from "react";
import type { ItemDomain } from "~/domain/item.domain";
import { Input } from "~/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Search, Copy } from "lucide-react";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { itemDomainToMessage } from "~/mappers/item-domain-to-message.mapper";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Búsqueda de Productos - Vectorize Dux" },
    { name: "description", content: "Busca productos en la base de datos" },
  ];
}

export async function loader() {
  const program = Effect.scoped(
    Effect.gen(function* () {
      const duxRepo = yield* duxItemsRepository;
      const items = yield* duxRepo.getPage();
      return items;
    })
  );

  return Effect.runPromise(program);
}

export default function SearchPage({ loaderData }: Route.ComponentProps) {
  const items = useMemo(
    () => loaderData.map((item) => item.value),
    [loaderData]
  );
  const { search } = useFuse(items, 10);
  const [pattern, setPattern] = useState("");
  const [value] = useDebounce(pattern, 300);
  const [results, setResults] = useState<ItemDomain[]>([]);

  useEffect(() => {
    if (value.trim()) {
      const searchResults = search(value);
      setResults(searchResults.map((result) => result.item));
    } else {
      setResults([]);
    }
  }, [value, search]);

  const formatPrice = (price?: number) => {
    if (!price) return "-";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  const copyToClipboard = (item: ItemDomain) => {
    const text = itemDomainToMessage(item);
    navigator.clipboard.writeText(text);
    toast(`${item.sku} - Copiado al portapapeles`);
  };

  const copySkuToClipboard = (sku: string) => {
    navigator.clipboard.writeText(sku);
    toast(`${sku} - Copiado al portapapeles`);
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Búsqueda de Productos</CardTitle>
          <CardDescription>
            Busca productos por SKU o título. Total de productos:{" "}
            {loaderData.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por SKU o título..."
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="pl-10"
            />
          </div>

          {results.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {results.length} resultado{results.length !== 1 ? "s" : ""}{" "}
                encontrado{results.length !== 1 ? "s" : ""}
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead className="text-right">
                      3 Cuotas / Lista
                    </TableHead>
                    <TableHead className="text-right">
                      1 Pago / Tarjeta
                    </TableHead>
                    <TableHead className="text-right">
                      Efectivo / Transferencia
                    </TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((item) => (
                    <TableRow key={item.sku}>
                      <TableCell className="font-mono text-xs">
                        <span
                          onClick={() => copySkuToClipboard(item.sku)}
                          className="cursor-pointer underline decoration-1 decoration-muted-foreground/30 hover:decoration-foreground hover:decoration-2 transition-all"
                          title="Click para copiar SKU"
                        >
                          {item.sku}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.title}
                      </TableCell>
                      <TableCell>{item.brand}</TableCell>
                      <TableCell>{item.vendor}</TableCell>
                      <TableCell className="text-right">
                        {formatPrice(item.priceLists.list?.price.ivaSellPrice)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPrice(item.priceLists.card?.price.ivaSellPrice)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPrice(item.priceLists.cash?.price.ivaSellPrice)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(item)}
                          title="Copiar SKU"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {pattern.trim() && results.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No se encontraron resultados para "{pattern}"
            </p>
          )}

          {!pattern.trim() && (
            <p className="text-center text-muted-foreground py-8">
              Escribe algo para buscar productos
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
