import { Injectable } from '@nestjs/common';
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from 'src/config/configuration';

@Injectable()
export class McpClient {
  private readonly mcpServer: string;
  private readonly mcpClientName: string;
  private readonly mcpClientVersion: string;

  private clientPromise: Promise<Client>;

  constructor(private readonly configService: ConfigService<ConfigurationType>) {
    this.mcpServer = this.configService.get<string>('mcpServer');
    this.mcpClientName = this.configService.get<string>('mcpClientName');
    this.mcpClientVersion = this.configService.get<string>('mcpClientVersion');

    this.clientPromise = this.initClient();
  }

  private async initClient(): Promise<Client> {
    const client = new Client({
      name: this.mcpClientName,
      version: this.mcpClientVersion
    });

    const transport = new StreamableHTTPClientTransport(new URL(this.mcpServer));
    await client.connect(transport);

    return client;
  }

  public async getTools(): Promise<any> {
    const client = await this.clientPromise;
    const { tools } = await client.listTools();
    return tools;
  }

  public async callTool(name: string, args: Record<string, unknown>): Promise<any> {
    const client = await this.clientPromise;

    const rs = await client.callTool({
      name,
      arguments: args,
    });

    return rs;
  }
}

