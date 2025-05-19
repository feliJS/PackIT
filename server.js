
// Main server

import { serveFile, serveDir } from "jsr:@std/http";

async function serverHandler(request) {

    const reqUrl = new URL(request.url);
    const reqPathname = reqUrl.pathname;
    console.log("Begärrd path: " + reqPathname);


    if (reqPathname === "/assets/common.css") {
        return await serveFile(request, "frontend/assets/common.css");
    }


    if (reqPathname.startsWith("/assets/icons")) {
        return await serveDir(request, {
            fsRoot: "frontend/assets/icons",
            urlRoot: "/assets/icons",
        });
    }

    if (reqPathname.startsWith("/assets/common")) {
        return await serveDir(request, {
            fsRoot: "frontend/assets/common",
            urlRoot: "/assets/common",
        });
    }    

    if (reqPathname.startsWith("/assets/images")) {
        return await serveDir(request, {
            fsRoot: "frontend/assets/images",
            urlRoot: "/assets/images",
        });
    }


    if (reqPathname.startsWith("/assets/fonts")) {
        return await serveDir(request, {
            fsRoot: "frontend/assets/fonts",
            urlRoot: "/assets/fonts",
        });
    }


    if (reqPathname === "/" || reqPathname === "/home") {
        return await serveFile(request, "frontend/pages/home/index.html");
    }


    if (reqPathname.startsWith("/create-list")) {
        const step = reqPathname.split("/")[2] || "step1";
        return await serveFile(request, `frontend/pages/create-list/${step}.html`);
    }


    if (reqPathname.startsWith("/profile")) {
        return await serveFile(request, "frontend/pages/profile/index.html");
    }


    // Fallback
    return new Response("Sidan hittades inte", {
        status: 404,
        headers: {
            "Content-Type": "text/plain",
        },
    });
    
}

Deno.serve(serverHandler);
