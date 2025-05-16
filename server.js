// Main server
import { serveFile, serveDir } from "jsr:@std/http";

function serverHandler(request) {
    const url = new URL(request.url);
    if (url.pathname == "/common") {
        return serveFile(request, "frontend/common/common.html");
    } else if(url.pathname.startsWith("/common")) {
        return serveDir(request, { fsRoot: "frontend" });  
    }

    return serveDir(request, { fsRoot: "." });  
}

Deno.serve({ port: 4242 }, serverHandler);