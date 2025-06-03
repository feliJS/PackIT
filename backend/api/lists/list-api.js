// list-api.js

import {
    createListFunc,
    getAllListsFunc,
    getListFunc,
    deleteListFunc,
    addItemFunc,
    getAllItemsFunc,
    updateItemFunc,
    deleteItemFunc,
} from "./listFunctions.js";

export async function listHandler(req) {
    const reqUrl = new URL(req.url);
    const reqMethod = req.method;

    let reqBody = {};
    if (reqMethod !== "GET" && reqMethod !== "OPTIONS" && reqMethod !== "DELETE") {
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

    const listData = await Deno.readTextFile("../databaser/lists.json");
    const listDB = JSON.parse(listData);

    // URL patterns
    const allListsPattern = new URLPattern({ pathname: "/lists/:userId" });
    const singleListPattern = new URLPattern({ pathname: "/lists/:userId/:listId" });
    const allItemsPattern = new URLPattern({ pathname: "/lists/:userId/:listId/items" });
    const singleItemPattern = new URLPattern({ pathname: "/lists/:userId/:listId/items/:itemId" });

    const allListsMatch = allListsPattern.exec(reqUrl);
    const singleListMatch = singleListPattern.exec(reqUrl);
    const allItemsMatch = allItemsPattern.exec(reqUrl);
    const singleItemMatch = singleItemPattern.exec(reqUrl);

    // === GET ===
    if (reqMethod === "GET") {

        // /lists/:userId/:listId/items
        if (allItemsMatch) {
            const { userId, listId } = allItemsMatch.pathname.groups;
            return getAllItemsFunc(userId, listId, listDB, responseHeaders);
        }

        // /lists/:userId/:listId
        if (singleListMatch) {
            const { userId, listId } = singleListMatch.pathname.groups;
            return getListFunc(userId, listId, listDB, responseHeaders);
        }

        // /lists/:userId
        if (allListsMatch) {
            const { userId } = allListsMatch.pathname.groups;

            return getAllListsFunc(userId, listDB, responseHeaders);
        }
    }

    // === POST ===
    if (reqMethod === "POST") {
        // /lists/:userId/:listId/items
        if (allItemsMatch) {
            const { userId, listId } = allItemsMatch.pathname.groups;
            return addItemFunc(reqBody, userId, listId, listDB, responseHeaders);
        }

        // /lists/:userId
        if (allListsMatch) {
            const { userId } = allListsMatch.pathname.groups;
            return await createListFunc(userId, reqBody, listDB, responseHeaders);
        }
    }

    // === PUT ===
    // /lists/:userId/:listId/items/:itemId
    if (reqMethod === "PUT" && singleItemMatch) { //jag tror inte vi använder denna någon gång
        const { userId, listId, itemId } = singleItemMatch.pathname.groups;
        return updateItemFunc(reqBody, userId, listId, itemId, listDB, responseHeaders);
    }

    // === DELETE ===
    if (reqMethod === "DELETE") {
        // /lists/:userId/:listId/items/:itemId
        if (singleItemMatch) {
            const { userId, listId, itemId } = singleItemMatch.pathname.groups;
            return deleteItemFunc(userId, listId, itemId, listDB, responseHeaders);
        }

        // /lists/:userId/:listId
        if (singleListMatch) {
            const { userId, listId } = singleListMatch.pathname.groups;
            return deleteListFunc(userId, listId, listDB, responseHeaders);
        }
    }

    // === Fallback ===
    return new Response(JSON.stringify({ error: "Not Found" }), {
        status: 404,
        headers: responseHeaders,
    });
}
