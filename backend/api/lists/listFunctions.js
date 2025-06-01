
/* listFunctions.js */

const DB_PATH = "../databaser/lists.json";

function saveDB(listDB) {
    return Deno.writeTextFile(DB_PATH, JSON.stringify(listDB));
}

function createBasicList(urlUserId, listDB) {
    const defaultBasic = listDB.find(l =>
        l.userId === 0 &&
        l.listName.toLowerCase() === "basic list"
    );

    if (!defaultBasic) {
        throw new Error("Default basic list not found");
    }

    const basicListId = Math.max(...listDB.map(l => l.listId)) + 1;

    const newBasicList = {
        userId: Number(urlUserId),
        listId: basicListId,
        listName: "Basic List",
        listItems: JSON.parse(JSON.stringify(defaultBasic.listItems)) // djup kopia
    };

    listDB.push(newBasicList);
    return newBasicList;
}
// /users/:userId/lists
// (POST) - skapa en ny lista efter alla steg användaren klickat sig genom
export async function createListFunc(urlUserId, reqBody, listDB, responseHeaders) {

    const { listName, purpose, cover, vehicle } = reqBody;  // listName = stad som user valt, purpose = typ av resa user har valt (måstre hämta ut i req som inputs..)

    if (!listName && !purpose && !cover && !vehicle) {
        let userBasicList = listDB.find(l =>
            l.userId === Number(urlUserId) &&
            l.listName.toLowerCase() === "basic list"
        );

        if (!userBasicList) {
            userBasicList = createBasicList(urlUserId, listDB);
            await saveDB(listDB); // <-- Spara när vi skapat en ny lista
        }

        return new Response(JSON.stringify({ message: "Basic list created", list: userBasicList }), {
            status: 201,
            headers: { ...responseHeaders }
        });
    }

    // Mappa purpose-id till rätt listnamn
    const purposeMap = {
        1: "Suntrip List",
        2: "Business List",
        3: "Wellness/activities List"
    };

    const mappedPurposeName = purposeMap[purpose];


    function getRecommendedBag(vehicle) {
        switch (vehicle) {
            case 1: return "Backpack";
            case 2: return "Cabin Bag";
            case 3: return "Sportbag";
            default: return "Cabin Bag";
        }
    }
    const recommendedBag = getRecommendedBag(Number(vehicle));

    // Kolla om användaren redan har en Basic List
    let userBasicList = listDB.find(l =>
        l.userId === Number(urlUserId) &&
        l.listName.toLowerCase() === "basic list"
    );

    // Om inte – skapa en kopia av defaulten
    if (!userBasicList) {
        userBasicList = createBasicList(urlUserId, listDB);
    }


    // Hämta rätt template-lista baserat på purpose
    const typeTemplate = listDB.find(l =>
        l.userId === 0 &&
        l.listName.toLowerCase() === mappedPurposeName.toLowerCase()
    );

    if (!typeTemplate) {
        return new Response(JSON.stringify({ error: "Purpose template not found" }), {
            status: 404,
            headers: { ...responseHeaders }
        });
    }


    // Skapa ny list-objekt
    const newListId = Math.max(...listDB.map(l => l.listId)) + 1;

    const newList = {
        userId: Number(urlUserId),
        listId: newListId,
        listName: listName, // <-- stadens namn
        listItems: [...userBasicList.listItems, ...typeTemplate.listItems],
        cover: cover,
        bag: recommendedBag
    };
    console.log(newList);

    listDB.push(newList);
    await saveDB(listDB);

    return new Response(JSON.stringify({ message: "List created", list: newList }), {
        status: 201,
        headers: { ...responseHeaders }
    });
}


// (GET) - hämta alla listor för en userId (behövs till profilsidan för att displaya alla listor)
export async function getAllListsFunc(urlUserId, listDB, responseHeaders) {
    console.log("I getAllListsFunc")
    const userLists = listDB.filter(list => list.userId == urlUserId);

    return new Response(JSON.stringify(userLists), {
        status: 200,
        headers: { ...responseHeaders }
    });
}

2
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
        itemType: reqBody.itemType,
        itemName: reqBody.itemName,
        itemQuantity: reqBody.itemQuantity
    };

    foundList.listItems.push(newItem);

    await saveDB(listDB);

    return new Response(JSON.stringify({ message: "Item added successfully", item: newItem }), {
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