import { usersHandler } from "./users/users-api.js";
import { listHandler } from "./lists/list-api.js";
import { imageHandler } from "./unsplash/imageApi.js";

async function handler(req) {
    let url = new URL(req.url);

    if (url.pathname.startsWith("/users")) {
        let usersResponse = usersHandler(req); //returnerar en promise! som kan vara null eller faktiska functionen
        if (usersResponse) return usersResponse; //om det är false... returna inte den. men om true ! gör det
        //detta användes innan eftersom /users fanns också på listHandler, vi hade /users/lists och behövde kolla båda på ett sätt-
        //så egentligen behövs inte detta längre.
    }

    if (url.pathname.startsWith("/lists")) {
        let listResponse = listHandler(req);    
        if (listResponse) return listResponse;
    }

    if (url.pathname.startsWith("/image")) {
        let imageResponse = imageHandler(req);
        if (imageResponse) return imageResponse;
    }

    if (url.pathname === "/weather") { //lägg annars i en egen fil, just nu är de samma som de andra förutom den ligger direkt i servern
        try { //om något går fel, (nätverksfel oftast..)
            // Läs API-nyckel
            const apiKeysFile = await Deno.readTextFile("../../apiKeys.json"); //readtextfile är asynkront, medans readTextFileSync är synkront
            const keys = JSON.parse(apiKeysFile); //javascript värde- som en äkta [] om filinnehållet ej är JSON... gå till catch.
            const API_KEY_WEATHER = keys[0]?.API_KEY_WEATHER; //plockar ut fältet API_KEY_WEATHER Från första objektet i arrayen keys.
            //?. (optional chaining), innebär om keys[0] är undefined eller null så blir det undefined istället för att kasta en error.

            // Läs och kontrollera body
            const body = await req.json(); //läser HTTP-req body som JSON och parsar direkt
            if (!body.city) { //check för o kontrollera om city skickades med, im inte returnera en 400 bad req m/ fel meddelande.
                return new Response(JSON.stringify({ error: "Stad måste anges i body, t.ex. { city: 'Stockholm' }" }), {
                    status: 400,
                    headers: { "Access-Control-Allow-Origin": "*", "content-type": "application/json" }
                });
            }

            // Hämta väderdata
            const BASE_URL = "https://api.weatherstack.com/current"; //bas URL för apiet
            const response = await fetch(`${BASE_URL}?access_key=${API_KEY_WEATHER}&query=${encodeURIComponent(body.city)}`); //fetcha från  apiet, det man behöver
            //access_key är rätt key, base_url är de ovan, encodeURIComponent är en url-enkodad stad(?) den enkodar en string till en valid URI
            const data = await response.json();

            if (data.error) { //om weatherstack-svaret innehåller ett error-fält, kan de vara att det är något fel på apiet..
                return new Response(JSON.stringify({ error: "Fel från väder-API" + data.error }), {
                    status: 502,
                    headers: { "Access-Control-Allow-Origin": "*", "content-type": "application/json" }
                });
            }

            // Returnera väderdata
            return new Response(JSON.stringify(data), {
                headers: { "Access-Control-Allow-Origin": "*", "content-type": "application/json" } //CORS hanteras här, det är så vi kan tillåta anrop från vilken origin som helst
                //OBS! egnetligen hade man kanske kunnat ha CORS och allt man behöver längst upp i denna filen o slipper calla det på varje function-
                //dock är det för vi hade 3 olika serverar innan o bara delade upp det nu i slutet! så de gör inte så myckety.
            });

        } catch (err) {
            console.error("Fel:", err);
            return new Response(JSON.stringify({ error: "Något gick fel" }), {
                status: 500,
                headers: { "Access-Control-Allow-Origin": "*", "content-type": "application/json" }
            });
        }
    }


    return null //om ingen av de ovanstående rutterna matchade, returnera null.
    //i denos serve-miljlö bnetyder det att denna handler inte ger ett svar- i praktiken bör man returnera en 404 not found här men i den gär koden görs det via sub-handlerna på ett sätt.
}

Deno.serve(handler); //startar en http-server i deeno och anger handler-funktionen som en entry point för varje förfrrågan
//vi kör på port 8000 automatiskt, det är där vi hämtar infon. Får server o där vi kör index.html kommer ju vara 4242
