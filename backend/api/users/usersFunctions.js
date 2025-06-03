const DB_PATH = "../databaser/users.json"; //sök väg till json filen

async function readUsers() { //returnerar en promise som sen är datan
  const data = await Deno.readTextFile(DB_PATH); //readTextFile är async! det är för de kan ta tid
  //att läsa json filen om den är stor...
  return JSON.parse(data);
}

async function writeUsers(users) {
  await Deno.writeTextFile(DB_PATH, JSON.stringify(users, null, 2));
  //konverterar objekter till en läsbar json fil (2 mellanslag, för bättre formatering...)
}

// (GET)  /users
export async function getAllUsersFunc(responseHeaders) {
  const users = await readUsers(); //läser in alla användare från filen
  return new Response(JSON.stringify(users), { //returnerar response med json-arrayen och status 200
    status: 200,
    headers: { ...responseHeaders }, //sprid ut responseHeaders
  });
}

// (POST) /users
export async function createUserFunc(reqBody, responseHeaders) {
  if (!reqBody.name || !reqBody.password) { //validerar att klienten har både skickat med ae och password i reqBody.
    return new Response(JSON.stringify({ error: "Missing fields" }), { 
      status: 400,
      headers: { ...responseHeaders },
    });
  }

  const users = await readUsers(); //läser in alla användare
  if (users.find((u) => u.name == reqBody.name)) { //hittar ifall någon har samma namn
    return new Response(JSON.stringify({ error: "User already exists" }), {
      status: 409,
      headers: { ...responseHeaders },
    });
  }

  //skapa ny användare ! date.now() är ett unikt id i millisekunder på aktuell tidsstämpel.. 
  const newUser = {
    id: Date.now(),
    name: reqBody.name,
    password: reqBody.password,
    pfp: reqBody.pfp //denna är valfri som användaren skickar med i.. man behöver ingen profil bild (det kan vara så apiet ej funkar eller nått)
  };

  const headersWithCookie = {
    ...responseHeaders, //kopierar alla responseHeaders
    "Set-Cookie": `session_id=${newUser.id}; Path=/`, //lägger till en ny header med cookie!
    //denna gör att du lagrar en cookie som är session_id med den nya userns id
    // path= / anger att kakan gäller för hela domänen så att framtida anrop skickar med samma cookie,
    //oavsett om det är /home eller /loginpage eller vart du är på sidan.
  };

  users.push(newUser); //lägger till det nya användar objektet i users
  await writeUsers(users); //skriver tillbaka den uppdaterade arrayen till json (hela)

  return new Response(JSON.stringify(newUser), { //returnerar objectet med den nya användaren.
    status: 201,
    headers: headersWithCookie,
  });
}

// (GET)  /users/:id
export async function getUserFunc(urlUserId, responseHeaders) {
  const users = await readUsers();
  //letar igenom users efter ett objekt som är samma som usern
  //detta är lite säkerhets risk ! man kan hämta en user utan att det är du som hämtar den..
  //alltså kan du vara ngn annan o se lösenord! där är ingen sessionId check.
  const user = users.find((u) => u.id == urlUserId);

  if (!user) {
    //om det ej fanns ngn med det id:et...
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { ...responseHeaders },
    });
  }
  //annars skicka den specifika användaren (för o displaya namn eller liknande.)
  return new Response(JSON.stringify(user), {
    status: 200,
    headers: { ...responseHeaders },
  });
}

// (PUT)  /users/:id
export async function updateUserFunc(
  reqBody,
  urlUserId,
  sessionId,
  responseHeaders,
) {
  if (sessionId !== urlUserId) { //säkerhets kontroll!
    //vi hämtade cookien innnan i users-api.js... och nu kan vi använda den!
    //genom o kolla om den ee sama som urlUserId (den som är inloggad)
    //så kan vi se ifall du verkligen kan logga in...
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
      headers: { ...responseHeaders },
    });
  }

  const users = await readUsers();
  const user = users.find((u) => u.id == urlUserId); //hitta rätt användare

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { ...responseHeaders },
    });
  }

  if (reqBody.name !== undefined) user.name = reqBody.name; 
  //ovan är om klienten skickade med ett nytt namn, uppdatera username.

  await writeUsers(users); //skriv över allt igen med det nya
  return new Response(JSON.stringify({ message: "Update OK" }), {
    status: 200,
    headers: { ...responseHeaders },
  });
}

// (DELETE) /users/:id
export async function deleteUserFunc(
  urlUserId,
  sessionId,
  responseHeaders,
) {
  if (sessionId !== urlUserId) { //kollar samma
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
      headers: { ...responseHeaders },
    });
  }

  const users = await readUsers();
  const index = users.findIndex((u) => u.id == urlUserId); //hitta rött

  if (index == -1) { //om den ej hittar ngn blir det -1
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { ...responseHeaders },
    });
  }

  users.splice(index, 1); //ta bort från det indexet vi fick och sen 1 person 
  await writeUsers(users);

  const headersWithCookie = {
    ...responseHeaders,
    "Set-Cookie": "session_id=; Path=/; Max-Age=0",
    //Skapar en header som tar bort session_id‐kakan hos klienten, genom att sätta max‐age=0.
    //du kan ju ej vara nloggad om du är borta
  };

  return new Response(JSON.stringify({ message: "User deleted" }), {
    status: 200,
    headers: headersWithCookie,
  });
}

// (POST) /users/login
export async function loginFunc(reqBody, responseHeaders) {
  if (!reqBody.name || !reqBody.password) { //du måste ju skriva in vem som ska loggas in
    return new Response(JSON.stringify({ error: "Missing credentials" }), {
      status: 400,
      headers: { ...responseHeaders },
    });
  }

  const users = await readUsers();
  const user = users.find( //hitta rätt användare med rätt lösenord och password
    (u) => u.name == reqBody.name && u.password == reqBody.password,
  );

  if (!user) { //annars kan du ju inte logga in..
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
      headers: { ...responseHeaders },
    });
  }

  const headersWithCookie = {
    ...responseHeaders,
    "Set-Cookie": `session_id=${user.id}; Path=/`,
    //sätt en cookie! precis som när du skapar ny användare.
  };

  const publicUser = { id: user.id, name: user.name, pfp: user.pfp };
  //detta är du nu som är inloggad, returnera utan lösenord till klienten.
  return new Response(JSON.stringify(publicUser), {
    status: 200,
    headers: headersWithCookie,
  });
}

// (POST) /users/logout
export function logoutFunc(responseHeaders) {
  const headersWithCookie = {
    ...responseHeaders,
    "Set-Cookie": "session_id=; Path=/; Max-Age=0",
    //samma som delete, sätta max age 0
  };

  return new Response(JSON.stringify({ message: "Logged out successfully" }), {
    status: 200,
    headers: headersWithCookie,
  });
}
