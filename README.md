# Truffle AI SDK

Build AI-powered applications with ease using Truffle AI. Deploy and manage AI agents with just a few lines of code.

## Installation

```bash
npm install truffle-ai
```

## Quick Start

```typescript
import { TruffleAI } from 'truffle-ai';

// Initialize the client
const truffle = new TruffleAI('your-api-key');

// Define your agent configuration
const agentConfig = {
  name: 'My Assistant',
  instruction: 'You are a helpful AI assistant.',
  model: 'gpt-4o-mini'
};

// Deploy the agent
const agent = await truffle.deployAgent(agentConfig);

// Run a task with your deployed agent
const result = await agent.run('Write a haiku about summer.');
console.log(result);

// Or start a chat session
const chat = agent.chat();
const response = await chat.send('Hello!');
console.log(response);
```

## Working with Existing Agents

```typescript
// Load a previously deployed agent by ID
const agent = await truffle.loadAgent('agent-id');

// Use the loaded agent
const result = await agent.run('Hello!');
```

## Advanced Configuration

```typescript
// Define a more specialized agent
const customerSupportAgent = {
  name: 'Customer Support Assistant',
  instruction: "You are a customer support specialist who helps users with their questions. Always maintain a professional and helpful tone. If you don't know something, admit it and suggest escalation.",
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 500,
  // Add any additional configuration options
};

// Deploy with specific options
const agent = await truffle.deployAgent(customerSupportAgent, {
  version: '1.0',
  environment: 'production'
});
```

## Features

- 🚀 Simple, intuitive API
- 🤖 Flexible agent configuration
- 💬 Support for both one-off tasks and chat sessions
- 🔄 Easy management of existing agents
- 🛡️ Full TypeScript support
- 🎮 Fine-grained control over agent deployment

## Documentation

For detailed documentation and examples, visit [docs.trytruffle.ai](https://docs.trytruffle.ai)

## Support

- Discord: [Join our community](https://discord.gg/truffle)
- Email: support@trytruffle.ai
- GitHub Issues: [Report bugs](https://github.com/truffle-ai/sdk/issues)

## License

MIT License - see LICENSE file for details