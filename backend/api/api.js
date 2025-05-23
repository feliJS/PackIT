import { usersHandler } from "./users/users-api.js";
//import { listHandler } from "./lists/listService.js";
import { imageHandler } from "./unsplash/imageApi.js";

function handler(req) {
    let url = new URL(req.url);
    if(url.pathname.startsWith("/users")) {
        return usersHandler(req);
        // listHandler(req);
    }
    if(url.pathname.startsWith("/unsplash")) {
        return imageHandler(req);
    }
}

Deno.serve(handler);