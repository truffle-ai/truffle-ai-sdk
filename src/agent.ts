import type { TruffleAI } from './client';
import { AgentConfig, ChatMessage, RunResponse } from './types';

export class Agent {
    private config: AgentConfig;
    private deployedId?: string;
    private client?: TruffleAI;

    constructor(config: AgentConfig) {
        this.validateConfig(config);
        this.config = config;
    }

    private validateConfig(config: AgentConfig) {
        if (!config.name) throw new Error('Agent name is required');
        if (!config.instruction) throw new Error('Agent instruction is required');
        if (!config.model) throw new Error('Model specification is required');
        
        // Additional validation as needed
    }

    public getConfig(): AgentConfig {
        return { ...this.config };
    }

    public setDeployedId(id: string) {
        this.deployedId = id;
    }

    public setClient(client: TruffleAI) {
        this.client = client;
    }

    public async run(input: string): Promise<RunResponse> {
        if (!this.deployedId) {
            throw new Error('Agent must be deployed before running');
        }
        if (!this.client) {
            throw new Error('Agent missing client reference. Deploy via TruffleAI.');
        }
        const response = await this.client.run(this.deployedId, input) as RunResponse;
        return response;
    }

    public createChat() {
        if (!this.deployedId) {
            throw new Error('Agent must be deployed before creating chat');
        }
        if (!this.client) {
            throw new Error('Agent missing client reference. Deploy via TruffleAI.');
        }
        return new AgentChat(this.deployedId, this.client);
    }
}

class AgentChat {
    private messages: ChatMessage[] = [];
    private client: TruffleAI;
    private agentId: string;

    constructor(agentId: string, client: TruffleAI) {
        this.agentId = agentId;
        this.client = client;
    }

    public async send(message: string): Promise<string> {
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

    public getHistory(): ChatMessage[] {
        return [...this.messages];
    }
} 