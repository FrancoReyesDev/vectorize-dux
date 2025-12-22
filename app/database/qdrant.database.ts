import { QdrantClient } from "@qdrant/js-client-rest";
import { Data, Effect, pipe } from "effect";

export class QdrantError extends Data.TaggedError("QdrantError")<{
  message: string;
  cause: unknown;
}> {}

const getClient = Effect.try({
  try: () =>
    new QdrantClient({
      url: process.env.QDRANT_HOST || "http://localhost:6333",
    }),
  catch: (error) => new QdrantError({ message: "Error", cause: error }),
});

export const ensureCollection = (
  client: QdrantClient,
  collectionName: string = "items"
) =>
  Effect.gen(function* () {
    const { collections } = yield* Effect.tryPromise({
      try: () => client.getCollections(),
      catch: (error) =>
        new QdrantError({ message: "Error getting collection", cause: error }),
    });
    const collectionExist = collections.some(
      (collection) => collection.name === collectionName
    );

    if (!collectionExist)
      yield* Effect.tryPromise({
        try: () =>
          client.createCollection(collectionName, {
            vectors: {
              size: Number(process.env.EMBEDDING_DIM) || 1024,
              distance: "Cosine",
            },
          }),
        catch: (error) =>
          new QdrantError({
            message: "Error Creating collection",
            cause: error,
          }),
      });
  });

export const client = (collectionName: string) =>
  pipe(
    getClient,
    Effect.tap((client) => ensureCollection(client, collectionName))
  );
