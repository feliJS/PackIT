import { serveFile, serveDir } from "jsr:@std/http/file-server";

const PORT = 4242;

async function handler(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  console.log(`copyServer: [${request.method}] ${path}`);

  // Serve index.html on root
  if (path === "/" || path === "/home") {
    const response = await serveFile(request, "../copyIndex.html");
    response.headers.set("content-type", "text/html");
    return response;
  }

  console.log("i server/handler")

  // Serve everything else from /frontend
  const fileResponse = await serveDir(request, {
    fsRoot: "../frontend",
  });
  
  console.log("rad 25 i server")
  if (fileResponse.status === 200 && path.endsWith(".js")) {
    fileResponse.headers.set("content-type", "application/javascript");
  }
  console.log("rad 29 i server")


  // Set correct MIME for .js files
  if (path.endsWith(".js")) {
    fileResponse.headers.set("content-type", "application/javascript");
  }
  console.log("i end server/handler")

  return fileResponse;
}

Deno.serve({ port: PORT }, handler);
