import { usersHandler } from "./users/users-api.js";
import { listHandler } from "./lists/listService.js";
import { imageHandler } from "./images/imageApi.js";

function handler(req) {
    let url = new URL(req.url);
    if(url.pathname.startsWith("/users")) {
        return usersHandler(req);
        // listHandler(req);
    }
    if(url.pathname.startsWith("/image")) {
        return imageHandler(req);
    }
}

Deno.serve(handler);