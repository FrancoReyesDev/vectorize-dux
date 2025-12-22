namespace NodeJS {
  interface ProcessEnv {
    OLLAMA_HOST: string;
    OLLAMA_MODEL: string;
    EMBEDDING_DIM: number;
    LMDB_PATH: string;
    FAISS_PATH: string;
    LANCEDB_PATH: string;
    QDRANT_HOST: string;
  }
}
