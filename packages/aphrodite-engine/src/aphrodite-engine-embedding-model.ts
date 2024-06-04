import {
    EmbeddingModelV1,
    TooManyEmbeddingValuesForCallError,
} from '@ai-sdk/provider';
import {
    createJsonResponseHandler,
    postJsonToApi,
} from '@ai-sdk/provider-utils';
import { z } from 'zod';
import {
    AphroditeEngineEmbeddingModelId,
    AphroditeEngineEmbeddingSettings,
} from './aphrodite-engine-embedding-settings';
import { aphroditeEngineFailedResponseHandler } from './aphrodite-engine-error';

type AphroditeEngineEmbeddingConfig = {
    provider: string;
    baseURL: string;
    headers: () => Record<string, string | undefined>;
};

export class AphroditeEngineEmbeddingModel implements EmbeddingModelV1<string> {
    readonly specificationVersion = 'v1';
    readonly modelId: AphroditeEngineEmbeddingModelId;

    private readonly config: AphroditeEngineEmbeddingConfig;
    private readonly settings: AphroditeEngineEmbeddingSettings;

    get provider(): string {
        return this.config.provider;
    }

    get maxEmbeddingsPerCall(): number {
        return this.settings.maxEmbeddingsPerCall ?? 32;
    }

    get supportsParallelCalls(): boolean {
        // Parallel calls are technically possible,
        // but I have been hitting rate limits and disable them for now.
        return this.settings.supportsParallelCalls ?? false;
    }

    constructor(
        modelId: AphroditeEngineEmbeddingModelId,
        settings: AphroditeEngineEmbeddingSettings,
        config: AphroditeEngineEmbeddingConfig,
    ) {
        this.modelId = modelId;
        this.settings = settings;
        this.config = config;
    }

    async doEmbed({
                      values,
                      abortSignal,
                  }: Parameters<EmbeddingModelV1<string>['doEmbed']>[0]): Promise<
        Awaited<ReturnType<EmbeddingModelV1<string>['doEmbed']>>
    > {
        if (values.length > this.maxEmbeddingsPerCall) {
            throw new TooManyEmbeddingValuesForCallError({
                provider: this.provider,
                modelId: this.modelId,
                maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
                values,
            });
        }

        const { responseHeaders, value: response } = await postJsonToApi({
            url: `${this.config.baseURL}/embeddings`,
            headers: this.config.headers(),
            body: {
                model: this.modelId,
                input: values,
                encoding_format: 'float',
            },
            failedResponseHandler: aphroditeEngineFailedResponseHandler,
            successfulResponseHandler: createJsonResponseHandler(
                AphroditeEngineTextEmbeddingResponseSchema,
            ),
            abortSignal,
        });

        return {
            embeddings: response.data.map(item => item.embedding),
            rawResponse: { headers: responseHeaders },
        };
    }
}

// minimal version of the schema, focussed on what is needed for the implementation
// this approach limits breakages when the API changes and increases efficiency
const AphroditeEngineTextEmbeddingResponseSchema = z.object({
    data: z.array(
        z.object({
            embedding: z.array(z.number()),
        }),
    ),
});