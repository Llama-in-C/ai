export type AphroditeEngineEmbeddingModelId = 'aphrodite-engine-embed' | (string & {});

export interface AphroditeEngineEmbeddingSettings {
    /**
     Override the maximum number of embeddings per call.
     */
    maxEmbeddingsPerCall?: number;

    /**
     Override the parallelism of embedding calls.
     */
    supportsParallelCalls?: boolean;
}