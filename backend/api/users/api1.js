async function handler(request){
    const url = new URL(request.url);
    const headersCORS = new Headers();
    const cookieHeader = request.headers.get("Cookie"); //cookie
    headersCORS.set("Access-Control-Allow-Origin", "http://localhost:4242"); 
    headersCORS.set("Access-Control-Allow-Headers", "Content-Type");
    headersCORS.set("Access-Control-Allow-Credentials", "true");
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
                id: Date.now(), // Ger unikt ID
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
    // /users/:id
    if (url.pathname.startsWith("/users/")) {
        const id = url.pathname.split("/")[2]; // Plockar ut id:et, ger: ["", "users", "abc123"]
        const userIndex = getUsers.findIndex(user => user.id == id);

        //cookie ckontroll
        let sessionId = null;
        if (cookieHeader) {
        const match = cookieHeader.match(/session_id=(\d+)/);
        if (match) {
            sessionId = match[1];
        }
        }

        if (request.method === "GET") {
            if (userIndex == -1) {
                return new Response(JSON.stringify({ error: "user not found" }), { status: 404, headers: headersCORS });
            }
            const user = getUsers[userIndex];
            return new Response(JSON.stringify(user), { status: 200, headers: headersCORS });
        }
        if (sessionId != id && (request.method === "PUT" || request.method === "DELETE")) {
            return new Response(JSON.stringify({ error: "Not the right sessionId" }), { status: 403, headers: headersCORS });
        }

        if (request.method === "PUT") {
            
            if (sessionId !== id) { //cookie matching
                return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403, headers: headersCORS });
            }

            const body = await request.json();
            if (!body.name) { //lägg till && body.pfp senare!
                return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400, headers: headersCORS });
            }
            if (userIndex == -1) {
                return new Response(JSON.stringify({ error: "User not found" }), { status: 404, headers: headersCORS });
            }
            if (body.name) {
                getUsers[userIndex].name = body.name;
            }
            //if (body.pfp) {user.pfp = body.pfp;}
            saveUsers(getUsers);
            return new Response(JSON.stringify({ updated: "updated success" }), { status: 200, headers: headersCORS });
        }
    
        if (request.method === "DELETE") {
            
             if (sessionId !== id) {//cookie matching
                return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403, headers: headersCORS });
            }

            if (userIndex == -1) {
                return new Response(JSON.stringify({ error: "User not found" }), { status: 404, headers: headersCORS });
            }
            getUsers.splice(userIndex, 1);
            saveUsers(getUsers);
            return new Response(JSON.stringify({ deleted: "deleted user" }), { status: 200, headers: headersCORS });
        }
    }
     // /users/login
    if (url.pathname === "/users/login" && request.method === "POST") {
        const body = await request.json();
         if (!body.name || !body.password) {
            return new Response(JSON.stringify({ error: "Missing credentials" }), { status: 400, headers: headersCORS });
        }
        const user = getUsers.find(u => u.name == body.name && u.password == body.password);
        if (!user) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401, headers: headersCORS });
        }
        headersCORS.set("Set-Cookie", `session_id=${user.id}`);
        const userData = { id: user.id, name: user.name};//add pfp here aswell
        return new Response(JSON.stringify(userData), { status: 200, headers:  headersCORS});
        //cookies work
    }

    if (url.pathname === "/users/logout" && request.method === "POST") { //vet ej om denna fungerar..
        headersCORS.set("Set-Cookie", `session_id=;`); //sätta cookien till ingenting?
        return new Response(JSON.stringify({ message: "Logged out successfully" }), { status: 200, headers: headersCORS });
    }
     return new Response("Not Found", { status: 404 });
}

Deno.serve( handler)