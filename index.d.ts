declare module 'truffle-ai' {
    export class TruffleAIClient {
        constructor(apiKey: string, baseURL?: string);

        initAgent(agent_id: string): Agent;
    }

    export class Agent {
        constructor(agent_id: string, apiKey: string, baseUrl: string);

        chat(input: string): Promise<Array<{ role: string; content: string }>>;

        run(data: any): Promise<any>;

        apiKey: string;
        base_url: string;
        agent_id: string;
        json_format: string;
        json_mode: boolean;
        viewData: Record<string, any>;
        message_history: Array<{ role: string; content: string }>;
    }
}

export = truffle_ai;
export as namespace truffle_ai;
