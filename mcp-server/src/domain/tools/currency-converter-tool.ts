import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getCurrentInfo } from "../../infrastructure/http/currency-converter-client";

export function currencyConverterTool(server: McpServer) {
  server.tool(
    "currency-converter-api-tool",
    `This is the Currency Converter Tool. It allows you to calculate the conversion of an amount between two currencies using real-time
     exchange rates from exchangerate.host.
     You can pass the following parameters:
     * "from": the currency you are converting from (e.g., "USD")
     * "to": the currency you are converting to (e.g., "BRL")
     * "amount": the numeric value you want to convert
     Example:
     If you want to know how much 200 US dollars would be in Brazilian reais, you would call:
     {
       from: "USD",
       to: "BRL",
       amount: 200
     }
     The result will return the converted amount using the latest available exchange rate, without including any taxes or conversion fees.

     This tool is useful for questions like:
     * "How much is 200 euros in dollars?"
     * "I want to convert 150 GBP to yen."
     * "If I send 300 dollars to Brazil, how much is that in reais?"

     Note: The response reflects the **market exchange rate only**, not including bank fees.`,
    {
      from: z.string(),
      to: z.string(),
      amount: z.number()
    },
    async ({ from, to, amount }) => {
      console.log(`Received request: from=${from} to=${to} amount=${amount}`);
      
      if (!amount) {
        return {
          content: [{ type: "text", text: "Please provide amount." }],
        };
      } else if (!from || !to) {
        return {
          content: [{ type: "text", text: "Please provide a currency from and currency to." }],
        };
      }

      const { data } = await getCurrentInfo(from);

      const mappedKey = from+to;
      const quote = data.quotes[mappedKey] || null;

      if (!quote) {
        return {
          content: [{ type: "text", text: `Quote ${from} => ${to} not identified.` }]
        };
      }
      

      const output = {
        from,
        to,
        amount: amount,
        quote,
        total: (quote * amount).toFixed(2)
      }
      
      return {
        content: [{ type: "text", text: JSON.stringify(output)}]
      };
    }
  );

}