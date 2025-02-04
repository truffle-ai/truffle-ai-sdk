import { Agent } from './agent';
import { AgentConfig, DeployedAgent, ChatMessage } from './types';

export class TruffleAI {
    private apiKey: string;
    private baseUrl: string;

    constructor(config: { apiKey: string; baseUrl?: string }) {
        this.apiKey = config.apiKey;
        this.baseUrl = config.baseUrl || 'https://www.trytruffle.ai';
    }

    private async makeRequest(
        endpoint: string,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        body?: unknown
    ) {
        const response = await fetch(`${this.baseUrl}/api/v1/${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            const errorData = await response.json() as { error?: string };
            throw new Error(errorData.error || 'Request failed');
        }

        return response.json();
    }

    public async deploy(agent: Agent): Promise<DeployedAgent> {
        const config = agent.getConfig();
        const response = await this.makeRequest('agents', 'POST', config) as { success: boolean; data: DeployedAgent };
        
        if (response.success) {
            agent.setDeployedId(response.data.id);
            agent.setClient(this);
            return response.data;
        }
        
        throw new Error('Failed to deploy agent');
    }

    public async run(agentId: string, input: string) {
        return this.makeRequest(`agents/${agentId}/run`, 'POST', {
            input_data: input
        });
    }
    
    public async chat(agentId: string, messages: ChatMessage[]) {
        return this.makeRequest(`agents/${agentId}/chat`, 'POST', { messages });
    }
} 