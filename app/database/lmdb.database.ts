import { Data, Effect } from "effect";
import { type RootDatabase, open } from "lmdb";
import type { ItemDomain } from "~/domain/item.domain";

class LmdbError extends Data.TaggedError("LmdbError")<{
  message: string;
  cause: unknown;
}> {}

const acquire = Effect.try({
  try: () => open(process.env.LMDB_PATH || "data/lmdb", {}),
  catch: (error) =>
    new LmdbError({ message: "Error connecting to LMDB", cause: error }),
});

const release = (rootDb: RootDatabase) => Effect.promise(() => rootDb.close());

export const rootDb = Effect.acquireRelease(acquire, release);

export const itemsDb = rootDb.pipe(
  Effect.flatMap((rootDb) =>
    Effect.try({
      try: () => rootDb.openDB<ItemDomain>("items", {}),
      catch: (error) =>
        new LmdbError({ message: "Error opening items DB", cause: error }),
    })
  )
);

export const labelsDb = rootDb.pipe(
  Effect.flatMap((rootDb) =>
    Effect.try({
      try: () => rootDb.openDB<string>("labels", {}),
      catch: (error) =>
        new LmdbError({ message: "Error opening labels DB", cause: error }),
    })
  )
);
