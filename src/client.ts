import { Agent } from './agent';
import {
    AgentConfig,
    DeployedAgent,
    ChatMessage,
    ChatResponse,
    RunResponse,
    TruffleAIOptions,
    TruffleError,
    ValidationError,
    AuthenticationError,
    DeployResponse,
    LoadAgentResponse
} from './types';

/**
 * Main client for interacting with the TruffleAI API
 * @example
 * const client = new TruffleAI('your-api-key');
 * 
 * const agent = await client.deployAgent({
 *   name: 'My Assistant',
 *   instruction: 'Help users with their questions',
 *   model: 'gpt-4'
 * });
 */
export class TruffleAI {
    private readonly apiKey: string;
    private readonly baseUrl: string;

    /**
     * Creates a new TruffleAI client instance
     * @param apiKey Your TruffleAI API key
     * @param options Configuration options
     */
    constructor(apiKey: string, options: TruffleAIOptions = {}) {
        if (!apiKey) {
            throw new ValidationError('API key is required');
        }

        this.apiKey = apiKey;
        this.baseUrl = options.baseUrl || 'https://www.trytruffle.ai';
    }

    /**
     * Deploys a new agent with the specified configuration
     * @param config Configuration for the new agent
     * @returns A new Agent instance
     * @throws {ValidationError} If the configuration is invalid
     * @throws {AuthenticationError} If the API key is invalid
     */
    async deployAgent(config: AgentConfig): Promise<Agent> {
        this.validateAgentConfig(config);

        const response = await this.makeRequest<{ success: boolean; data: DeployResponse }>(
            'agents',
            'POST',
            config
        );

        console.log(response);

        if (!response.success) {
            throw new TruffleError('Failed to deploy agent', 500);
        }

        return new Agent(response.data.agent_id, config, this);
    }

    /**
     * Loads an existing agent by ID
     * @param agentId ID of the agent to load
     * @returns An Agent instance
     * @throws {ValidationError} If the agent ID is invalid
     * @throws {TruffleError} If the agent is not found
     */
    async loadAgent(agentId: string): Promise<Agent> {
        if (!agentId) {
            throw new ValidationError('Agent ID is required');
        }

        const response = await this.makeRequest<{ success: boolean; data: LoadAgentResponse }>(
            `agents/${agentId}`,
            'GET'
        );

        console.log(response);
        
        if (!response.success) {
            throw new TruffleError('Failed to load agent', 500);
        }

        // Transform the config to match AgentConfig interface
        const config: AgentConfig = {
            ...response.data.config,
            model: response.data.config.selectedModel,
            tool: response.data.config.selectedTool
        };

        return new Agent(agentId, config, this);
    }

    /**
     * Makes an authenticated request to the TruffleAI API
     * @template T The expected response type
     * @param endpoint API endpoint to call
     * @param method HTTP method
     * @param body Optional request body
     * @returns The response data
     * @throws {TruffleError} If the request fails
     */
    async makeRequest<T>(
        endpoint: string,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        body?: unknown
    ): Promise<T> {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/${endpoint}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey
                },
                body: body ? JSON.stringify(body) : undefined
            });

            if (!response.ok) {
                const error = await response.json() as { error: string };
                
                if (response.status === 401) {
                    throw new AuthenticationError(error.error);
                }
                throw new TruffleError(error.error || 'Request failed', response.status);
            }

            return await response.json() as T;
        } catch (error) {
            if (error instanceof TruffleError) {
                throw error;
            }
            throw new TruffleError('Network error', 0);
        }
    }

    /**
     * Initiates a chat session with an agent
     * @param agentId ID of the agent to chat with
     * @param messages Array of chat messages
     * @returns The agent's response
     */
    async chat(agentId: string, messages: ChatMessage[]): Promise<ChatResponse> {
        return this.makeRequest<ChatResponse>(
            `agents/${agentId}/chat`,
            'POST',
            { messages }
        );
    }

    /**
     * Validates agent configuration
     * @param config Agent configuration to validate
     * @throws {ValidationError} If the configuration is invalid
     */
    private validateAgentConfig(config: AgentConfig): void {
        const requiredFields: (keyof AgentConfig)[] = ['name', 'instruction', 'model'];
        const missingFields = requiredFields.filter(field => !config[field]);

        if (missingFields.length > 0) {
            throw new ValidationError(
                `Missing required fields: ${missingFields.join(', ')}`,
                { fields: missingFields }
            );
        }
    }
}