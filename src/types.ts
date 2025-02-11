/**
 * Configuration options for creating or updating an agent
 */
export interface AgentConfig {
    /** Unique identifier of the agent */
    agent_id?: string;
    /** Name of the agent */
    name: string;
    /** Instructions that define the agent's behavior */
    instruction: string;
    /** Model to be used by the agent (e.g. 'gpt-4') */
    model: string;
    /** Optional tool configuration */
    tool?: string;
    /** Optional components configuration */
    components?: string;
}

/**
 * Message format for chat interactions
 */
export interface ChatMessage {
    /** Role of the message sender */
    role: 'system' | 'user' | 'assistant';
    /** Content of the message */
    content: string;
}

/**
 * Response format for chat interactions
 */
export interface ChatResponse {
    /** The message content from the agent */
    message: string;
    /** Optional metadata about the chat response */
    metadata?: Record<string, any>;
}

/**
 * Response format for one-off run operations
 */
export interface RunResponse {
    /** Whether the operation was successful */
    success: boolean;
    /** Response data - either a string or structured data */
    data: string | Record<string, any>;
    /** Optional error message if the operation failed */
    error?: string;
}

/**
 * Information about a deployed agent
 */
export interface DeployedAgent {
    /** Unique identifier of the agent */
    agent_id: string;
    /** Configuration of the agent */
    config: AgentConfig;
    /** ISO timestamp of when the agent was created */
    created_at: string;
    /** ISO timestamp of when the agent was last updated */
    updated_at: string;
}

/**
 * Configuration options for the TruffleAI client
 */
export interface TruffleAIOptions {
    /** Base URL for the API (defaults to https://www.trytruffle.ai) */
    baseUrl?: string;
}

/**
 * Base error class for TruffleAI SDK
 */
export class TruffleError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number,
        public readonly details?: Record<string, any>
    ) {
        super(message);
        this.name = 'TruffleError';
    }
}

/**
 * Validation error class for invalid inputs
 */
export class ValidationError extends TruffleError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, 400, details);
        this.name = 'ValidationError';
    }
}

/**
 * Authentication error class
 */
export class AuthenticationError extends TruffleError {
    constructor(message: string = 'Invalid API key') {
        super(message, 401);
        this.name = 'AuthenticationError';
    }
}

/**
 * Rate limit error class
 */
export class RateLimitError extends TruffleError {
    constructor(message: string = 'Rate limit exceeded') {
        super(message, 429);
        this.name = 'RateLimitError';
    }
}

/**
 * Network error class
 */
export class NetworkError extends TruffleError {
    constructor(message: string) {
        super(message, 0);
        this.name = 'NetworkError';
    }
} 