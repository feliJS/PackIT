// Main server
import { serveFile, serveDir } from "jsr:@std/http";

function serverHandler(request) {
    const url = new URL(request.url);
    if (url.pathname === "/") {
        return serveFile("common.html");
    }

    return serveDir(request, { fsRoot: "." });  
}

Deno.serve({ port: 1337 }, serverHandler);

