const baseUrl = "http://localhost:8000";
const reqLog = document.getElementById("reqLog");

function logTest({ title, method, status, message }) {

    const row = document.createElement("div");
    row.className = "row";

    let msg;
    if (typeof message === "object") {
        msg = JSON.stringify(message);
    } else {
        msg = message;
    }

    const statusClass = status >= 200 && status < 300 ? "success" : "fail";

    row.innerHTML = `
        <div>${title}</div>
        <div>${method}</div>
        <div><span class="status ${statusClass}">${status}</span></div>
        <div>${msg}</div>
    `;

    reqLog.appendChild(row);
}


// --- LISTS ---

// POST (201) --> /users/:userId/lists    ------- UPD I API template = purpose (1-3) + listName = CITY?
async function testCreateList() {
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            listName: "Taghazout",
            purpose: 2
        })
    }

    const response = await fetch(`${baseUrl}/users/10/lists`, options);
    const resource = await response.json();

    logTest({
        title: "Create List",
        method: "POST",
        status: response.status,
        message: resource
    })

    console.log("testCreateList:", resource);

}


// POST (404) --> /users/:userId/lists  
async function testCreateListWithInvalidParameters() {

    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            listName: "Barcelona",
            purpose: 5
        })
    };

    const response = await fetch(`${baseUrl}/users/1/lists`, options);
    const resource = await response.json();

    logTest({
        title: "Create List: Invalid Parameters",
        method: "POST",
        status: response.status,
        message: resource.error
    });

    console.log("testCreateListWithInvalidPurpose:", response.status);
}


// GET (200) --> /users/:userId/lists
async function testGetAllLists() {
    const response = await fetch(`${baseUrl}/users/1/lists`);
    const resource = await response.json();

    logTest({
        title: "Get All Lists",
        method: "GET",
        status: response.status,
        message: resource
    })

    console.log("testGetAllLists:", resource);
}


// GET (200) --> /users/:userId/lists/:listId 
async function testGetListFound() {
    const response = await fetch(`${baseUrl}/users/1/lists/1`);
    const resource = await response.json();

    logTest({
        title: "Get List",
        method: "GET",
        status: response.status,
        message: resource
    })

    console.log("testGetListFound:", resource);
}


// GET (404) --> /users/:userId/lists/:listId
async function testGetListNotFound() {
    const response = await fetch(`${baseUrl}/users/400/lists/0`)
    const resource = await response.json();

    logTest({
        title: "List Not Found",
        method: "GET",
        status: response.status,
        message: resource.error
    })

    console.log("testGetListNotFound:", response.status);

}


// DELETE (200) --> /users/:userId/lists/:listId 
async function testDeleteListOK() {
    const options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    }

    const response = await fetch(`${baseUrl}/users/1/lists/1`, options);
    const resource = await response.json();

    logTest({
        title: "Delete List",
        method: "DELETE",
        status: response.status,
        message: resource.message
    })

    console.log("testDeleteList:", resource);

}


// DELETE (404) --> /users/:userId/lists/:listId
async function testDeleteListError() {
    const options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    }

    const response = await fetch(`${baseUrl}/users/400/lists/1`, options)
    const resource = await response.json();

    logTest({
        title: "List Not Found",
        method: "DELETE",
        status: response.status,
        message: resource.error
    })

    console.log("testDeleteListError:", response.status);
}



// --- ITEMS ---

// POST (201) --> /users/:userId/lists/:listId/items
async function testPostItem() {
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            itemName: "test item",
            itemQuantity: 2
        })
    }

    const response = await fetch(`${baseUrl}/users/1/lists/2/items`, options);
    const resource = await response.json();

    logTest({
        title: "Create New item",
        method: "POST",
        status: response.status,
        message: resource.message
    })

    console.log("testPostItem:", response.status);
}


// POST (404) --> /users/:userId/lists/:listId/items
async function testPostItemListIdNotFound() {
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            itemName: "test item",
            itemQuantity: 400
        })
    }

    const response = await fetch(`${baseUrl}/users/1/lists/0/items`, options);
    const resource = await response.json();

    logTest({
        title: "ListId Not Found",
        method: "POST",
        status: response.status,
        message: resource.error
    })

    console.log("testPostItemListIdNotFound:", response.status);
}


