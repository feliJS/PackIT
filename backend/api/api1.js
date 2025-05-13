/*[
    "ID": 1341342,
    "User" : {
        name : "hej",
        password : "123",
        pfp : "orkoqwp", 
    },
    online : true, --- kolla mer på det
    Lists : {
        listId : "12412421"
        listId : "12412421"
        listId : "12412421"
    }
]*/

async function handler(request){
    const url = new URL(request.url);
    const headersCORS = new Headers();
    headersCORS.set("Access-Control-Allow-Origin", "*"); 
    headersCORS.set("Access-Control-Allow-Headers", "Content-Type");
    if (request.method === "OPTIONS") {
    return new Response(null, { headers: headersCORS });
    }
    //users
    if(url.pathname == "/users"){
        const allowedMethods = ["GET", "POST", "DELETE"]
        if (!allowedMethods.includes(request.method)) {
            return new Response({status: 400,

                headers: { "Content-Type": "application/json" }
            });
        }
}

Deno.serve(handler)