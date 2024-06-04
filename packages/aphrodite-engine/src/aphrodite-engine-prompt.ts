export type AphroditeEnginePrompt = Array<AphroditeEngineMessage>;

export type AphroditeEngineMessage =
    | AphroditeEngineSystemMessage
    | AphroditeEngineUserMessage
    | AphroditeEngineAssistantMessage
    | AphroditeEngineToolMessage;

export interface AphroditeEngineSystemMessage {
    role: 'system';
    content: string;
}

export interface AphroditeEngineUserMessage {
    role: 'user';
    content: string;
}

export interface AphroditeEngineAssistantMessage {
    role: 'assistant';
    content: string;
    tool_calls?: Array<{
        id: string;
        type: 'function';
        function: { name: string; arguments: string };
    }>;
}

export interface AphroditeEngineToolMessage {
    role: 'tool';
    name: string;
    content: string;
}