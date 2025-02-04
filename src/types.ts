export interface AgentConfig {
    name: string;
    instruction: string;
    model: "gpt-4o-mini" | string;
    tool?: string;
    config?: {
        temperature?: number;
        [key: string]: any;
    };

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
    id: string;
    config: AgentConfig;
    created_at: string;
    updated_at: string;
} 