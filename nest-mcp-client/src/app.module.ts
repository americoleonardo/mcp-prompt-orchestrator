import { Module } from '@nestjs/common';
import { AppController } from './presentation/http/app.controller';
import { AgentService } from './domain/services/agent.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { McpClient } from './infrastructure/mcp/mcp.client';
import { AgentOrchestrator } from './domain/services/agent-orchestrator.service';
import { LoggerModule } from 'nestjs-pino';
import { createWriteStream } from 'fs';

const logStream = createWriteStream('app.log', { flags: 'a' });

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    LoggerModule.forRoot({
      pinoHttp: [
        {
          name: 'nest-js-client-mcp',
          level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
          transport: process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined
        },
        logStream
      ],
      forRoutes: [],
      exclude: []
    })
  ],
  controllers: [AppController],
  providers: [AgentService, McpClient, AgentOrchestrator],
})
export class AppModule {}
