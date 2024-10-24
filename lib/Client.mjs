import Agent from './agent.mjs';

class TruffleAIClient {
  constructor(apiKey, baseURL = "https://www.trytruffle.ai/api/v0") {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }

  initAgent(agent_id) {
    return new Agent(agent_id, this.apiKey, this.baseURL);
  }
}

export default TruffleAIClient;
