import express from "express";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { setupStreamableHTTPServerTransport } from "./presentation/mcp/transports";
import { mathTools } from "./domain/tools/math-tool";
import { registerPrompts } from "./modules/prompts";
import dotenv from "dotenv";
import { swApiSearchTool } from "./domain/tools/sw-api-search-tool";
import { currencyConverterTool } from "./domain/tools/currency-converter-tool";
import { weatherTool } from "./domain/tools/weather-tool";

dotenv.config();

const app = express();
app.use(express.json());

const server = new McpServer({
  name: "mcp-streamable-sample-http",
  version: "1.0.0"
});

mathTools(server);
swApiSearchTool(server);
currencyConverterTool(server);
weatherTool(server);

registerPrompts(server);

setupStreamableHTTPServerTransport(app, server);

const port = parseInt(process.env.PORT || "8000", 10);

app.listen(port, () => {
  console.info(`MCP server is running on port ${port}`);
});