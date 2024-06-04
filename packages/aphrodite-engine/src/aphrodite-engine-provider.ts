import {
    generateId,
    loadApiKey,
    withoutTrailingSlash,
} from '@ai-sdk/provider-utils';
import { AphroditeEngineLanguageModel } from './aphrodite-engine-language-model';
import {
    AphroditeEngineModelId,
    AphroditeEngineSettings,
} from './aphrodite-engine-settings';
import {
    AphroditeEngineEmbeddingModelId,
    AphroditeEngineEmbeddingSettings,
} from './aphrodite-engine-embedding-settings';
import { AphroditeEngineEmbeddingModel } from './aphrodite-engine-embedding-model';

export interface AphroditeEngineProvider {
    (
        modelId: AphroditeEngineModelId,
        settings?: AphroditeEngineSettings,
    ): AphroditeEngineLanguageModel;

    /**
     Creates a model for text generation.
     */
    chat(
        modelId: AphroditeEngineModelId,
        settings?: AphroditeEngineSettings,
    ): AphroditeEngineLanguageModel;

    /**
     Creates a model for text embeddings.
     */
    embedding(
        modelId: AphroditeEngineEmbeddingModelId,
        settings?: AphroditeEngineEmbeddingSettings,
    ): AphroditeEngineEmbeddingModel;
}

export interface AphroditeEngineProviderSettings {
    /**
     Use a different URL prefix for API calls, e.g. to use proxy servers.
     The default prefix is `https://127.0.0.1:2242/v1`.
     */
    baseURL?: string;

    /**
     @deprecated Use `baseURL` instead.
     */
    baseUrl?: string;

    /**
     API key that is being send using the `Authorization` header.
     It defaults to the `X_API_KEY` environment variable.
     */
    apiKey?: string;

    /**
     Custom headers to include in the requests.
     */
    headers?: Record<string, string>;

    generateId?: () => string;
}

/**
 Create a AphroditeEngine AI provider instance.
 */
export function createAphroditeEngine(
    options: AphroditeEngineProviderSettings = {},
): AphroditeEngineProvider {
    const baseURL =
        withoutTrailingSlash(options.baseURL ?? options.baseUrl) ??
        'https://127.0.0.1:2242/v1';

    const getHeaders = () => ({
        Authorization: `Bearer ${loadApiKey({
            apiKey: options.apiKey,
            environmentVariableName: 'X_API_KEY',
            description: 'Aphrodite Engine API Key',
        })}`,
        ...options.headers,
    });

    const createChatModel = (
        modelId: AphroditeEngineModelId,
        settings: AphroditeEngineSettings = {},
    ) =>
        new AphroditeEngineLanguageModel(modelId, settings, {
            provider: 'aphroditeEngine.chat',
            baseURL,
            headers: getHeaders,
            generateId: options.generateId ?? generateId,
        });

    const createEmbeddingModel = (
        modelId: AphroditeEngineEmbeddingModelId,
        settings: AphroditeEngineEmbeddingSettings = {},
    ) =>
        new AphroditeEngineEmbeddingModel(modelId, settings, {
            provider: 'aphroditeEngine.embedding',
            baseURL,
            headers: getHeaders,
        });

    const provider = function (
        modelId: AphroditeEngineModelId,
        settings?: AphroditeEngineSettings,
    ) {
        if (new.target) {
            throw new Error(
                'The AphroditeEngine model function cannot be called with the new keyword.',
            );
        }

        return createChatModel(modelId, settings);
    };

    provider.chat = createChatModel;
    provider.embedding = createEmbeddingModel;

    return provider as AphroditeEngineProvider;
}

/**
 Default AphroditeEngine provider instance.
 */
export const aphroditeEngine = createAphroditeEngine();