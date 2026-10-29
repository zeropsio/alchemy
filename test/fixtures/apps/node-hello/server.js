const http = require("node:http");
http.createServer((_request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end((process.env.GREETING || "hello") + "\n");
}).listen(3000, "0.0.0.0");
