import { z } from 'zod';
import { getCoordinates, getForecast } from '../../infrastructure/http/weather-client';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';


export function weatherTool(server: McpServer) {
  server.tool(
    "weather-tool",
    `This is the Current Weather Tool. It retrieves real-time weather information for a given city by combining Open-Meteo's geocoding and weather APIs.
     You must provide a single parameter:
     - "city": the name of the city you want to check the weather for (e.g., "São Paulo", "Porto Alegre").

     The tool will return the current temperature (in Celsius), wind speed (in km/h), weather condition code, and timestamp of the observation.

     Example inputs:
     - { "city": "New York" }
     - { "city": "Tokyo" }
     - { "city": "Paris" }
     - { "city": "São Paulo" }

     This tool supports any globally recognized city, as long as the name is provided in standard Latin characters.

     This tool is useful for prompts like:
     - "What’s the weather like in Rio de Janeiro?"
     - "Is it cold in Curitiba right now?"
     - "Give me the current temperature and wind in Brasília."
     Note: The result is based on the most recent available weather data.`,
    {
      city: z.string()
    },
    async ({ city }) => {
      console.log(`Received request: name=${city}`);

      const coordinates = await getCoordinates(city);
      
      if (coordinates.latitude == null && coordinates.longitude == null) {
        return {
          content: [{ type: "text", text: `Sorry, the city ${city} was not identified.`}]
        };
      }

      const forecast = await getForecast(String(coordinates.latitude), String(coordinates.longitude));
      
      const output = {
        ...coordinates,
        ...forecast
      }
      
      return {
        content: [{ type: "text", text: JSON.stringify(output)}]
      };
    }
  );

}