


import { serveFile, serveDir } from "jsr:@std/http/file-server";

const PORT = 4242;

async function handler(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === "/" || path === "/home") {
    const response = await serveFile(request, "../index.html");
    response.headers.set("content-type", "text/html");
    return response;
  }

  const fileResponse = await serveDir(request, {
    fsRoot: "../frontend",
  });
  
  return fileResponse;
}

Deno.serve({ port: PORT }, handler);
