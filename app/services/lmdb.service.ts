import { Data, Effect, pipe } from "effect";
import type { Database, RangeOptions, Key } from "lmdb";

export class LmdbError extends Data.TaggedError("LmdbError")<{
  message: string;
  cause: unknown;
}> {}

export const lmdbService = <T>(db: Database<T>) => ({
  get: (key: string) =>
    pipe(
      Effect.try({
        try: () => db.get(key),
        catch: (error) =>
          new LmdbError({ message: `Error getting key: ${key}`, cause: error }),
      }),
      Effect.flatMap(Effect.fromNullable)
    ),

  getRange: (options?: RangeOptions) =>
    Effect.try({
      try: () => db.getRange(options),
      catch: (error) =>
        new LmdbError({ message: "Error getting range", cause: error }),
    }),

  transaction: (fn: () => void) =>
    Effect.try({
      try: () => db.transaction(fn),
      catch: (error) =>
        new LmdbError({ message: "Error in transaction", cause: error }),
    }),

  put: (key: Key, value: T) =>
    Effect.tryPromise({
      try: () => db.put(key, value),
      catch: (error) =>
        new LmdbError({
          message: `Error putting key: ${key.toString()}`,
          cause: error,
        }),
    }),

  remove: (key: Key) =>
    Effect.tryPromise({
      try: () => db.remove(key),
      catch: (error) =>
        new LmdbError({
          message: `Error removing key: ${key.toString()}`,
          cause: error,
        }),
    }),

  getMany: (keys: Key[]) =>
    Effect.tryPromise({
      try: () => db.getMany(keys),
      catch: (error) =>
        new LmdbError({ message: "Error getting many items", cause: error }),
    }),

  getKeys: (options?: RangeOptions) =>
    Effect.try({
      try: () => db.getKeys(options),
      catch: (error) =>
        new LmdbError({ message: "Error listing keys", cause: error }),
    }),

  clearSync: Effect.try({
    try: () => db.clearSync(),
    catch: (error) =>
      new LmdbError({ message: "Error clearing database", cause: error }),
  }),
  batchPut: (items: { key: Key; value: T }[]) =>
    Effect.tryPromise({
      try: () =>
        db.transaction(() => {
          items.forEach(({ key, value }) => db.put(key, value));
        }),
      catch: (error) =>
        new LmdbError({ message: "Error batch putting items", cause: error }),
    }),

  batchDelete: (keys: Key[]) =>
    Effect.tryPromise({
      try: () =>
        db.transaction(() => {
          keys.forEach((key) => db.remove(key));
        }),
      catch: (error) =>
        new LmdbError({ message: "Error batch deleting items", cause: error }),
    }),
});
