import { api } from './fetcher';

export interface AgentExecuteRequest {
    prompt: string;
}

export interface AgentExecuteResponse {
    agentsUsed: string[];
    fullResponse: string;
    strategy: string;
    content: string;
    imagePrompt: string;
    imageUrl: string;
    report: string;
    reportUrl: string;
}

export const agentApi = {
    executeAgent: (data: AgentExecuteRequest): Promise<AgentExecuteResponse> => 
        api.post<AgentExecuteResponse>('/v1/agent/pipeline', data),
    previewAgents: (prompt: string): Promise<string[]> => 
        api.get<string[]>(`/v1/agent/preview?prompt=${encodeURIComponent(prompt)}`),
};
