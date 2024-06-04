import { createJsonErrorResponseHandler } from '@ai-sdk/provider-utils';
import { z } from 'zod';

const aphroditeEngineErrorDataSchema = z.object({
    object: z.literal('error'),
    message: z.string(),
    type: z.string(),
    param: z.string().nullable(),
    code: z.string().nullable(),
});

export type aphroditeEngineErrorData = z.infer<typeof aphroditeEngineErrorDataSchema>;

export const aphroditeEngineFailedResponseHandler = createJsonErrorResponseHandler({
    errorSchema: aphroditeEngineErrorDataSchema,
    errorToMessage: data => data.message,
});