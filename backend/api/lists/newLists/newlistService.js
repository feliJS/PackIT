import {
    getListFunc,
    getAllListsByUserFunc,
    deleteListFunc,
    renameListFunc,
    addItemFunc,
    getItemFunc,
    deleteItemFunc,
    updateItemFunc,
    createListFunc,
    getAllItemsFunc
} from "./newlistApiServer.js";

async function handler(req) {
    // let reqBody = {};
    // if (req.method !== "GET" && req.method !== "OPTIONS") {
    //     try {
    //         reqBody = await req.json();
    //     } catch (err) {
    //         console.warn("⚠️ Misslyckades läsa JSON:", err.message);
    //         reqBody = {};
    //     }
    // }
    const reqMethod = req.method;
    const reqUrl = new URL(req.url);

    const listData = await Deno.readTextFileSync("newLists.json");
    const listDB = JSON.parse(listData);

    const allowedOrigins = [
        "http://localhost:4242",
        "http://localhost:3000"
    ];

    const requestOrigin = req.headers.get("Origin") || "";

    const headersCORS = {
        "Access-Control-Allow-Origin": allowedOrigins.includes(requestOrigin) ? requestOrigin : "http://localhost:4242",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };

    const responseHeaders = { "Content-Type": "application/json", ...headersCORS, };

    // --- URL-patterns ---
    const expectedCreateListRoute = new URLPattern({ pathname: "/users/:userId/lists" });
    const expectedListRoute = new URLPattern({ pathname: "/users/:userId/:listId" });
    const expectedAddNewItemRoute = new URLPattern({ pathname: "/users/:userId/:listId/items" });
    const expectedHandleItemRoute = new URLPattern({ pathname: "/users/:userId/:listId/items/:itemId" });

    const matchedCreateListParams = expectedCreateListRoute.exec(reqUrl);
    const matchedListRouteParams = expectedListRoute.exec(reqUrl);
    const matchedAddItemParams = expectedAddNewItemRoute.exec(reqUrl);
    const matchedHandleItemParams = expectedHandleItemRoute.exec(reqUrl);

    let urlUserId, urlListId, urlItemId;

    if (matchedHandleItemParams) {
        // Mest specifika routen
        urlUserId = matchedHandleItemParams.pathname.groups.userId;
        urlListId = matchedHandleItemParams.pathname.groups.listId;
        urlItemId = matchedHandleItemParams.pathname.groups.itemId;
    } else if (matchedAddItemParams) {
        urlUserId = matchedAddItemParams.pathname.groups.userId;
        urlListId = matchedAddItemParams.pathname.groups.listId;
    } else if (matchedListRouteParams) {
        urlUserId = matchedListRouteParams.pathname.groups.userId;
        urlListId = matchedListRouteParams.pathname.groups.listId;
    } else if (matchedCreateListParams) {
        urlUserId = matchedCreateListParams.pathname.groups.userId;
    }

    // if (reqMethod === "OPTIONS") {
    //     return new Response(null, {
    //         status: 200,
    //         headers: { ...headersCORS },
    //     });
    // }
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 200,
            headers: {
                ...headersCORS,
                "Access-Control-Allow-Credentials": "true"
            }
        });
    }

    // --- List routes ---
    // if (reqMethod === "GET" && matchedListRouteParams) {
    //     console.log("Den kom?")
    //     return getListFunc(urlUserId, urlListId, responseHeaders);
    // }

    if (req.method === "GET" && req.url.includes("/users/0/1")) {
        return new Response(JSON.stringify({ message: "hej från servern" }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:4242",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Credentials": "true"
            }
        });
    }

    if (reqMethod === "DELETE" && matchedListRouteParams) {
        return deleteListFunc(urlUserId, urlListId, responseHeaders);
    }

    if (reqMethod === "POST" && matchedCreateListParams) {
        return await createListFunc(urlUserId, reqBody, responseHeaders);
    }

    // --- Item routes ---
    if (reqMethod === "POST" && matchedAddItemParams) {
        return addItemFunc(reqBody, urlUserId, urlListId, responseHeaders);
    }

    if (reqMethod === "GET" && matchedAddItemParams) {
        return getAllItemsFunc(urlUserId, urlListId, responseHeaders);
    }

    if (reqMethod === "GET" && matchedHandleItemParams) {
        return getItemFunc(urlUserId, urlListId, urlItemId, responseHeaders);
    }

    if (reqMethod === "DELETE" && matchedHandleItemParams) {
        return deleteItemFunc(urlUserId, urlListId, urlItemId, responseHeaders);
    }

    if (reqMethod === "PUT" && matchedHandleItemParams) {
        return updateItemFunc(reqBody, urlUserId, urlListId, urlItemId, responseHeaders);
    }

    // Fallback
    return new Response(JSON.stringify({ error: "Bad request" }), {
        status: 400,
        headers: { ...responseHeaders },
    });
}

Deno.serve(handler);
