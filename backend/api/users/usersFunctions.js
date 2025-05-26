const DB_PATH = "../databaser/users.json";

async function readUsers() {
  const data = await Deno.readTextFile(DB_PATH);
  return JSON.parse(data);
}

async function writeUsers(users) {
  await Deno.writeTextFile(DB_PATH, JSON.stringify(users, null, 2));
}

// (GET)  /users
export async function getAllUsersFunc(responseHeaders) {
  const users = await readUsers();
  return new Response(JSON.stringify(users), {
    status: 200,
    headers: { ...responseHeaders },
  });
}

// (POST) /users
export async function createUserFunc(reqBody, responseHeaders) {
  if (!reqBody.name || !reqBody.password) {
    return new Response(JSON.stringify({ error: "Missing fields" }), {
      status: 400,
      headers: { ...responseHeaders },
    });
  }

  const users = await readUsers();
  if (users.find((u) => u.name == reqBody.name)) {
    return new Response(JSON.stringify({ error: "User already exists" }), {
      status: 409,
      headers: { ...responseHeaders },
    });
  }

  const newUser = {
    id: Date.now(),
    name: reqBody.name,
    password: reqBody.password,
    pfp: reqBody.pfp
  };

  const headersWithCookie = {
    ...responseHeaders,
    "Set-Cookie": `session_id=${newUser.id}; Path=/`,
  };

  users.push(newUser);
  await writeUsers(users);

  return new Response(JSON.stringify(newUser), {
    status: 201,
    headers: headersWithCookie,
  });
}


// (POST) /users/add
export async function addUser(userToAddId, sessionId, responseHeaders) {
  if (!userToAddId) {
    return new Response(JSON.stringify({ error: "Missing fields" }), {
      status: 400,
      headers: { ...responseHeaders },
    });
  }

  const users = await readUsers();
  let sessionUser = users.find((u) => u.id == sessionId);
  if (sessionUser.friends.includes(userToAddId)) {
    return new Response(JSON.stringify({ error: "User already froiend" }), {
      status: 409,
      headers: { ...responseHeaders },
    });
  }
  sessionUser.friends.push(userToAddId);
  await writeUsers(users);

  return new Response("User friended!", {
    status: 200,
    headers: responseHeaders,
  });
}

// (POST) /users/friends

// (GET)  /users/:id
export async function getUserFunc(urlUserId, responseHeaders) {
  const users = await readUsers();
  const user = users.find((u) => u.id == urlUserId);

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { ...responseHeaders },
    });
  }

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
  if (sessionId !== urlUserId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
      headers: { ...responseHeaders },
    });
  }

  const users = await readUsers();
  const user = users.find((u) => u.id == urlUserId);

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { ...responseHeaders },
    });
  }

  if (reqBody.name !== undefined) user.name = reqBody.name;

  await writeUsers(users);
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
  if (sessionId !== urlUserId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
      headers: { ...responseHeaders },
    });
  }

  const users = await readUsers();
  const index = users.findIndex((u) => u.id == urlUserId);

  if (index == -1) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { ...responseHeaders },
    });
  }

  users.splice(index, 1);
  await writeUsers(users);

  return new Response(JSON.stringify({ message: "User deleted" }), {
    status: 200,
    headers: { ...responseHeaders },
  });
}

// (POST) /users/login
export async function loginFunc(reqBody, responseHeaders) {
  if (!reqBody.name || !reqBody.password) {
    return new Response(JSON.stringify({ error: "Missing credentials" }), {
      status: 400,
      headers: { ...responseHeaders },
    });
  }

  const users = await readUsers();
  const user = users.find(
    (u) => u.name == reqBody.name && u.password == reqBody.password,
  );

  if (!user) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
      headers: { ...responseHeaders },
    });
  }

  const headersWithCookie = {
    ...responseHeaders,
    "Set-Cookie": `session_id=${user.id}; Path=/`,
  };

  const publicUser = { id: user.id, name: user.name, pfp: user.pfp };
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
  };

  return new Response(JSON.stringify({ message: "Logged out successfully" }), {
    status: 200,
    headers: headersWithCookie,
  });
}
