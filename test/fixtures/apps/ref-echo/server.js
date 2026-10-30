const http = require("node:http");

http.createServer((_request, response) => {
  const reference = process.env.FAMILY_REF;
  const resolved = Boolean(reference) && !reference.startsWith("${");
  response.writeHead(resolved ? 200 : 500, { "Content-Type": "text/plain" });
  response.end(resolved ? "ref=set" : "ref=unset");
}).listen(3000, "0.0.0.0");
