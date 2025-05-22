
// --- LISTS ---
import {
    UserListManager,
    loadListsFromFile,
    saveListsToFile

} from "./class.js";


const listData = await loadListsFromFile();
const manager = new UserListManager(listData);

// (GET) har ändrat
export async function getListFunc(urlUserId, urlListId, responseHeaders) {
    const userLists = manager.getListsForUser(urlUserId);
    const foundList = userLists.find(list => list.id === urlListId);

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
export async function getAllListsByUserFunc(urlUserId, responseHeaders) {
    const userLists = manager.getListsForUser(urlUserId);
    if (!userLists) {
        return new Response(JSON.stringify({ error: "No lists found" }), {
            status: 404,
            headers: { ...responseHeaders }
        })
    }
    return new Response(JSON.stringify(userLists), {
        status: 200,
        headers: { ...responseHeaders }
    })
}

// (DELETE) Har ändrat
export async function deleteListFunc(urlUserId, urlListId, responseHeaders) {
    const deletedList = manager.deleteListForUser(urlUserId, urlListId);

    if (!deletedList) {
        return new Response(JSON.stringify({ error: "List not found" }), {
            status: 404,
            headers: { ...responseHeaders }
        });
    }
    await saveListsToFile(manager.toJSON());
    return new Response(JSON.stringify({ message: "Delete OK", deletedList }), {
        status: 200,
        headers: { ...responseHeaders }
    });
}

// (POST) har ändrat
export async function createListFunc(urlUserId, reqBody, responseHeaders) {
    const { title, items } = reqBody;
    //Här vet jag inte om jag ska bygga in något typ if (!name) och if (!items)
    // name kan ju bli nåt default "NewList1" eller nåt...

    const newList = manager.createListForUser(urlUserId, items, title);
    await saveListsToFile(manager.toJSON());

    return new Response(JSON.stringify({ message: "List created", list: newList }), {
        status: 201,
        headers: { ...responseHeaders }
    });
}
// (PUT) ??
export async function renameListFunc(urlUserId, urlListId, reqBody, responseHeaders) {
    const { newTitle } = reqBody;
    if (!newTitle || typeof newTitle !== "string") {
        return new Response(JSON.stringify({ error: "Invalid title" }), {
            status: 400,
            headers: { ...responseHeaders }
        });
    }
    const result = manager.renameList(urlUserId, urlListId, newTitle);
    if (result === true) {
        await saveListsToFile(manager.toJSON());
        return new Response(JSON.stringify({ message: "List renamed" }), {
            status: 200,
            headers: { ...responseHeaders }
        });
    }

    if (result === "title-exists") {
        return new Response(JSON.stringify({ error: "Title already in use" }), {
            status: 409,
            headers: { ...responseHeaders }
        });
    }

    return new Response(JSON.stringify({ error: "List not found" }), {
        status: 404,
        headers: { ...responseHeaders }
    });
}


// --- ITEMS ---

// (POST) har ändrat
// den här funktionen kan behöva kollas igenom.
export async function addItemFunc(reqBody, urlUserId, urlListId, responseHeaders) {
    const userLists = manager.getListsForUser(urlUserId);
    const foundList = userLists.find(list => list.id === urlListId);

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

    const success = manager.addItemToList(urlUserId, urlListId, newItem);

    if (!success) {
        return new Response(JSON.stringify({ message: "List not found" }), {
            status: 404,
            headers: { ...responseHeaders }
        });
    }
    await saveListsToFile(manager.toJSON());
    return new Response(JSON.stringify({ message: "Item added successfully" }), {
        status: 201,
        headers: { ...responseHeaders }
    });
}

// (GET) Alla items i en lista
export async function getAllItemsFunc(urlUserId, urlListId, responseHeaders) {
    const userLists = manager.getListsForUser(urlUserId);
    const foundList = userLists.find(list => list.listId === urlListId);
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

// (GET) har ändrat
export async function getItemFunc(urlUserId, urlListId, urlItemId, responseHeaders) {
    const userLists = manager.getListsForUser(urlUserId);
    const foundList = userLists.find(list => list.listId === urlListId);

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
export async function deleteItemFunc(urlUserId, urlListId, urlItemId, responseHeaders) {
    const result = manager.deleteItemFromList(urlUserId, urlListId, urlItemId);
    if (result === "List not found") {
        return new Response(JSON.stringify({ error: "List not found" }), {
            status: 404,
            headers: { ...responseHeaders }
        });
    }

    if (result === "Item not found") {
        return new Response(JSON.stringify({ error: "Item not found" }), {
            status: 404,
            headers: { ...responseHeaders }
        });
    }
    if (result === true) {
        await saveListsToFile(manager.toJSON());
        return new Response(JSON.stringify({ message: "Item deleted successfully" }), {
            status: 200,
            headers: { ...responseHeaders }
        });

    }

}

// (PUT)
export async function updateItemFunc(reqBody, urlUserId, urlListId, urlItemId, responseHeaders) {
    const result = manager.updateItemInList(urlUserId, urlListId, urlItemId, reqBody);

    if (result === "List not found") {
        return new Response(JSON.stringify({ error: "List not found" }), {
            status: 404,
            headers: { ...responseHeaders }
        });
    }

    if (result === "Item not found") {
        return new Response(JSON.stringify({ error: "Item not found" }), {
            status: 409,
            headers: { ...responseHeaders }
        });
    }
    if (result === true) {
        await saveListsToFile(manager.toJSON());
        return new Response(JSON.stringify({ message: "Item updated successfully" }), {
            status: 200,
            headers: { ...responseHeaders }
        });
    }
}

