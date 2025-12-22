import { Effect } from "effect";
import { client, QdrantError } from "~/database/qdrant.database";

export const titleVectorsRepository = Effect.gen(function* () {
  const collectionName = "titles";
  const titlesVectorStore = yield* client(collectionName);

  const retrieve = (skus: string[]) =>
    Effect.tryPromise({
      try: () =>
        titlesVectorStore.retrieve(collectionName, {
          ids: skus,
          with_payload: false,
          with_vector: false,
        }),
      catch: (error) =>
        new QdrantError({ message: "Error retrieving points", cause: error }),
    });

  const batchPut = (vectors: { key: string; vector: number[] }[]) =>
    Effect.tryPromise({
      try: () =>
        titlesVectorStore.upsert(collectionName, {
          points: vectors.map(({ key, vector }) => ({
            id: key,
            vector,
          })),
        }),
      catch: (error) =>
        new QdrantError({ message: "Error upserting points", cause: error }),
    });

  const batchDelete = (skus: string[]) =>
    Effect.tryPromise({
      try: () =>
        titlesVectorStore.delete(collectionName, {
          points: skus,
        }),
      catch: (error) =>
        new QdrantError({ message: "Error deleting points", cause: error }),
    });

  return { retrieve, batchPut, batchDelete };
});
