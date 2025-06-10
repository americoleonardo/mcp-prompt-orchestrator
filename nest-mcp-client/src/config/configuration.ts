import { ConfigType } from '@nestjs/config';

const config = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  mcpServer: process.env.MCP_SERVER || 'http://localhost:8000/mcp',
  mcpClientName: process.env.MCP_CLIENT_NAME || 'nest-mcp-client',
  mcpClientVersion: process.env.MCP_CLIENT_VERSION || '1.0.0',
  openAiKey: process.env.OPENAI_API_KEY || 'sk-proj-y1nIw_H....'
});

export default config;

export type ConfigurationType = ConfigType<typeof config>;
