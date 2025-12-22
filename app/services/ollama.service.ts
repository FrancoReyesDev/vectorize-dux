import { Console, Data, Effect } from "effect";
import ollama from "ollama";

class OllamaError extends Data.TaggedError("OllamaError")<{
  message: string;
  cause?: unknown;
}> {}

export const embed = (input: string[]) =>
  Effect.tryPromise({
    try: () =>
      ollama.embed({ model: process.env.OLLAMA_MODEL || "bge-m3", input }),
    catch: (error) =>
      new OllamaError({ message: "Error embedding", cause: error }),
  }).pipe(Effect.tapError((error) => Console.log(error)));
