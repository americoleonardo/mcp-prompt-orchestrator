import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getUsers } from "../../infrastructure/http/sw-client";

export function swApiSearchTool(server: McpServer) {
  server.tool(
    "sw-api-search-tool",
    `This is the Star Wars character search tool. It allows you to search for characters from classic films using the Star Wars API. 
     You can pass the "name" parameter and it will return a list of related characters. Example: Darth Vader
    [{
      uid: "4"
      name: "Darth Vader"
      url: "https://www.swapi.tech/api/people/4"
    }]

    This list can also bring up characters where part of the name is part of the string.`,
    {
      name: z.string()
    },
    async ({ name }) => {
      console.log(`Received request: name=${name}`);

      if (!name) {
        return {
          content: [{ type: "text", text: "Please provide a name to search for." }],
        };
      }

      const characters = new Map();
      let lastPage = 1;
      let limit = 100;

      for (let page = 1; page <= lastPage; page++) {
        const { data } = await getUsers(page, limit);

        let itens = [...data.results].filter(item => item.name.toLowerCase().includes(name.toLowerCase()));
                
        if(itens != undefined) {
          itens.forEach((item) => {
            characters.set(item.name, item);
          });
        }

        lastPage = data.total_pages;
      }
      
      
      const output: any = [];
      console.log(`Found ${characters.size} characters matching the name "${name}"`);
      
      if (!characters.size) {
        console.log(`No characters found matching the name "${name}"`);
        return {
          content: [{ type: "text", text: `No characters found matching the name "${name}"` }],
        };
      }

      characters.forEach((item) => {
        output.push(item);
      });
      return {
        content: [{ type: "text", text: JSON.stringify([...output])}]
      };
    }
  );

}