# Truffle AI SDK

## Introduction

Truffle AI SDK lets you work with serverless AI agents to build applications without dealing with infrastructure. You can create, deploy, and manage your agents easily. Whether you're automating tasks, improving customer experiences, or exploring new AI features, Truffle AI helps you get started quickly and scale as needed.

## Overview

With Truffle AI SDK, developers can easily create and interact with serverless AI agents tailored to their use cases. This SDK lets you create agents, perform chat interactions, and execute agent functions—all with minimal setup.

## Installation

To install the Truffle AI SDK, use npm:

```sh
npm install truffle-ai
```

## Usage

To use the SDK, import the client, create an instance, and initialize an agent. You will need an API key, which can be obtained by logging in at [Truffle AI](https://www.trytruffle.ai), navigating to **Settings** > **API Keys**, and clicking **Generate New Key**.

```js
import { TruffleAIClient } from "truffle-ai";

const client = new TruffleAIClient("your-api-key");
const agent = client.initAgent("your-agent-id");

// Chat with the agent
(async () => {
  const messages = await agent.chat("Hello, how can you assist me today?");
  console.log(messages);

  // Run a specific function
  const output = await agent.run("value");
  console.log(output);
})();
```

## Example Applications

### Using Templates

Truffle AI provides ready-made templates for common use cases, each with a unique `agentId`. This allows you to quickly initialize an agent and start interacting.

```js
import { TruffleAIClient } from "truffle-ai";

(async () => {
  const client = new TruffleAIClient("your-api-key");
  const agent = client.initAgent("template-agent-id");

  // Chat with the pre-built agent
  const chatResponse = await agent.chat("Tell me about your features.");
  console.log(chatResponse);
})();
```

### Building Custom Agents

You can also build custom agents to suit your specific needs. After creating an agent through the Truffle AI platform, use its `agentId` to interact with it programmatically.

```js
import { TruffleAIClient } from "truffle-ai";

(async () => {
  const client = new TruffleAIClient("your-api-key");
  const customAgent = client.initAgent("custom-agent-id");

  // Custom chat interaction
  const messages = await customAgent.chat("Can you provide a custom report?");
  console.log(messages);

  // Execute a custom function
  const result = await customAgent.run("generateCustomReport");
  console.log(result);
})();
```

### Integrating into Your Application

Integrating Truffle AI into your application is straightforward. Just initialize an agent and call its methods. With both templates and custom agents, you have the flexibility to automate workflows, provide conversational AI, or create custom interactions.

Here's an example of how to integrate Truffle AI into a Node.js project:

```js
import { TruffleAIClient } from "truffle-ai";

(async () => {
  const client = new TruffleAIClient("your-api-key");
  const agent = client.initAgent("your-agent-id");

  // Chat with the agent
  const chatHistory = await agent.chat("What can you do?");
  console.log(chatHistory);

  // Run a specific function
  const result = await agent.run("value");
  console.log(result);
})();
```

## License

This project is licensed under the MIT License.

## Contributions

Contributions are welcome! If you have ideas or improvements, feel free to create a pull request or open an issue on the GitHub repository.

## Support

For support or queries, please contact [founders@trytruffle.ai](mailto:founders@trytruffle.ai).
