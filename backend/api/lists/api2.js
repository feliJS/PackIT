
async function handler(req) {

    const reqBody = await req.json();
    const reqMethod = req.method;
    const reqUrl = new URL(req.url);

    const listData = Deno.readTextFileSync("../../databaser/lists.json");
    const listDB = JSON.parse(listData);

    const headersCORS = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }
    const responseHeaders = {
        "Content-Type": "application/json", ...headersCORS
    }

    const expectedListRoute = new URLPattern({ pathname: "/users/:userId/:listId" });
    const expectedAddNewItemRoute = new URLPattern({ pathname: "/users/:userId/:listId/items" });
    const expectedHandleItemRoute = new URLPattern({ pathname: "/users/:userId/:listId/items/:itemId" });

    const matchedListRouteParams = expectedListRoute.exec(reqUrl);
    const matchedAddItemParams = expectedAddNewItemRoute.exec(reqUrl);
    const matchedHandleItemParams = expectedHandleItemRoute.exec(reqUrl);


    let urlUserId, urlListId, urlItemId;

    if (matchedListRouteParams) {
        urlUserId = matchedListRouteParams.pathname.groups.userId;
        urlListId = matchedListRouteParams.pathname.groups.listId;
    }
    if (matchedAddItemParams) {
        urlUserId = matchedAddItemParams.pathname.groups.userId;
        urlListId = matchedAddItemParams.pathname.groups.listId;
    }
    if (matchedHandleItemParams) {
        urlUserId = matchedHandleItemParams.pathname.groups.userId;
        urlListId = matchedHandleItemParams.pathname.groups.listId;
        urlItemId = matchedHandleItemParams.pathname.groups.itemId;
    }

    const foundList = listDB.find(currList => {
        return currList.userId == urlUserId && currList.listId == urlListId;
    });
    let foundItem;
    if (foundList) {
        foundItem = foundList.listItems.find(currItem => {
            return currItem.itemId == urlItemId;
        });
    }



    if (reqMethod === "OPTIONS") {
        return new Response(null, {
            status: 200,
            headers: { ...headersCORS }
        })
    }

    if (reqMethod != "GET" && reqMethod != "POST" && reqMethod != "DELETE" && reqMethod != "PUT") {
        return new Response(JSON.stringify({ message: "Invalid method" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        })
    }


    // LISTOR

    if (reqMethod === "GET" && urlUserId && urlListId) {

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

            const deletedList = listDB.splice(listInx, 1);

            await Deno.writeTextFile("../../databaser/lists.json", JSON.stringify(listDB));

            return new Response(JSON.stringify({ message: "Delete OK", deletedList }), {
                status: 200,
                headers: { ...responseHeaders }
            })
        }

    }


    // ITEMS 

    if (reqMethod === "POST" && matchedAddItemParams) {

        if (!foundList) {
            return new Response(JSON.stringify({ error: "List not found" }), {
                status: 404,
                headers: { ...responseHeaders }
            });
        }

        if (foundList) {

            const existingItem = foundList.listItems.some(currItem => {
                return currItem.itemName === reqBody.itemName;
            });

            if (existingItem) {
                return new Response(JSON.stringify({ error: "Item already exists" }), {
                    status: 409,
                    headers: { ...responseHeaders }
                })
            }

            if (!existingItem) {

                let newItemId;

                if (foundList.listItems.length > 0) {
                    let highestId = 0;

                    for (let i = 0; i < foundList.listItems.length; i++) {

                        let currentId = foundList.listItems[i].itemId;

                        if (currentId > highestId) {
                            highestId = currentId;
                        }
                    }

                    newItemId = highestId + 1;
                } else {
                    newItemId = 1;
                }

                const newItem = {
                    itemId: newItemId,
                    itemName: reqBody.itemName,
                    itemQuantity: reqBody.itemQuantity
                };

                foundList.listItems.push(newItem);

                await Deno.writeTextFile("../../databaser/lists.json", JSON.stringify(listDB));

                return new Response(JSON.stringify({ message: "Item added successfully" }), {
                    status: 201,
                    headers: { ...responseHeaders }
                });
            }
        }

    }

    if (reqMethod === "GET" && matchedHandleItemParams) {
        if (!foundList) {
            return new Response(JSON.stringify({ error: "List not found" }), {
                status: 404,
                headers: { ...responseHeaders }
            });
        }

        if (!foundItem) {
            return new Response(JSON.stringify({ error: "Item not found" }), {
                status: 404,
                headers: { ...responseHeaders }
            });
        }

        if (foundItem) {
            return new Response(JSON.stringify(foundItem), {
                status: 200,
                headers: { ...responseHeaders }
            });
        }
    }

    if (reqMethod === "DELETE" && matchedHandleItemParams) {

        if (!foundList) {
            return new Response(JSON.stringify({ error: "List not found" }), {
                status: 404,
                headers: { ...responseHeaders }
            });
        }

        if (foundList) {
            let itemIndex = -1;

            for (let i = 0; i < foundList.listItems.length; i++) {
                if (foundList.listItems[i].itemId == urlItemId) {
                    itemIndex = i;
                    break;
                }
            }

            if (itemIndex === -1) {
                return new Response(JSON.stringify({ error: "Item not found" }), {
                    status: 404,
                    headers: { ...responseHeaders }
                });
            }

            foundList.listItems.splice(itemIndex, 1);

            await Deno.writeTextFile("../../databaser/lists.json", JSON.stringify(listDB));

            return new Response(JSON.stringify({ message: "Item deleted successfully" }), {
                status: 200,
                headers: { ...responseHeaders }
            });
        }
    }

    if (reqMethod === "PUT" && matchedHandleItemParams) {

        if (!foundList) {
            return new Response(JSON.stringify({ error: "List not found" }), {
                status: 404,
                headers: { ...responseHeaders }
            });
        }

        if (!foundItem) {
            return new Response(JSON.stringify({ error: "Item not found" }), {
                status: 409,
                headers: { ...responseHeaders }
            });
        }

        if (foundItem) {

            if (reqBody.itemName !== undefined) {
                foundItem.itemName = reqBody.itemName;
            }

            if (reqBody.itemQuantity !== undefined) {
                foundItem.itemQuantity = reqBody.itemQuantity;
            }

            await Deno.writeTextFile("../../databaser/lists.json", JSON.stringify(listDB));

            return new Response(JSON.stringify({ message: "Item updated successfully" }), {
                status: 200,
                headers: { ...responseHeaders }
            });
        }

    }


    return new Response(JSON.stringify({ error: "Bad request" }), {
        status: 400,
        headers: { ...responseHeaders }
    })

}



/* ALT. UPPLÄGG */

/* -- API --
if (reqMethod === "GET" && matchedHandleItemParams) {
    return handleGetItem(req, responseHeaders, listDB, urlUserId, urlListId, urlItemId);
}
*/

/* -- function --
function handleGetItem(req, headers, db, userId, listId, itemId) {
    const foundList = db.find(l => l.userId == userId && l.listId == listId);
    if (!foundList) {
        return new Response(JSON.stringify({ error: "List not found" }), {
            status: 404,
            headers,
        });
    }
    const foundItem = foundList.listItems.find(i => i.itemId == itemId);
    if (!foundItem) {
        return new Response(JSON.stringify({ error: "Item not found" }), {
            status: 404,
            headers,
        });
    }
    return new Response(JSON.stringify(foundItem), {
        status: 200,
        headers,
    });
}
*/