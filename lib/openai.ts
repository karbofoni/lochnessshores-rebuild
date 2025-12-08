import OpenAI from 'openai';

// Lazy initialization to avoid build-time errors
let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
    if (!openaiClient) {
        openaiClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    return openaiClient;
}

// Type for JSON schema response format
export interface JSONSchemaResponseFormat {
    type: 'json_schema';
    json_schema: {
        name: string;
        strict?: boolean;
        schema: Record<string, unknown>;
    };
}

// Helper for chat completion with JSON schema
export async function chatCompletionWithSchema<T>(options: {
    systemPrompt: string;
    userMessage: string;
    schema: JSONSchemaResponseFormat;
    model?: string;
}): Promise<T> {
    const client = getOpenAIClient();

    const response = await client.chat.completions.create({
        model: options.model || 'gpt-4o-mini',
        response_format: options.schema,
        messages: [
            { role: 'system', content: options.systemPrompt },
            { role: 'user', content: options.userMessage },
        ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
        throw new Error('No response from OpenAI');
    }

    return JSON.parse(content) as T;
}

// Helper for simple text completion
export async function chatCompletion(options: {
    systemPrompt: string;
    userMessage: string;
    model?: string;
}): Promise<string> {
    const client = getOpenAIClient();

    const response = await client.chat.completions.create({
        model: options.model || 'gpt-4o-mini',
        messages: [
            { role: 'system', content: options.systemPrompt },
            { role: 'user', content: options.userMessage },
        ],
    });

    return response.choices[0]?.message?.content || '';
}
