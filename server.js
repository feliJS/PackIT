
// Main server

import { serveFile, serveDir } from "jsr:@std/http";

async function serverHandler(request) {

    const reqUrl = new URL(request.url);
    const reqPathname = reqUrl.pathname;
    console.log("Begärrd path: " + reqPathname);


    if (reqPathname.startsWith("/icons/")) {
        const filePath = `frontend${reqPathname}`;
        try {
            return await serveFile(request, filePath);
        } catch {
            return new Response("Not Found", { status: 404 });
        }
    }


    if (reqPathname.startsWith("/images/")) {
        const filePath = `frontend${reqPathname}`;
        try {
            return await serveFile(request, filePath);
        } catch {
            return new Response("Not Found", { status: 404 });
        }
    }


    if (reqUrl.pathname == "/common") {
        return serveFile(request, "frontend/common/common.html");
    } else if(reqUrl.pathname.startsWith("/common")) {
        return serveDir(request, { fsRoot: "frontend" }); 
    }

    if (reqPathname.startsWith("/index")) {
        return await serveFile(request, "frontend/pagesIndex/index.html");
    }


    if (reqPathname.startsWith("/profile")) {
        return await serveFile(request, "frontend/pagesProfile/index.html");
    }


    if (reqPathname.startsWith("/create-list")) {
        return await serveFile(request, "frontend/pagesCreateList/index.html");
    }


    if (reqPathname === "/" || reqPathname === "/home") {
        return await serveFile(request, "frontend/pagesIndex/index.html");
    }


    // Fallback
    return new Response("The page could not be found", {
        status: 404,
        headers: {
            "Content-Type": "text/plain",
        },
    });

}

Deno.serve({port: 4242},serverHandler);
