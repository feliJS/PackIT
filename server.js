// server.ts
import { serveFile, serveDir } from "jsr:@std/http";

const PORT = 4242;

async function handler(request) {
  const url  = new URL(request.url);
  const path = url.pathname;

  // HTML-end-points 
  if (path === "/" || path === "/home") {
    return serveFile(request, "frontend/pages/home/index.html");
  }
  if (path === "/create-list") {
    return serveFile(request, "frontend/pages/create-list/index.html");
  }
  if (path === "/profile") {
    return serveFile(request, "frontend/pages/profile/index.html");
  }
  return serveDir(request, { fsRoot: "frontend", urlRoot: "" });

}

Deno.serve({ port: PORT }, handler);

