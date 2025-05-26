
// users-api.js

import {
  getAllUsersFunc,
  createUserFunc,
  getUserFunc,
  updateUserFunc,
  deleteUserFunc,
  loginFunc,
  logoutFunc,
} from "./usersFunctions.js";

export async function usersHandler(req) {
    const reqUrl = new URL(req.url);
    const reqMethod = req.method;
    let cookieHeader = req.headers.get("Cookie");
    if (!cookieHeader) {
        cookieHeader = "";
    }
   const match = cookieHeader.match(/session_id=(\d+)/);
    let sessionId = null;
    if (match && match[1]) {
        sessionId = match[1];
    }

    let reqBody = {};
    if (reqMethod !== "GET" && reqMethod !== "OPTIONS") {
        reqBody = await req.json();
    }
    const allowedOrigins = [
        "http://localhost:4242",
        "http://localhost:3000",
        "http://localhost:8000"
    ];
    const requestOrigin = req.headers.get("Origin");
    const corsHeaders = {
        "Access-Control-Allow-Origin": allowedOrigins.includes(requestOrigin) ? requestOrigin : "http://localhost:4242",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Credentials": "true",
    };

    const responseHeaders = {
        "Content-Type": "application/json",
        ...corsHeaders,
    };

    if (reqMethod === "OPTIONS") {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    const rootUsersPattern = new URLPattern({ pathname: "/users" });
    const userIdPattern = new URLPattern({ pathname: "/users/:userId" });
    const userAddPattern = new URLPattern({ pathname: "/users/add" });
    const userSearchPattern = new URLPattern({ pathname: "/users/search"});
    const loginPattern = new URLPattern({ pathname: "/users/login" });
    const logoutPattern = new URLPattern({ pathname: "/users/logout" });

    const rootMatch = rootUsersPattern.exec(reqUrl);
    const userIdMatch = userIdPattern.exec(reqUrl);
    const userAddMatch = userAddPattern.test(reqUrl)
    const userSearchMatch = userSearchPattern.test(reqUrl)
    const isLogin = loginPattern.test(reqUrl);
    const isLogout = logoutPattern.test(reqUrl);

    // /users
    if (rootMatch && reqMethod === "GET") {
        return getAllUsersFunc(responseHeaders);
    }

    if (rootMatch && reqMethod === "POST") {
        return createUserFunc(reqBody, responseHeaders);
    }

    // /users/:id
    if (userIdMatch) {
        const urlUserId = userIdMatch.pathname.groups.userId;

        if (reqMethod === "GET") {
            return getUserFunc(urlUserId, responseHeaders);
        }

        if (reqMethod === "PUT") {
            return updateUserFunc(reqBody, urlUserId, sessionId, responseHeaders);
        }

        if (reqMethod === "DELETE") {
            return deleteUserFunc(urlUserId, sessionId, responseHeaders);
        }
    }

    if(userAddMatch){
        if (reqMethod === "POST") {
            return addUser(reqBody.id, sessionId, responseHeaders);
        }
    }

    if(userSearchMatch){
        if (reqMethod === "POST") {
            return searchUser(reqBody.username, sessionId, responseHeaders);
        }
    }

    // /users/login
    if (isLogin && reqMethod === "POST") {
        return loginFunc(reqBody, responseHeaders);
    }

    // /users/logout
    if (isLogout && reqMethod === "POST") {
        return logoutFunc(responseHeaders);
    }

    return new Response(JSON.stringify({ error: "Not Found" }), {
        status: 404,
        headers: responseHeaders,
    });
}