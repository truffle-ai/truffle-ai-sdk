export interface AgentConfig {
    name: string;
    instruction: string;
    model: string;
    tool?: string;
    components?: string;
}

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface RunResponse {
    success: boolean;
    data: string | Record<string, any>;
    error?: string;
}

export interface DeployedAgent {
    agent_id: string;
    config: AgentConfig;
    created_at: string;
    updated_at: string;
} 