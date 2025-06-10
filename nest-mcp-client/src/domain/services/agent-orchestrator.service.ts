import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from 'src/config/configuration';
import { McpClient } from 'src/infrastructure/mcp/mcp.client';
import OpenAI from 'openai';
import { ChatCompletionTool } from 'openai/resources/chat';
import { PinoLogger } from 'nestjs-pino';
import { OrchestratorResponse } from 'src/types/OrchestratorResponse';

@Injectable()
export class AgentOrchestrator {
  constructor(
    private readonly mcpClient: McpClient,
    private readonly config: ConfigService<ConfigurationType>,
    private readonly logger: PinoLogger
  ) {
    this.openai = new OpenAI({
      apiKey: this.config.get<string>('openAiKey'),
    });
    this.logger.setContext(AgentOrchestrator.name);

    this.logger.info(`[AgentOrchestrator] Injecting openai key`);
  }

  private openai: OpenAI;

  public async invokePrompt(prompt: string): Promise<OrchestratorResponse> {
    this.logger.info(`[AgentOrchestrator] invokePrompt has been called`);
  
    const tools = await this.mcpClient.getTools();
  
    const toolDefinitions: ChatCompletionTool[] = tools.map(tool => ({
      type: "function",
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.inputSchema,
      },
    }));
  
    const { toolName, args, toolCall, initial } = await this.getBestTool(prompt);
  
    if (toolName == null) {
      this.logger.info(`[AgentOrchestrator] No tool selected – checking if response is safe to return directly.`);
  
      const final = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          this.getInitialPrompt(),
          { role: 'user', content: prompt },
          ...(initial.choices[0].message.content
            ? [{ role: 'assistant', content: initial.choices[0].message.content }]
            : [])
        ],
      });

      const response: OrchestratorResponse = {
        message: final.choices[0].message.content || "Sorry, this request is outside my knowledge scope."
      }

      return response;
    }
  
    this.logger.info(`[AgentOrchestrator] Sending to mcp information %o`, { toolName, args });
  
    const result = await this.mcpClient.callTool(toolName, args);
  
    const final = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        this.getInitialPrompt(),
        { role: 'user', content: prompt },
        { role: 'assistant', tool_calls: [toolCall] },
        { role: 'tool', tool_call_id: toolCall.id, content: JSON.stringify(result) },
      ],
    });
  
    const response: OrchestratorResponse = {
      message: final.choices[0].message.content || "Sorry, this request is outside my knowledge scope."
    }

    return response;
  }
  

  private async getBestTool(prompt: string): Promise<any> {
    const tools = await this.mcpClient.getTools();
  
    const toolDefinitions: ChatCompletionTool[] = tools.map(tool => ({
      type: "function",
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.inputSchema,
      },
    }));
  
    const initial = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: prompt }
      ],
      tools: toolDefinitions,
      tool_choice: 'auto',
    });
  
    const toolCall = initial.choices[0].message.tool_calls?.[0];
  
    if (!toolCall) {
      return {
        toolName: null,
        args: null,
        toolCall: null,
        initial
      };
    }
  
    const args = JSON.parse(toolCall.function.arguments);
  
    return {
      toolName: toolCall.function.name,
      args,
      toolCall,
      initial
    };
  }  

  private getInitialPrompt(): any {
    const systemMessage = {
      role: "system",
      content: `You are a prompt orchestrator responsible for interpreting user requests and responding based
      strictly on registered tools, with a strong focus on security, control, and auditability.
      You must not answer based on your own knowledge unless explicitly allowed. Your role is to assess the user
      intent and, when appropriate, route the request to an available and registered tool in the system.

      ### Execution Rules (mandatory):

      1. Always prioritize using registered tools to respond. Use them whenever the users intent can be 
      confidently interpreted.
      2. Do not attempt to answer based on your internal knowledge for technical, sensitive, or broad topics
      (e.g., OWASP, security, software architecture).
      3. For every request, if no appropriate tool is available, you must return **exactly**:
        Text: Sorry, this request is outside my knowledge scope
    `.trim()
    };

    return systemMessage;
  }
}
