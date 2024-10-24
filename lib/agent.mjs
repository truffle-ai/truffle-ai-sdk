class Agent {
    constructor(agent_id, apiKey, baseUrl) {
        this.apiKey = apiKey;
        this.base_url = baseUrl
        this.agent_id = agent_id;
        this.json_format = "";
        this.json_mode = false;
        this.viewData = {};
        this.message_history = [];
    }

    async chat(input) {
        let messages = [...this.message_history, { role: "user", content: input }];

        const response = await fetch(`${this.base_url}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": `${this.apiKey}`,
            },
            body: JSON.stringify({
                agent_id: this.agent_id,
                input_data: messages,
                json_format: this.json_format,
                json_mode: false,
            }),
        });

        const data = await response.json();
        const assistantMessage = { role: "assistant", content: data.data };

        this.message_history = [
            ...this.message_history,
            { role: "user", content: input },
            assistantMessage,
        ];

        return this.message_history;
    }

    async run(data) {
        try {
            const response = await fetch(`${this.base_url}/run`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": this.apiKey,
                },
                body: JSON.stringify({
                    agent_id: this.agent_id,
                    input_data: data,
                    json_format: this.json_format,
                    json_mode: this.json_mode,
                }),
            });
    
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
    
            const response_data = await response.json();
    
            this.viewData = { ...this.viewData, ...response_data };
    
            return this.viewData;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }    
}

export default Agent;
