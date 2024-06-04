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
import { AphroditeEngineProviderSettings } from './aphrodite-engine-provider';

/**
 * @deprecated Use `createAphroditeEngine` instead.
 */
export class AphroditeEngine {
    /**
     * Base URL for the AphroditeEngine API calls.
     */
    readonly baseURL: string;

    readonly apiKey?: string;

    readonly headers?: Record<string, string>;

    private readonly generateId: () => string;

    /**
     * Creates a new AphroditeEngine provider instance.
     */
    constructor(options: AphroditeEngineProviderSettings = {}) {
        this.baseURL =
            withoutTrailingSlash(options.baseURL ?? options.baseUrl) ??
            'https://127.0.0.1:2242/v1';

        this.apiKey = options.apiKey;
        this.headers = options.headers;
        this.generateId = options.generateId ?? generateId;
    }

    private get baseConfig() {
        return {
            baseURL: this.baseURL,
            headers: () => ({
                Authorization: `Bearer ${loadApiKey({
                    apiKey: this.apiKey,
                    environmentVariableName: 'X_API_KEY',
                    description: 'Aphrodite Engine API Key',
                })}`,
                ...this.headers,
            }),
        };
    }

    chat(modelId: AphroditeEngineModelId, settings: AphroditeEngineSettings = {}) {
        return new AphroditeEngineLanguageModel(modelId, settings, {
            provider: 'aphroditeEngine.chat',
            ...this.baseConfig,
            generateId: this.generateId,
        });
    }
}