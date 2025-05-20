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

  /* Allt annat betraktas som statiska resurser (CSS, JS, bilder, ikoner …)
         serveDir mappar URL-sökvägen direkt till motsvarande fil under
         'frontend/'. Exempel:
           - /common/common.css      → frontend/common/common.css
           - /assets/images/foo.png  → frontend/assets/images/foo.png
           - /pages/home/style.css   → frontend/pages/home/style.css
  */
  return serveDir(request, { fsRoot: "frontend", urlRoot: "" });

}

Deno.serve({ port: PORT }, handler);
console.log(`✅ Servern körs på http://localhost:${PORT}`);
