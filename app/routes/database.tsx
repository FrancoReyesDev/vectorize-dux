import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import type { Route } from "../+types/root";
import { Effect } from "effect";
import { duxEtlUseCase } from "~/useCases/dux-etl.useCase.server";

enum FileTypes {
  Products = "productos",
  List = "lista-precio",
  Card = "lista-tarjeta",
  Cash = "lista-efectivo",
}

const handleFile = (formDataEntry: FormDataEntryValue | null) =>
  Effect.gen(function* () {
    if (!formDataEntry) {
      return yield* Effect.fail(new Error("No file provided"));
    }

    if (formDataEntry instanceof File && formDataEntry.size > 0) {
      return formDataEntry;
    }

    return yield* Effect.fail(new Error("Invalid file type"));
  });

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const program = Effect.scoped(
    Effect.gen(function* () {
      const products = formData.get(FileTypes.Products);
      const list = formData.get(FileTypes.List);
      const card = formData.get(FileTypes.Card);
      const cash = formData.get(FileTypes.Cash);

      const [
        productsFile,
        listPriceListFile,
        cardPriceListFile,
        cashPriceListFile,
      ] = yield* Effect.all([
        handleFile(products),
        handleFile(list),
        handleFile(card),
        handleFile(cash),
      ]);

      return yield* duxEtlUseCase({
        productsFile,
        listPriceListFile,
        cardPriceListFile,
        cashPriceListFile,
      });
    })
  );

  console.log("Starting ETL process...");
  console.log("LMDB_PATH:", process.env.LMDB_PATH);

  return Effect.runFork(
    program.pipe(
      Effect.tap(() => console.log("ETL process started successfully")),
      Effect.tapError((error) =>
        Effect.sync(() => console.error("ETL process failed to start", error))
      )
    )
  );
}

export default function Database({ actionData }: Route.ComponentProps) {
  const fetcher = useFetcher();
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Base de Datos</CardTitle>
        <CardDescription>
          Carga los archivos xlsx para vectorizar la base de datos de dux
        </CardDescription>
      </CardHeader>
      <CardContent>
        <fetcher.Form
          id="database-form"
          method="post"
          encType="multipart/form-data"
        >
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>Productos</FieldLabel>
                <Input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  name={FileTypes.Products}
                  required
                />
                <FieldDescription>
                  Sube el archivo de productos
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Lista de Precios (3 pagos sin interés)</FieldLabel>
                <Input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  name={FileTypes.List}
                  required
                />
                <FieldDescription>
                  Sube el archivo de lista de precios (precio de lista)
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Lista Tarjeta (1 pago)</FieldLabel>
                <Input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  name={FileTypes.Card}
                  required
                />
                <FieldDescription>
                  Sube el archivo de lista TARJETA (crédito/débito)
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Lista Efectivo</FieldLabel>
                <Input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  name={FileTypes.Cash}
                  required
                />
                <FieldDescription>
                  Sube el archivo de lista EFECTIVO (transferencia)
                </FieldDescription>
              </Field>
              <Field orientation="horizontal"></Field>
            </FieldGroup>
          </FieldSet>
        </fetcher.Form>
      </CardContent>
      <CardFooter className=" flex-col">
        <Button
          className="w-full"
          type="submit"
          form="database-form"
          disabled={fetcher.state !== "idle"}
        >
          {fetcher.state !== "idle" ? "Procesando..." : "Procesar"}
        </Button>
      </CardFooter>
    </Card>
  );
}
