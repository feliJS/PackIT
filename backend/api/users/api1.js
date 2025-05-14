/*[
    "ID": 1341342,
    "User" : {
        name : "hej",
        password : "123",
        pfp : "orkoqwp", 
    },
    Cookies - för o kolla om online
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

    const getUsers = JSON.parse(Deno.readTextFileSync("../../databaser/users.json"))
    const saveUsers = (users) => Deno.writeTextFileSync("../../databaser/users.json", JSON.stringify(users, null, 2)); //2 används för rader (enklare att läsa)
    //users
    if(url.pathname == "/users"){
        const allowedMethods = ["GET", "POST", "DELETE"]
        if (!allowedMethods.includes(request.method)) {
            return new Response({status: 400,

                headers: { "Content-Type": "application/json" }
            });
        }
        if(request.method == "GET"){
            headersCORS.set("Content-Type", "application/json");
            return new Response(JSON.stringify(getUsers), { 

                status: 200,

                headers: headersCORS,
              });
        }
        
        if(request.method == "POST"){
            headersCORS.set("Content-Type", "application/json");
            const body = await request.json();
            if (!body.name || !body.password) {
                return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400, headers: headersCORS });
            }
            if (getUsers.find(user => user.name === body.name)) {
                return new Response(JSON.stringify({ error: "User already exists" }), { status: 409, headers: headersCORS });
            }
        
            const newUser = {
                id: 123, //id
                name: body.name,
                password: body.password, 
                //profil bild?
                lists: []
            };

            getUsers.push(newUser);
            saveUsers(getUsers);
            return new Response(JSON.stringify(newUser), { status: 201, headers: headersCORS });
       
        }
    }
     return new Response("Not Found", { status: 404 });
}

Deno.serve( handler)