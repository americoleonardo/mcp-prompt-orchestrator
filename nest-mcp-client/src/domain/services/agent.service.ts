import { Injectable } from '@nestjs/common';
import { AgentOrchestrator } from './agent-orchestrator.service';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class AgentService {
  constructor(
    private readonly agent: AgentOrchestrator,
    private readonly logger: PinoLogger
  ) {
    this.logger.setContext(AgentService.name);
  }

  public async invoke(prompt: string): Promise<any> {
    this.logger.info(`[AgentService] invoke method has been called`);

    const result = await this.agent.invokePrompt(prompt);

    return result;
  }
}
