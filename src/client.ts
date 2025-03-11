import { Agent } from './agent';
import {
    AgentConfig,
    ChatMessage,
    ChatResponse,
    TruffleAIOptions,
    TruffleError,
    ValidationError,
    AuthenticationError,
    DeployResponse,
    LoadAgentResponse,
    NodeFile
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
     * @param config The agent configuration
     * @param ragFile Optional file to use for RAG (Browser File or Node.js file-like object)
     * @returns A promise that resolves to the created agent
     */
    async deployAgent(config: AgentConfig, ragFile?: File | NodeFile): Promise<Agent> {
        // First upload RAG file if provided
        let documentId: string | undefined;
        
        if (ragFile) {
            // Upload the file
            const uploadResult = await this.uploadRAGFile(ragFile);
            documentId = uploadResult.documentId;
        }
        
        // Include documentId in the agent configuration if available
        const agentConfig: AgentConfig = {
            ...config,
            ...(documentId && { documentId })
        };
        
        // Create the agent with the existing logic
        const response = await this.makeRequest<{ success: boolean; data: { agent_id: string } }>(
            'agents',
            'POST',
            agentConfig
        );
        
        if (!response.success) {
            throw new TruffleError('Failed to create agent', 500);
        }
        
        return new Agent(response.data.agent_id, agentConfig, this);
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
            throw new TruffleError('Failed to load agent', 500, response);
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
    /**
     * Uploads a file for RAG processing
     * @param file The file to upload (Browser File or Node.js file-like object)
     * @returns A promise that resolves to the document ID
     */
    async uploadRAGFile(file: File | NodeFile): Promise<{ documentId: string }> {
        const formData = new FormData();
        
        // Handle both browser File objects and Node.js file-like objects
        if ('data' in file) {
            // Node.js environment - create a blob from the data
            const blob = new Blob([file.data as ArrayBuffer], { type: file.type });
            formData.append('file', blob, file.name);
        } else {
            // Browser environment - use File object directly
            formData.append('file', file);
        }

        const response = await this.makeFormDataRequest<{ documentId: string }>(
            'rag/upload',
            'POST',
            formData
        );

        return { documentId: response.documentId };
    }

    /**
     * Makes a request with FormData payload
     */
    private async makeFormDataRequest<T>(
        endpoint: string,
        method: string,
        formData: FormData
    ): Promise<T> {
        const url = `${this.baseUrl}/api/v1/${endpoint}`;

        const headers = {
            'x-api-key': this.apiKey
        };

        const response = await fetch(url, {
            method,
            headers,
            body: formData
        });

        if (!response.ok) {
            // Get the response text for better error debugging
            const responseText = await response.text();
            try {
                // Try to parse as JSON
                const errorData = JSON.parse(responseText) as { error: string };
                throw new TruffleError(errorData.error || 'Request failed', response.status);
            } catch (e) {
                // If parsing fails, return the raw text
                throw new TruffleError(`Request failed: ${responseText}`, response.status);
            }
        }

        // Parse the response as JSON
        const responseText = await response.text();
        if (!responseText) {
            return {} as T;
        }
        return JSON.parse(responseText) as T;
    }
}