import { usersHandler } from "./users/users-api.js";
import { listHandler } from "./lists/list-api.js";
import { imageHandler } from "./unsplash/imageApi.js";

async function handler(req) {
    let url = new URL(req.url);

    if (url.pathname.startsWith("/users")) {
        let usersResponse = usersHandler(req);
        if (usersResponse) return usersResponse;
    }

    if (url.pathname.startsWith("/lists")) {
        let listResponse = listHandler(req);
        if (listResponse) return listResponse;
    }

    if (url.pathname.startsWith("/image")) {
        let imageResponse = imageHandler(req);
        if (imageResponse) return imageResponse;
    }

    if (url.pathname === "/weather") {
        try {

            const apiKeysFile = await Deno.readTextFile("../../apiKeys.json");
            const keys = JSON.parse(apiKeysFile);
            const API_KEY_WEATHER = keys[0]?.API_KEY_WEATHER;


            const body = await req.json();
            if (!body.city) {
                return new Response(JSON.stringify({ error: "Stad måste anges i body, t.ex. { city: 'Stockholm' }" }), {
                    status: 400,
                    headers: { "Access-Control-Allow-Origin": "*", "content-type": "application/json" }
                });
            }


            const BASE_URL = "https://api.weatherstack.com/current";
            const response = await fetch(`${BASE_URL}?access_key=${API_KEY_WEATHER}&query=${encodeURIComponent(body.city)}`);
            const data = await response.json();

            if (data.error) {
                return new Response(JSON.stringify({ error: "Fel från väder-API: " + data.error.type }), {
                    status: 502,
                    headers: { "Access-Control-Allow-Origin": "*", "content-type": "application/json" }
                });
            }


            return new Response(JSON.stringify(data), {
                headers: { "Access-Control-Allow-Origin": "*", "content-type": "application/json" }
            });

        } catch (err) {
            console.error("Fel:", err);
            return new Response(JSON.stringify({ error: "Något gick fel" }), {
                status: 500,
                headers: { "Access-Control-Allow-Origin": "*", "content-type": "application/json" }
            });
        }
    }


    return null
}

Deno.serve(handler);