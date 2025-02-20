import type { TruffleAI } from './client';
import {
    AgentConfig,
    ChatMessage,
    ChatResponse,
    RunResponse,
    ValidationError,
    TruffleError
} from './types';

/**
 * Represents a deployed TruffleAI agent that can be used for chat and task execution
 * @example
 * const agent = await client.deployAgent({
 *   name: 'My Assistant',
 *   instruction: 'Help users with their questions',
 *   model: 'gpt-4'
 * });
 * 
 * // Run a one-off task
 * const result = await agent.run('What is the capital of France?');
 * 
 * // Start a chat session
 * const chat = agent.chat();
 * const response = await chat.send('Hello!');
 */
export class Agent {
    /**
     * Creates a new Agent instance
     * @param id The unique identifier of the agent
     * @param config The agent's configuration
     * @param client The TruffleAI client instance
     */
    constructor(
        private readonly id: string,
        private readonly config: AgentConfig,
        private readonly client: TruffleAI
    ) {
        if (!id) {
            throw new ValidationError('Agent ID is required');
        }
        if (!config) {
            throw new ValidationError('Agent configuration is required');
        }
    }

    /**
     * Runs a one-off task with the agent
     * @param input The input text for the task
     * @param json_mode Whether to return the response in JSON format
     * @param json_format Optional JSON schema to validate the response against
     * @returns The agent's response
     * @throws {ValidationError} If the input is empty
     * @throws {TruffleError} If the request fails
     */
    async run(
        input: string,
        json_mode?: boolean,
        json_format?: string
    ): Promise<RunResponse> {
        if (!input?.trim()) {
            throw new ValidationError('Input is required');
        }

        // Construct payload with optional fields only included when defined
        // Using spread operator with logical AND to conditionally add properties
        const payload = {
            input_data: input,
            ...(json_mode !== undefined && { json_mode }),
            ...(json_format !== undefined && { json_format })
        };

        const response = await this.client.makeRequest<RunResponse>(
            `agents/${this.id}/run`,
            'POST',
            payload
        );

        return response;
    }

    /**
     * Creates a new chat session with the agent
     * @returns A new AgentChat instance
     */
    chat(): AgentChat {
        return new AgentChat(this.id, this.client);
    }

    /**
     * Gets the agent's unique identifier
     * @returns The agent ID
     */
    getId(): string {
        return this.id;
    }

    /**
     * Gets the agent's configuration
     * @returns A copy of the agent's configuration
     */
    getConfig(): AgentConfig {
        return { ...this.config };
    }

    /**
     * Updates the agent's configuration
     * @param updates Partial configuration updates
     * @throws {ValidationError} If the updates are invalid
     * @throws {TruffleError} If the update request fails
     */
    async update(updates: Partial<AgentConfig>): Promise<void> {
        const response = await this.client.makeRequest<{ success: boolean; data: { config: AgentConfig } }>(
            `agents/${this.id}`,
            'PUT',
            updates
        );

        if (!response.success) {
            throw new TruffleError('Failed to update agent', 500);
        }

        Object.assign(this.config, response.data.config);
    }

    /**
     * Deletes the agent
     * @throws {TruffleError} If the delete request fails
     */
    async delete(): Promise<void> {
        await this.client.makeRequest(
            `agents/${this.id}`,
            'DELETE'
        );
    }
}

/**
 * Manages a chat session with an agent
 */
class AgentChat {
    private messages: ChatMessage[] = [];

    constructor(
        private readonly agentId: string,
        private readonly client: TruffleAI
    ) {
        if (!agentId) {
            throw new ValidationError('Agent ID is required');
        }
    }

    /**
     * Sends a message to the agent
     * @param message The message to send
     * @returns The agent's response
     * @throws {ValidationError} If the message is empty
     * @throws {TruffleError} If the request fails
     */
    async send(message: string): Promise<string> {
        if (!message?.trim()) {
            throw new ValidationError('Message is required');
        }

        const userMessage: ChatMessage = {
            role: 'user',
            content: message
        };

        this.messages.push(userMessage);

        const response = await this.client.makeRequest<ChatResponse>(
            `agents/${this.agentId}/chat`,
            'POST',
            { messages: this.messages }
        );

        const assistantMessage = response.message;
        this.messages.push({ role: 'assistant', content: assistantMessage });
        
        return assistantMessage;
    }

    /**
     * Gets the chat history
     * @returns A copy of the chat messages
     */
    getHistory(): ChatMessage[] {
        return [...this.messages];
    }

    /**
     * Clears the chat history
     */
    clearHistory(): void {
        this.messages = [];
    }
} 