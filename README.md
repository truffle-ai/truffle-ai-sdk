# Truffle AI SDK

## Introduction

Truffle AI SDK is built for developers to easily interact with serverless AI agents, providing a straightforward way to build intelligent applications. It empowers developers to create, deploy, and manage AI-powered agents without worrying about infrastructure setup. Whether you need to automate tasks, enhance customer experiences, or explore new AI capabilities, Truffle AI provides the tools to get started quickly and scale solutions as needed.

## Overview

Truffle AI SDK allows developers to easily create and interact with serverless AI agents tailored to their use cases. You can utilize this SDK to create agents, perform chat interactions, and execute agent functions.

## Installation

Install the Truffle AI SDK using npm:

```sh
npm install truffle-ai
```

## Usage

To use the SDK, import the client, create an instance, and initialize an agent.

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

&#x20;You can obtain your API Key by logging in at Truffle AI, navigating to Settings > API Keys, and clicking Generate New Key.

## Example Applications

### Using Templates

Truffle AI makes it easy to get started by providing ready-made templates for common use cases. Each template has a unique `agentId`, allowing you to initialize an agent quickly and start interacting.

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

You can also build custom agents tailored to your specific needs. After creating an agent through the Truffle AI platform, use its `agentId` to interact with it programmatically.

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

### Integrate into Your Application

Integrating Truffle AI into your application is as simple as initializing an agent and calling its methods. With both templates and custom agents, you have the flexibility to automate workflows, provide conversational AI, or build custom interactions.

Here's an example of how to integrate Truffle AI into your Node.js project:

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

Contributions are welcome! If you have any ideas or improvements, feel free to create a pull request or open an issue on the GitHub repository.

## Support

For support or queries, please contact [support@trytruffle.ai](mailto\:support@trytruffle.ai).
