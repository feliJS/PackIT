import { usersHandler } from "./users/users-api.js";
import { listHandler } from "./lists/list-api.js";
import { imageHandler } from "./unsplash/imageApi.js";

function handler(req) {
    let url = new URL(req.url);

    if(url.pathname.startsWith("/users")) {
        let usersResponse = usersHandler(req);
        if(usersResponse) return usersResponse;
    }

    if(url.pathname.startsWith("/lists")){
        let listResponse = listHandler(req);
        if(listResponse) return listResponse;
    }

    if(url.pathname.startsWith("/image")) {
        let imageResponse = imageHandler(req);
        if(imageResponse) return imageResponse;
    }
    return null
}

Deno.serve(handler);