export type AphroditeEngineModelId = (string & {});

export interface AphroditeEngineSettings {
    /**
     Whether to inject a safety prompt before all conversations.

     Defaults to `false`.
     */
    safePrompt?: boolean;
}