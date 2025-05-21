
// enkel test-server
import { serveDir } from "jsr:@std/http";

Deno.serve({ port: 3000 }, (req) => {
    return serveDir(req, {
        fsRoot: "public",
        urlRoot: "",
        showDirListing: true,
    });
});