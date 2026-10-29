import { createServer } from "node:http";

createServer((_request, response) => {
  const url = process.env.DATABASE_URL ?? "";
  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(
    JSON.stringify({
      greeting: process.env.GREETING ?? "Hello from Alchemy and Zerops!",
      databaseUrlResolved: /^postgres(?:ql)?:\/\//.test(url) && !url.includes("${"),
    }),
  );
}).listen(3000, "0.0.0.0");
