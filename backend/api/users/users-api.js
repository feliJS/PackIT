
// users-api.js

import { //Här laddas in alla funktioner som hanterar själva business‐logiken kring användare (CRUD och inloggning).
    //Dessa funktioner exporteras från usersFunctions.js.
  getAllUsersFunc,
  createUserFunc,
  getUserFunc,
  updateUserFunc,
  deleteUserFunc,
  loginFunc,
  logoutFunc,
} from "./usersFunctions.js";

export async function usersHandler(req) { //exporterar en async funktion - usersHandler till api.js
    const reqUrl = new URL(req.url); //skapar en url objekt för att kunna få fram pathname och andra parameterar
    const reqMethod = req.method; //plockar ut HTTP-metoden från requesten, om det är GET eller DELETE osv..
    let cookieHeader = req.headers.get("Cookie"); //"läs alla cookies som skickas av klienten i form av en sträng!"
    //OBS! jätteviktigt här; man skickar med en cookie i requesten med "credentials: include" från frontend!
    //det betyder att användaren har tidigare fått en cookie från servern (login t ex), så kommer den automatiskt skickas med som en cookie header i förfrågningar.
    //viktigt att ha cookien så vi kan sätta den i bla PUT eller DELETE för att göra säkerhetscheckar- om det är verkligen du som är inloggad!

    if (!cookieHeader) { //om cookieHeader är null dock, man ej skickar med en cookie- (ingen credentials include i klienten)
        //måste vi returnera en tom sträng så att den inte bara är null.. eftersom att vi kollar ju den i nästa steg.
        //detta är av säkerhetssjäl! man komme rinte alltid skicka med en cookie i e nförfrågan. utan credentials include är som alla andra CORS-hanteringar.
        //det kräver att man liksom säger ja.
        cookieHeader = "";
    }
   const match = cookieHeader.match(/session_id=(\d+)/); //REGEX, för att plocka ut värdet av cookien.
   //d = siffror
   //+ = flera olika siffror
   //vad regex får ut: [session_id="214210", 214210]
    let sessionId = null;
    if (match && match[1]) { //om det blev match och det finns en "value" så sätter vi
        sessionId = match[1]; //- session id:et till 214210! t ex.
    }

    let reqBody = {}; //förberedder ett tomt objekt- om http metoden är post/put behöver man detta
        if (reqMethod !== "GET" && reqMethod !== "OPTIONS") { //om http metoden ej är get eller options så antar vi att vi skickar med json..
            //OBS! detta betyder att även delete kommer behöva json... vilket blir lite konstigt
            //men så är det.
        reqBody = await req.json();
    }
    //en lista över vilka frontend-domäner som är tillåtna att göra CORS-anrop mot dehär apiet!
    //4242 - vår main server som "servar" vårt index.html
    //3000 - vår test sida
    //8000 det som apiet kör på! ifallifall.
    const allowedOrigins = [
        "http://localhost:4242",
        "http://localhost:3000",
        "http://localhost:8000"
    ];
    const requestOrigin = req.headers.get("Origin"); //hämtar headern "origin", vilket är vart anropet kommer ifrån (domänen)
    const corsHeaders = {
        "Access-Control-Allow-Origin": allowedOrigins.includes(requestOrigin) ? requestOrigin : "http://localhost:4242",
        //ovan är om requestorigin finns i allowedorigins så är det OK och sätts till den aktuella requestOrigin annars defulteras den till lokalhost 4242..
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", //listar http-metoder som tillåts
        "Access-Control-Allow-Headers": "Content-Type", //listar vilka headers content-type
        "Access-Control-Allow-Credentials": "true", //att  vi tillåter cookies. (credentials: include!)
    };

    const responseHeaders = { //slår ihop json saken med cors-headers 
        "Content-Type": "application/json",
        ...corsHeaders, //sprider ut samtliga fält från corsheaders här, så de "läggs till"
    };

    if (reqMethod === "OPTIONS") { //skickas vid preflight-förfrågningar
        //t ex put & delete, då måste servern liksom skicka tillbaka corsHeaders 
        //CORS-headersarna gör att klienten vet att den får fortsätta med nästa anrop.
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    const rootUsersPattern = new URLPattern({ pathname: "/users" }); //URLPattern är ett nytt web API (som Deno stödjer) 
    // som låter oss mönstermatcha URL:er och extrahera parametrar (params) om så behövs.
    const userIdPattern = new URLPattern({ pathname: "/users/:userId" }); //vid denna kan man faktiskt hämta userIdMatch.pathname.groups.userId.
    const loginPattern = new URLPattern({ pathname: "/users/login" });
    const logoutPattern = new URLPattern({ pathname: "/users/logout" });

    const rootMatch = rootUsersPattern.exec(reqUrl); //exec checkar om den matchar, annars blir de null.
    const userIdMatch = userIdPattern.exec(reqUrl);
    const isLogin = loginPattern.test(reqUrl); //boolean istället - .test kommer bara checka true/false
    const isLogout = logoutPattern.test(reqUrl); //vi behöver ej få ngn liksom objekt från dessa,vi ska inte ta ut en massa info som om vi skulle haft exec.

    // /users
    if (rootMatch && reqMethod === "GET") {
        //läser in alla användare från json filen och returnerar dem i ett response-objekt
        return getAllUsersFunc(responseHeaders);
    }

    if (rootMatch && reqMethod === "POST") {
        //som lägger till en ny användare (hämtar data från reqBody) och returnerar ett Response med 201 Created och en cookie‐header för session.
        return createUserFunc(reqBody, responseHeaders);
    }

    // /users/:id
    if (userIdMatch) {
        //plockar ut strängen som representerar userId (t.ex. "1748432728123").
        const urlUserId = userIdMatch.pathname.groups.userId;

        if (reqMethod === "GET") {
            //som läser in en specifik användare (beroende på urlUserId) och returnerar ett Response med JSON‐objektet för den användaren, eller 404 om den inte finns.
            return getUserFunc(urlUserId, responseHeaders);
        }

        if (reqMethod === "PUT") {
            //Man vill uppdatera en användare- skickar med reqBody, urlUserId, SessionId och responseheaders
            return updateUserFunc(reqBody, urlUserId, sessionId, responseHeaders);
        }

        if (reqMethod === "DELETE") {
            //delete.. radera... man skickar med urlUserId och sessionId
            return deleteUserFunc(urlUserId, sessionId, responseHeaders);
        }
    }

    // /users/login
    if (isLogin && reqMethod === "POST") {
        //tar in reqBody på vad du heter och vem du är, skapar en session_id/cookie
        return loginFunc(reqBody, responseHeaders);
    }

    // /users/logout
    if (isLogout && reqMethod === "POST") {
        //loggar ut dig- tar bort en cookie/session_id
        return logoutFunc(responseHeaders);
    }

    return new Response(JSON.stringify({ error: "Not Found" }), {
        status: 404,
        headers: responseHeaders,
    });
}