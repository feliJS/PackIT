import { serveFile, serveDir } from "jsr:@std/http";

function serverHandler(request) {
    const url = new URL(request.url);
    if (url.pathname == "/" ) {
        return serveFile(request, "test.html")
    }
    /*if (url.pathname == "/weather" ) {
        return serveFile(request, "weather.html")
    }*/
    return serveDir(request)
}

Deno.serve({ port: 4242 }, serverHandler)



