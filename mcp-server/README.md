# MCP-STREAMABLE-HTTP sample

This demonstrates a working pattern for MCP-Streamable-HTTP MCP servers with MCP clients that use tools from them.


### Node setup via nvm

```sh
nvm use 22
```

### Project base setup

Install the required dependencies using npm:

```sh
npm install
cp .env.example .env
```

### Build the Project

Compile the TypeScript code into JavaScript:

```bash
npm run build
```

This will generate the compiled files in the `dist` directory.

### 5. Run the Server

Start the server in production mode:

```bash
npm start
```

Alternatively, for development mode with live reloading, use:

```bash
npm run dev
```

---

## Testing the Server

### 1. Using the MCP Inspector

The MCP Inspector is a tool to test and inspect your MCP server. You can use it to verify that your tools and prompts are registered correctly.

Run the following command to inspect your server:

```bash
npx @modelcontextprotocol/inspector ./dist/server.js
```

### 2. Using Postman MCP

Uou can try using postman MCP client connector: [Postman Client Connector](https://www.youtube.com/watch?v=5MdSgQ87FfM)

This will open an interactive interface where you can test the tools and prompts registered in your server like below.
