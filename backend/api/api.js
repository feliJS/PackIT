import { usersHandler } from "./users/users-api.js";
import { listHandler } from "./lists/list-api.js";
import { imageHandler } from "./unsplash/imageApi.js";

async function handler(req) {
    let url = new URL(req.url);

    if(url.pathname.startsWith("/users")) {
        let usersResponse = usersHandler(req); //returnerar en promise! som kan vara null eller faktiska functionen
        if(usersResponse) return usersResponse; //om det är false... returna inte den. men om true ! gör det
        //detta användes innan eftersom /users fanns också på listHandler, vi hade /users/lists och behövde kolla båda på ett sätt-
        //så egentligen behövs inte detta längre.
    }

    if(url.pathname.startsWith("/lists")){
        let listResponse = listHandler(req);
        if(listResponse) return listResponse;
    }

    if(url.pathname.startsWith("/image")) {
        let imageResponse = imageHandler(req);
        if(imageResponse) return imageResponse;
    }

    if (url.pathname === "/weather") { //lägg annars i en egen fil, just nu är de samma som de andra förutom den ligger direkt i servern
        try { //om något går fel, (nätverksfel oftast..)
            // Läs API-nyckel
            const apiKeysFile = await Deno.readTextFile("../../apiKeys.json"); //readtextfile är asynkront, medans readTextFileSync är synkront
            const keys = JSON.parse(apiKeysFile);
            const API_KEY_WEATHER = keys[0]?.API_KEY_WEATHER;

            // Läs och kontrollera body
            const body = await req.json();
            if (!body.city) {
                return new Response(JSON.stringify({ error: "Stad måste anges i body, t.ex. { city: 'Stockholm' }" }), {
                    status: 400,
                    headers: { "Access-Control-Allow-Origin": "*", "content-type": "application/json" }
                });
            }

            // Hämta väderdata
            const BASE_URL = "https://api.weatherstack.com/current";
            const response = await fetch(`${BASE_URL}?access_key=${API_KEY_WEATHER}&query=${encodeURIComponent(body.city)}`);
            const data = await response.json();

            if (data.error) {
                return new Response(JSON.stringify({ error: "Fel från väder-API" + data.error }), {
                    status: 502,
                    headers: { "Access-Control-Allow-Origin": "*", "content-type": "application/json" }
                });
            }

            // Returnera väderdata
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

    //vi har inget direkt som hanterar ifall det ej gick att returnera något.. men isf finns ju ej sökvägen.
    return null
}

Deno.serve(handler);