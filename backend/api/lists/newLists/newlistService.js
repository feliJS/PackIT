import {
    getListFunc,
    deleteListFunc,
    addItemFunc,
    getItemFunc,
    deleteItemFunc,
    updateItemFunc,
    createListFunc,
    getAllItemsFunc
} from "./listServices.js";

async function handler(req) {
    const reqBody = await req.json();
    const reqMethod = req.method;
    const reqUrl = new URL(req.url);

    const listData = await Deno.readTextFileSync("newLists.json");
    const listDB = JSON.parse(listData);

    const headersCORS = {
        "Access-Control-Allow-Origin": "*",
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

    if (reqMethod === "OPTIONS") {
        return new Response(null, {
            status: 200,
            headers: { ...headersCORS },
        });
    }

    // --- List routes ---
    if (reqMethod === "GET" && matchedListRouteParams) {
        return getListFunc(urlUserId, urlListId, listDB, responseHeaders);
    }

    if (reqMethod === "DELETE" && matchedListRouteParams) {
        return deleteListFunc(urlUserId, urlListId, listDB, responseHeaders);
    }

    if (reqMethod === "POST" && matchedCreateListParams) {
        return await createListFunc(urlUserId, reqBody, listDB, responseHeaders);
    }

    // --- Item routes ---
    if (reqMethod === "POST" && matchedAddItemParams) {
        return addItemFunc(reqBody, urlUserId, urlListId, listDB, responseHeaders);
    }

    if (reqMethod === "GET" && matchedAddItemParams) {
        return getAllItemsFunc(urlUserId, urlListId, listDB, responseHeaders);
    }

    if (reqMethod === "GET" && matchedHandleItemParams) {
        return getItemFunc(urlUserId, urlListId, urlItemId, listDB, responseHeaders);
    }

    if (reqMethod === "DELETE" && matchedHandleItemParams) {
        return deleteItemFunc(urlUserId, urlListId, urlItemId, listDB, responseHeaders);
    }

    if (reqMethod === "PUT" && matchedHandleItemParams) {
        return updateItemFunc(reqBody, urlUserId, urlListId, urlItemId, listDB, responseHeaders);
    }

    // Fallback
    return new Response(JSON.stringify({ error: "Bad request" }), {
        status: 400,
        headers: { ...responseHeaders },
    });
}

Deno.serve(handler);
