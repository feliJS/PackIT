


import { serveFile, serveDir } from "jsr:@std/http/file-server";

const PORT = 4242;

async function handler(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === "/" || path === "/home") { //kollar om du är på / elelr /Home
    const response = await serveFile(request, "../index.html"); //isåfall läs in index.html
    response.headers.set("content-type", "text/html"); //och att det är html
    return response;
  }

  const fileResponse = await serveDir(request, { //om det inte är det! då får vi ju serva våra andra filer..
    fsRoot: "../frontend",//läser in allt under frontend!
    //Exempel: Om klienten begär "/css/common.css", letar serveDir efter ../frontend/css/common.css på hårddisken.
  });
  
  return fileResponse;
}

Deno.serve({ port: PORT }, handler);
