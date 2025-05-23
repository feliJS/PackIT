
// --- LISTS ---

// (GET)
export async function getListFunc(urlUserId, urlListId, listDB, responseHeaders) {
    const foundList = listDB.find(currList => currList.userId == urlUserId && currList.listId == urlListId);

    if (foundList) {
        return new Response(JSON.stringify(foundList), {
            status: 200,
            headers: { ...responseHeaders }
        });
    }

    return new Response(JSON.stringify({ error: "No list found" }), {
        status: 404,
        headers: { ...responseHeaders }
    });
}

// (DELETE)
export async function deleteListFunc(urlUserId, urlListId, listDB, responseHeaders) {
    const listInx = listDB.findIndex(currList => currList.userId == urlUserId && currList.listId == urlListId);

    if (listInx === -1) {
        return new Response(JSON.stringify({ error: "List not found" }), {
            status: 404,
            headers: { ...responseHeaders }
        });
    }

    const deletedList = listDB.splice(listInx, 1);

    await Deno.writeTextFile("../databaser/lists.json", JSON.stringify(listDB));

    return new Response(JSON.stringify({ message: "Delete OK", deletedList }), {
        status: 200,
        headers: { ...responseHeaders }
    });
}

// (POST)
export async function createListFunc(urlUserId, reqBody, listDB, responseHeaders) {
    let maxId = 0;
    for (const list of listDB) {
        if (list.listId > maxId) {
            maxId = list.listId;
        }
    }
    const newListId = maxId + 1;
    
    const newList = {
        userId: Number(urlUserId),
        listId: newListId,
        listItems: reqBody.listItems || []
    };

    listDB.push(newList);

    await Deno.writeTextFile("../databaser/lists.json", JSON.stringify(listDB));

    return new Response(JSON.stringify({ message: "List created", list: newList }), {
        status: 201,
        headers: { ...responseHeaders }
    });
}



// --- ITEMS ---

// (POST)
export async function addItemFunc(reqBody, urlUserId, urlListId, listDB, responseHeaders) {
    const foundList = listDB.find(currList => currList.userId == urlUserId && currList.listId == urlListId);

    if (!foundList) {
        return new Response(JSON.stringify({ error: "List not found" }), {
            status: 404,
            headers: { ...responseHeaders }
        });
    }

    const existingItem = foundList.listItems.some(currItem => currItem.itemName === reqBody.itemName);

    if (existingItem) {
        return new Response(JSON.stringify({ error: "Item already exists" }), {
            status: 409,
            headers: { ...responseHeaders }
        });
    }

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

    await Deno.writeTextFile("../databaser/lists.json", JSON.stringify(listDB));

    return new Response(JSON.stringify({ message: "Item added successfully" }), {
        status: 201,
        headers: { ...responseHeaders }
    });
}

// (GET) Alla items i en lista
export async function getAllItemsFunc(urlUserId, urlListId, listDB, responseHeaders) {
    const foundList = listDB.find(currList => currList.userId == urlUserId && currList.listId == urlListId);

    if (!foundList) {
        return new Response(JSON.stringify({ error: "List not found" }), {
            status: 404,
            headers: { ...responseHeaders }
        });
    }

    return new Response(JSON.stringify(foundList.listItems), {
        status: 200,
        headers: { ...responseHeaders }
    });
}

// (GET)
export async function getItemFunc(urlUserId, urlListId, urlItemId, listDB, responseHeaders) {
    const foundList = listDB.find(currList => currList.userId == urlUserId && currList.listId == urlListId);

    if (!foundList) {
        return new Response(JSON.stringify({ error: "List not found" }), {
            status: 404,
            headers: { ...responseHeaders }
        });
    }

    const foundItem = foundList.listItems.find(currItem => currItem.itemId == urlItemId);

    if (!foundItem) {
        return new Response(JSON.stringify({ error: "Item not found" }), {
            status: 404,
            headers: { ...responseHeaders }
        });
    }

    return new Response(JSON.stringify(foundItem), {
        status: 200,
        headers: { ...responseHeaders }
    });
}

// (DELETE)
export async function deleteItemFunc(urlUserId, urlListId, urlItemId, listDB, responseHeaders) {
    const foundList = listDB.find(currList => currList.userId == urlUserId && currList.listId == urlListId);

    if (!foundList) {
        return new Response(JSON.stringify({ error: "List not found" }), {
            status: 404,
            headers: { ...responseHeaders }
        });
    }

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

    await Deno.writeTextFile("../databaser/lists.json", JSON.stringify(listDB));

    return new Response(JSON.stringify({ message: "Item deleted successfully" }), {
        status: 200,
        headers: { ...responseHeaders }
    });
}

// (PUT)
export async function updateItemFunc(reqBody, urlUserId, urlListId, urlItemId, listDB, responseHeaders) {
    const foundList = listDB.find(currList => currList.userId == urlUserId && currList.listId == urlListId);

    if (!foundList) {
        return new Response(JSON.stringify({ error: "List not found" }), {
            status: 404,
            headers: { ...responseHeaders }
        });
    }

    const foundItem = foundList.listItems.find(currItem => currItem.itemId == urlItemId);

    if (!foundItem) {
        return new Response(JSON.stringify({ error: "Item not found" }), {
            status: 409,
            headers: { ...responseHeaders }
        });
    }

    if (reqBody.itemName !== undefined) {
        foundItem.itemName = reqBody.itemName;
    }

    if (reqBody.itemQuantity !== undefined) {
        foundItem.itemQuantity = reqBody.itemQuantity;
    }

    await Deno.writeTextFile("../databaser/lists.json", JSON.stringify(listDB));

    return new Response(JSON.stringify({ message: "Item updated successfully" }), {
        status: 200,
        headers: { ...responseHeaders }
    });
}
