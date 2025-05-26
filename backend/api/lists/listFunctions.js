
const DB_PATH = "../databaser/lists.json";

function saveDB(listDB) {
    return Deno.writeTextFile(DB_PATH, JSON.stringify(listDB));
}


// /users/:userId/lists
// (POST) - skapa en ny lista efter alla steg användaren klickat sig genom
export async function createListFunc(urlUserId, reqBody, listDB, responseHeaders) {
    
    const { listName, template } = reqBody;  // listName = stad som user valt, template = typ av resa user har valt (måstre hämta ut i req som inputs..)

    // Hämta användarens basic-list
    const userBasicList = listDB.find(l =>
    l.userId === Number(userId) &&
    l.listName.toLowerCase() === "basic list"
    );
  
    // Hämtar lista utifrån det listName som skickats med i req-bodyn (aka inputen om vilken typ av resa användaren ska göra)
    const typeTemplate = listDB.find(l =>
    l.userId === 0 &&
    l.listName.toLowerCase() === template.toLowerCase()
    );

    // Skapa ny list-objekt
    const newListId = Math.max(...listDB.map(l => l.listId)) + 1;

    const newList = {
        userId: Number(userId),
        listId: newListId,
        listName: listName, // <-- stadens namn
        listItems: [...userBasicList.listItems, ...typeTemplate.listItems]
    };

    listDB.push(newList);
    await saveDB(listDB);

    return new Response(JSON.stringify({ message: "List created", list: newList }), {
        status: 201,
        headers: { ...responseHeaders }
    });
}

// (GET) - hämta alla listor för en userId (behövs till profilsidan för att displaya alla listor)
export async function getAllListsFunc(urlUserId, listDB, responseHeaders) {
    const userLists = listDB.filter(list => list.userId == urlUserId);
  
    return new Response(JSON.stringify(userLists), {
      status: 200,
      headers: { ...responseHeaders }
    });
  }


// /users/:userId/lists/:listId
// (GET) - hämta en lista
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

// (DELETE) - radera en lista
export async function deleteListFunc(urlUserId, urlListId, listDB, responseHeaders) {
    const listInx = listDB.findIndex(currList => currList.userId == urlUserId && currList.listId == urlListId);

    if (listInx === -1) {
        return new Response(JSON.stringify({ error: "List not found" }), {
            status: 404,
            headers: { ...responseHeaders }
        });
    }

    const deletedList = listDB.splice(listInx, 1);

    await saveDB(listDB);

    return new Response(JSON.stringify({ message: "Delete OK", deletedList }), {
        status: 200,
        headers: { ...responseHeaders }
    });
}





// --- ITEMS ---

// /users/:userId/lists/:listId/items
// (POST) - lägg till ett item
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

    await saveDB(listDB);

    return new Response(JSON.stringify({ message: "Item added successfully" }), {
        status: 201,
        headers: { ...responseHeaders }
    });
}

// (GET) Alla items i en lista (används för att displaya listan)
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


// (GET) - ONÖDIG?? vi har inget ställe där endast en item displayas?
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


// /users/:userId/lists/:listId/items/:itemId
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

    await saveDB(listDB);

    return new Response(JSON.stringify({ message: "Item updated successfully" }), {
        status: 200,
        headers: { ...responseHeaders }
    });
}


// (DELETE) - radera ett item
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
            status: 409,
            headers: { ...responseHeaders }
        });
    }

    foundList.listItems.splice(itemIndex, 1);

    await saveDB(listDB);

    return new Response(JSON.stringify({ message: "Item deleted successfully" }), {
        status: 200,
        headers: { ...responseHeaders }
    });
}