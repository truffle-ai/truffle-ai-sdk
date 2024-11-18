# Truffle AI SDK

## Introduction

The Truffle AI SDK offers a simple way to create and manage serverless AI agents, allowing developers to build applications without worrying about infrastructure complexities. Whether it's automating workflows, enhancing customer experiences, or exploring AI capabilities, Truffle AI helps you get started quickly and scale effortlessly.

## Overview

With the Truffle AI SDK, developers can easily create and interact with serverless AI agents tailored to their use cases. The SDK allows you to create agents, conduct chat interactions, and execute agent functions—all with minimal setup.

## Installation

Install the Truffle AI SDK using npm:

```sh
npm install truffle-ai
```

## Usage

To use the SDK, import the client, create an instance, and initialize an agent. Obtain your API key by logging into [Truffle AI](https://www.trytruffle.ai), navigating to **Settings** > **API Keys**, and clicking **Generate New Key**

```js
import { TruffleAIClient } from "truffle-ai";

const client = new TruffleAIClient("your-api-key"); //Use your API-key
const agent = client.initAgent("your-agent-id"); //Each agent comes with a unique ID

// Chat with the agent
(async () => {
  const response = await agent.chat("Hello, how are you?");
  console.log(response);
})();

// Run a specific function
(async () => {
  const output = await agent.run("Write a haiku about summer.");
  console.log(output);
})();
```

## Example Applications

### Using Templates

Truffle AI provides pre-built templates for common use cases. This allows you to quickly initialize and interact with an agent using it's `agent_id`.

```js
import { TruffleAIClient } from "truffle-ai";

(async () => {
  const client = new TruffleAIClient("your-api-key");
  const agent = client.initAgent("template-agent-id");

  // Here we are using an agent that can extract URLs
  response = agent.chat("Can you summarize the key points from this article? https://techcrunch.com/2024/01/23/navigate-the-genai-era-with-this-startup-map/");
  console.log(response);
})();
```

### Building Custom Agents

You can create custom agents to meet your specific needs using [Truffle AI](https://www.trytruffle.ai). Once you add your custom agent, you can use it's `agent_id` to interact with it.

Refer to this [tutorial](https://www.trytruffle.ai/blog).


## License

This project is licensed under the [MIT](https://spdx.org/licenses/MIT.html) License.

## Contributions

Contributions are welcome! If you have ideas or improvements, feel free to open a pull request or issue on the GitHub repository.

## Support

For support or questions, contact [founders@trytruffle.ai](mailto:founders@trytruffle.ai).
