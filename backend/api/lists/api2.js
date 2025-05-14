
async function handler(req) {

    const reqMethod = req.method;
    const reqUrl = new URL(req.url);
    const reqUrlPathname = reqUrl.pathname;

    const listData = Deno.readTextFileSync("../../databaser/lists.json");
    const listDB = JSON.parse(listData);

    const headersCORS = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }
    const responseHeaders = {
        "Content-Type": "application/json", ...headersCORS
    }

    const expectedListRoute = new URLPattern({ pathname: "/users/:userId/:listId" });
    const matchedListRouteParams = expectedListRoute.exec(reqUrl);
    let urlUserId, urlListId;
    if (matchedListRouteParams) {
        urlUserId = matchedUrlParams.pathname.groups.userId;
        urlListId = matchedUrlParams.pathname.groups.listId;
    }

    const expectedAddNewItemRoute = new URLPattern({ pathname: "/users/:userId/:listId/items" });
    const matchedAddItemParams = expectedAddNewItemRoute.exec(reqUrl);
    let addUserId, addListId;
    if (matchedAddItemParams) {
        addUserId = matchedAddItemParams.pathname.groups.userId;
        addListId = matchedAddItemParams.pathname.groups.listId;
    }

    const expectedHandleItemRoute = new URLPattern({ pathname: "/users/:userId/:listId/items/:itemId" });
    const matchedHandleItemParams = expectedHandleItemRoute.exec(reqUrl);
    let urlItemId;
    if (matchedHandleItemParams) {
        urlUserId = matchedHandleItemParams.pathname.groups.userId;
        urlListId = matchedHandleItemParams.pathname.groups.listId;
        urlItemId = matchedHandleItemParams.pathname.groups.itemId;
    }


    if (reqUrlPathname === "OPTIONS") {
        return new Response(null, {
            status: 200,
            headers: { ...headersCORS }
        })
    }


    // LISTOR

    if (reqMethod != "GET" && reqMethod != "POST" && reqMethod != "DELETE" && reqMethod != "PATCH") {
        return new Response(JSON.stringify({ message: "Invalid method" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        })
    }

    if (reqMethod === "GET" && urlUserId && urlListId) {     // Gör ev. fallback ***

        const foundList = listDB.find(currList => {
            return currList.userId == urlUserId && currList.listId == urlListId
        });


        if (foundList) {
            return new Response(JSON.stringify(foundList), {
                status: 200,
                headers: { ...responseHeaders }
            })
        }

        if (!foundList) {
            return new Response(JSON.stringify({ error: "No list found" }), {
                status: 404,
                headers: { ...responseHeaders }
            })
        }

    }

    if (reqMethod === "DELETE" && urlUserId && urlListId) {

        const deletedList = null;
        const listInx = listDB.findIndex(currList => {
            return currList.userId == urlUserId && currList.listId == urlListId
        })

        if (listInx === -1) {
            return new Response(JSON.stringify({ error: "List not found" }), {
                status: 404,
                headers: { ...responseHeaders }
            })
        }

        if (listInx > -1) {

            deletedList = listDB.splice(listInx, 1);

            await Deno.writeTextFile("../../databaser/lists.json", JSON.stringify(listDB));

            return new Response(JSON.stringify({ message: "Delete OK" }), {
                status: 200,
                headers: { ...responseHeaders }
            })
        }

    }

    if (reqMethod === "PUT" && urlUserId && urlListId) {  /* *** */ }


    // ITEMS

    if (reqMethod === "POST" && matchedAddItemParams) {

        const urlUserId = matchedAddItemParams.pathname.groups.userId;
        const urlListId = matchedAddItemParams.pathname.groups.listId;

        const foundList = listDB.find(currList => {
            return currList.userId === urlUserId && currList.listId === urlListId
        });

        if (!foundList) {
            return new Response(JSON.stringify({ error: "List not found" }), {
                status: 404,
                headers: { ...responseHeaders }
            });
        }

        if (foundList) {
            const reqBody = await req.json();
            const newItemId = 2; // SÄTT UNIKT ID ***

            const newItem = {
            }

        }

    }



}