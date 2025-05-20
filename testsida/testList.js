const baseUrl = "http://localhost:8000";
const reqLog = document.getElementById("reqLog");

function logTest ({ rubrik, metod, status, meddelande}) {
    const row = document.createElement("div");
    row.className = "row";

    const statusClass = status >= 200 && status < 300 ? "success" : "fail";

    row.innerHTML = `
        <div>${rubrik}</div>
        <div>${metod}</div>
        <div><span class="status ${statusClass}">${status}</span></div>
        <div>${message}</div>
    `;

    reqLog.appendChild(row);
}


// GET (200) --> /users/:userId/:listId 
async function testGetListFound () {
    const response = await fetch(`${baseUrl}/users/1/1`);
    const resource = await response.json();

    logTest({
        rubrik: "Get List",
        metod: "GET",
        status: response.status,
        message: resource.listId
    })
}

// GET (404) --> /users/:userId/:listId
async function testGetListNotFound () {
    const response = await fetch(`${baseUrl}/users/0/0`)
    const resource = await response.json();

    logTest({
        rubrik: "List Not Found",
        metod: "GET",
        status: response.status,
        message: resource.error
    })
}

// DELETE (200) --> /users/:userId/:listId 
async function testDeleteList() {
    const options = {
        method: "DELETE",
        headers: {"Content-Type": "application/json"}
    }

    const response = await fetch(`${baseUrl}/users/1/1`, options);
    const resource = await response.json();

    logTest({
        rubrik: "Delete List",
        metod: "DELETE",
        status: response.status,
        message: resource.message
    })
}

// DELETE (404) --> /users/:userId/:listId
async function testDeleteListError() {
    const options = {
        method: "DELETE",
        headers: {"Content-Type": "application/json"}
    }

    const response = await fetch(`${baseUrl}/users/0/0`, options);
    const resource = await response.json();

    logTest({
        rubrik: "List NOT Found",
        metod: "DELETE",
        status: response.status,
        message: resource.error
    })
}

// POST (200) --> /users/:userId/:listId 
// POST (400) --> /users/:userId/:listId 

// PATCH (200) --> /users/:userId/:listId 
// PATCH (404) --> /users/:userId/:listId 


// POST (200) --> /users/:userId/:listId/item
async function testPostItem () {
    const options = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            itemName: "test item", 
            itemQuantity: 1
        })
    }

    const response = await fetch(`${baseUrl}/users/1/1/item`, options);
    const resource = await response.json();

    logTest({
        rubrik: "Create New item",
        metod: "POST",
        status: response.status,
        message: resource.message
    })
}

// POST (400) --> /users/:userId/:listId/item
async function testPostItemMissingAttribute () {
    const options = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            itemName: null, 
            itemQuantity: 1
        })
    }

    const response = await fetch(`${baseUrl}/users/1/1/item`, options);
    const resource = await response.json();

    logTest({
        rubrik: "Attribute Missing",
        metod: "POST",
        status: response.status,
        message: resource.error
    })
}

// POST (409) --> /users/:userId/:listId/item
async function testPostItemAlreadyExists () {
    const options = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            itemName: "Passport / ID", 
            itemQuantity: 1
        })
    }

    const response = await fetch(`${baseUrl}/users/1/1/item`, options);
    const resource = await response.json();

    logTest({
        rubrik: "Item Already Exists",
        metod: "POST",
        status: response.status,
        message: resource.error
    })
}



/*
logTest({
        rubrik:
        metod:
        status:
        message:
    })
*/