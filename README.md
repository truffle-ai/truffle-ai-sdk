# TruffleAI SDK

A TypeScript SDK for interacting with the TruffleAI API. Build and deploy AI agents with ease.

📚 [View Full Documentation](https://docs.trytruffle.ai/introduction)

## Installation

```bash
npm install truffle-ai
```

## Quick Start

```typescript
import { TruffleAI } from 'truffle-ai';

// Initialize the client
const client = new TruffleAI('your-api-key');

// Create and deploy a new agent
const agent = await client.deployAgent({
    name: 'My Assistant',
    instruction: 'Help users with their questions',
    model: 'gpt-4o-mini',
    tool: 'None'
});

// Run a task with the agent
const result = await agent.run('What is the capital of France?');
console.log(result.data); // Paris

// Load an existing agent
// AgentId can be found in the dashboard
const existingAgent = await client.loadAgent('agent-id');
```

## Core Features

- 🚀 Create and deploy AI agents with minimal setup
- 🤖 Run one-off tasks with deployed agents
- 🔒 Type-safe with comprehensive error handling

## Creating Agents

Agents are created with a configuration that defines their behavior:

```typescript
const agentConfig = {
    name: 'My Assistant',        // Name of your agent
    instruction: 'You are...',   // Instructions defining behavior
    model: 'gpt-4o-mini',       // AI model to use
    tool: 'None'                // Tool configuration
};

const agent = await client.deployAgent(agentConfig);
```

### Using Tools

Agents can be equipped with powerful tools to enhance their capabilities. Here's an example using the pre-built Tavily Research tool for web search. For a complete list of available tools and capabilities, check out our [documentation](https://docs.trytruffle.ai/introduction).

```typescript
// Create an agent with Tavily Research tool
const researchAgent = await client.deployAgent({
    name: 'Research Assistant',
    instruction: 'You are a research assistant that helps users find accurate information from the web.',
    model: 'gpt-4o-mini',
    tool: 'Tavily Research'      // Enable web search capabilities
});

// Run a research task
const result = await researchAgent.run('What are the latest developments in quantum computing?');
console.log(result.data);        // Contains AI-processed research findings from the web
```

## Running Tasks

Once deployed, you can run tasks with your agent:

```typescript
// Run a single task
const result = await agent.run('Analyze this text...');
console.log(result.data);

// Load and use an existing agent
const existingAgent = await client.loadAgent('agent-id');
const result = await existingAgent.run('Another task...');
```

## Error Handling

The SDK provides structured error handling:

```typescript
try {
    const agent = await client.deployAgent({
        name: 'My Assistant',
        instruction: 'Help users with questions',
        model: 'gpt-4o-mini'
    });
} catch (error) {
    if (error instanceof ValidationError) {
        // Handle validation errors (e.g., missing required fields)
        console.error('Invalid configuration:', error.message);
    } else if (error instanceof AuthenticationError) {
        // Handle authentication errors (e.g., invalid API key)
        console.error('Authentication failed:', error.message);
    } else if (error instanceof TruffleError) {
        // Handle other API errors
        console.error('API error:', error.message);
    }
}
```

## Support

For support, email founders@trytruffle.ai or open an issue on GitHub.