# Truffle AI SDK

## Introduction

The Truffle AI SDK offers a simple way to create and manage serverless AI agents, allowing developers to build applications without worrying about infrastructure complexities. Whether it's automating workflows, enhancing customer experiences, or exploring AI capabilities, Truffle AI helps you get started quickly and scale effortlessly.

## Installation

Install the Truffle AI SDK using npm:

```sh
npm install truffle-ai
```

## Usage

To use the SDK, you'll need an API key from [Truffle AI](https://www.trytruffle.ai). Navigate to **Settings** > **API Keys** and click **Generate New Key**.

### Basic Usage

```typescript
import { TruffleAI, Agent } from 'truffle-ai';

// Initialize the client
const client = new TruffleAI({
  apiKey: 'your-api-key'
});

// Create and deploy an agent
const agent = new Agent({
  name: 'My Assistant',
  instruction: 'You are a helpful AI assistant.',
  model: 'gpt-4'
});

// Deploy the agent
const deployedAgent = await client.deploy(agent);

// Run a one-off task
const result = await agent.run('Write a haiku about summer.');
console.log(result);

// Or start a chat session
const chat = agent.createChat();
const response = await chat.send('Hello, how are you?');
console.log(response);

// Get chat history
const history = chat.getHistory();
```

### Agent Configuration

When creating an agent, you can specify various configuration options:

```typescript
const agent = new Agent({
  name: 'Custom Assistant',
  instruction: 'You are a specialized AI assistant.',
  model: 'gpt-4',
  tool: 'custom-tool-name', // Optional: specify a custom tool
  config: {
    temperature: 0.7,
    // Other model-specific configurations
  }
});
```

### Chat Sessions

Chat sessions maintain conversation history and context:

```typescript
const chat = agent.createChat();

// Send multiple messages
const response1 = await chat.send('What is machine learning?');
const response2 = await chat.send('Can you give me an example?');

// Get the full conversation history
const history = chat.getHistory();
```

## TypeScript Support

The SDK is written in TypeScript and provides full type definitions out of the box. You'll get excellent IDE support and type checking for all SDK operations.

## Error Handling

The SDK uses standard error handling patterns:

```typescript
try {
  const agent = new Agent({
    name: 'Test Agent',
    instruction: 'Test instruction',
    model: 'gpt-4'
  });
  await client.deploy(agent);
} catch (error) {
  console.error('Failed to deploy agent:', error);
}
```

## License

This project is licensed under the [MIT](https://spdx.org/licenses/MIT.html) License.

## Support

For support or questions, contact [founders@trytruffle.ai](mailto:founders@trytruffle.ai).
