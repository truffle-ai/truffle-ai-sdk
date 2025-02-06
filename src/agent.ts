import type { TruffleAI } from './client';
import { AgentConfig, ChatMessage, RunResponse } from './types';

export class Agent {
    constructor(
        private readonly id: string,
        private readonly config: AgentConfig,
        private readonly client: TruffleAI
    ) {}

    // Run a one-off task
    async run(input: string): Promise<RunResponse> {
        const response = await this.client.makeRequest(
            `agents/${this.id}/run`,
            'POST',
            { input_data: input }
        ) as RunResponse;
        return response;
    }

    // Create a chat session
    chat(): AgentChat {
        return new AgentChat(this.id, this.client);
    }

    // Get agent info
    getId(): string {
        return this.id;
    }

    getConfig(): AgentConfig {
        return { ...this.config };
    }
}

class AgentChat {
    private messages: ChatMessage[] = [];

    constructor(
        private readonly agentId: string,
        private readonly client: TruffleAI
    ) {}

    async send(message: string): Promise<string> {
        const userMessage: ChatMessage = {
            role: 'user',
            content: message
        };

        this.messages.push(userMessage);

        const response = await this.client.chat(this.agentId, this.messages) as { message?: string; data?: string };
        const assistantMessage = response.message || response.data || '';

        this.messages.push({ role: 'assistant', content: assistantMessage });
        return assistantMessage;
    }

    getHistory(): ChatMessage[] {
        return [...this.messages];
    }
} 