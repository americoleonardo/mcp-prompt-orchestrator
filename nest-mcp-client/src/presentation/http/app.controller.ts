import { Controller, HttpCode, Post, Body } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { AgentService } from 'src/domain/services/agent.service';


@Controller("v1/prompts")
export class AppController {
  constructor(
    private readonly agentService: AgentService,
    private readonly logger: PinoLogger
  ) {
    this.logger.setContext(AppController.name)
  }

  @Post()
  @HttpCode(200)
  postPrompt(
    @Body() body: any,
  ): Object {
    const { prompt } = body 
    
    this.logger.info(`[AppController] Prompt requested: %s`, prompt)

    const rs = this.agentService.invoke(prompt);
    
    return rs;
  }
}