// POST (409) --> /users/:userId/lists/:listId/items   *** tas bort?
async function testPostItemAlreadyExists() {
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            itemName: "test item",
            itemQuantity: 400
        })
    }

    const response = await fetch(`${baseUrl}/users/1/lists/2/items`, options);
    const resource = await response.json();

    logTest({
        title: "Item Already Exists",
        method: "POST",
        status: response.status,
        message: resource.error
    })

    console.log("testPostItemAlreadyExists:", response.status);
}


// GET (200) --> /users/:userId/lists/:listId/:items
async function testGetAllItemsInAList() {
    const response = await fetch(`${baseUrl}/users/1/lists/2/items`);
    const resource = await response.json();

    logTest({
        title: "Get All Items In A List",
        method: "GET",
        status: 200,
        message: resource
    })

    console.log("testGetAllItemsInAList:", response.status);
}


// GET (404) --> /users/:userId/lists/:listId/:items   
async function testGetAllItemsInAListIdNotFound() {

    const response = await fetch(`${baseUrl}/users/1/lists/9999/items`);
    const resource = await response.json();

    logTest({
        title: "List Not Found",
        method: "GET",
        status: response.status,
        message: resource.error
    })

    console.log("testGetAllItemsInAListIdNotFound:", response.status);
}


// /users/:userId/lists/:listId/:itemId

// PUT (200) --> /users/1/lists/2/items/1
async function testUpdateItemOK() {
    const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            itemName: "Updated Item",
            itemQuantity: 10
        })
    };

    const response = await fetch(`${baseUrl}/users/1/lists/2/items/1`, options);
    const resource = await response.json();

    logTest({
        title: "Update Item OK",
        method: "PUT",
        status: response.status,
        message: resource.message
    });

    console.log("testUpdateItemOK:", response.status);
}


// PUT (404) --> /users/1/lists/999/items/1
async function testUpdateItemListNotFound() {
    const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            itemName: "Updated Item",
            itemQuantity: 10
        })
    };

    const response = await fetch(`${baseUrl}/users/1/lists/999/items/1`, options);
    const resource = await response.json();

    logTest({
        title: "Update Item: List Not Found",
        method: "PUT",
        status: response.status,
        message: resource.error
    });

    console.log("testUpdateItemListNotFound:", response.status);
}


// PUT (409) --> /users/1/lists/2/items/999
async function testUpdateItemItemNotFound() {
    const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            itemName: "Updated Item",
            itemQuantity: 10
        })
    };

    const response = await fetch(`${baseUrl}/users/1/lists/2/items/999`, options);
    const resource = await response.json();

    logTest({
        title: "Update Item: Item Not Found",
        method: "PUT",
        status: response.status,
        message: resource.error
    });

    console.log("testUpdateItemItemNotFound:", response.status);
}


// DELETE (200) --> /users/1/lists/2/items/1
async function testDeleteItemOK() {
    const options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    };

    const response = await fetch(`${baseUrl}/users/1/lists/2/items/1`, options);
    const resource = await response.json();

    logTest({
        title: "Delete Item OK",
        method: "DELETE",
        status: response.status,
        message: resource.message
    });

    console.log("testDeleteItemOK:", response.status);
}


// DELETE (404) --> /users/1/lists/999/items/1
async function testDeleteItemListNotFound() {
    const options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    };

    const response = await fetch(`${baseUrl}/users/1/lists/999/items/1`, options);
    const resource = await response.json();

    logTest({
        title: "Delete Item: List Not Found",
        method: "DELETE",
        status: response.status,
        message: resource.error
    });

    console.log("testDeleteItemListNotFound:", response.status);
}


// DELETE (409) --> /users/1/lists/2/items/999
async function testDeleteItemItemNotFound() {
    const options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    };

    const response = await fetch(`${baseUrl}/users/1/lists/2/items/999`, options);
    const resource = await response.json();

    logTest({
        title: "Delete Item: Item Not Found",
        method: "DELETE",
        status: response.status,
        message: resource.error
    });

    console.log("testDeleteItemItemNotFound:", response.status);
}



async function runTests() {
    await testCreateList();
    await testCreateListWithInvalidParameters();
    await testGetAllLists();
    await testGetListFound();
    await testGetListNotFound();
    await testDeleteListOK();
    await testDeleteListError();
    await testPostItem();
    await testPostItemListIdNotFound();
    await testPostItemAlreadyExists();
    await testGetAllItemsInAList();
    await testGetAllItemsInAListIdNotFound();
    await testUpdateItemOK();
    await testUpdateItemListNotFound();
    await testUpdateItemItemNotFound();
    await testDeleteItemOK();
    await testDeleteItemListNotFound();
    await testDeleteItemItemNotFound();
}


runTests();
