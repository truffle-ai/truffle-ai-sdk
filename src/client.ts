import { Agent } from './agent';
import { AgentConfig, DeployedAgent, ChatMessage, RunResponse } from './types';

export class TruffleAI {
    private apiKey: string;
    private baseUrl: string;

    constructor(apiKey: string, options?: { baseUrl?: string }) {
        this.apiKey = apiKey;
        this.baseUrl = options?.baseUrl || 'https://www.trytruffle.ai';
    }

    async deployAgent(config: AgentConfig): Promise<Agent> {
        const response = await this.makeRequest('agents', 'POST', config) as { success: boolean; data: DeployedAgent };
        
        if (!response.success) {
            throw new Error('Failed to deploy agent');
        }

        return new Agent(response.data.id, config, this);
    }

    async loadAgent(agentId: string): Promise<Agent> {
        const response = await this.makeRequest(`agents/${agentId}`, 'GET') as { success: boolean; data: DeployedAgent };
        
        if (!response.success) {
            throw new Error('Failed to load agent');
        }

        return new Agent(response.data.id, response.data.config, this);
    }

    async makeRequest(
        endpoint: string,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        body?: any
    ): Promise<unknown> {
        const response = await fetch(`${this.baseUrl}/api/v1/${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            const error = await response.json() as { error: string };
            throw new Error(error.error || 'Request failed');
        }

        return response.json();
    }

    async chat(agentId: string, messages: ChatMessage[]): Promise<unknown> {
        return this.makeRequest(
            `agents/${agentId}/chat`,
            'POST',
            { messages }
        );
    }
}