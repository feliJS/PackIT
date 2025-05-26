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


// POST (201) --> /users/:userId/lists    ------- UPD I API template = purpose (1-3) + listName = CITY?
async function testCreateList () {
    const options = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            listName: "Taghazout",
            purpose: 2
        })
    }

    const response = await fetch(`${baseUrl}/users/10/lists`, options);
    const resource = await response.json();

    logTest({
        rubrik: "Create List",
        metod: "POST",
        status: response.status,
        message: resource
    })

    console.log("testCreateList:", resource);
    
}

testCreateList();


// GET (200) --> /users/:userId/lists
async function testGetAllLists () {
    const response = await fetch(`${baseUrl}/users/1/lists`);
    const resource = await response.json();

    logTest({
        rubrik: "Get All Lists",
        metod: "GET",
        status: response.status,
        message: resource
    })

    console.log("testGetAllLists:", resource);
}

testGetAllLists();


// GET (200) --> /users/:userId/lists/:listId 
async function testGetListFound () {
    const response = await fetch(`${baseUrl}/users/1/lists/1`);
    const resource = await response.json();

    logTest({
        rubrik: "Get List",
        metod: "GET",
        status: response.status,
        message: resource
    })

    console.log("testGetListFound:", resource);
}

testGetListFound();


// GET (404) --> /users/:userId/lists/:listId
async function testGetListNotFound () {
    const response = await fetch(`${baseUrl}/users/400/lists/0`)
    const resource = await response.json();

    logTest({
        rubrik: "List Not Found",
        metod: "GET",
        status: response.status,
        message: resource.error
    })

    console.log("testGetListNotFound:", response.status);
    
}

testGetListNotFound();


// DELETE (200) --> /users/:userId/lists/:listId 
async function testDeleteListOK() {
    const options = {
        method: "DELETE",
        headers: {"Content-Type": "application/json"}
    }

    const response = await fetch(`${baseUrl}/users/1/lists/1`, options);
    const resource = await response.json();

    logTest({
        rubrik: "Delete List",
        metod: "DELETE",
        status: response.status,
        message: resource.message
    })

    console.log("testDeleteList:", resource);
    
}

testDeleteListOK();


// DELETE (404) --> /users/:userId/lists/:listId
async function testDeleteListError() {
    const options = {
        method: "DELETE",
        headers: {"Content-Type": "application/json"}
    }

    const response = await fetch(`${baseUrl}/users/400/1`, options);
    const resource = await response.json();

    logTest({
        rubrik: "List Not Found",
        metod: "DELETE",
        status: response.status,
        message: resource.error
    })

    console.log("testDeleteListError:", response.status);
}

testDeleteListError();



/*
// POST (201) --> /users/:userId/:listId/item
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

// ska vara med?
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


// POST (404) --> /users/:userId/:listId/item
async function testPostItemListIdNotFound () {
    const options = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            itemName: "test item", 
            itemQuantity: 1
        })
    }

    const response = await fetch(`${baseUrl}/users/1/0/item`, options);
    const resource = await response.json();

    logTest({
        rubrik: "ListId Not Found",
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


// GET (200) --> /users/:userId/:listId/:itemId
async function testGetAllItems () {
    const response = await fetch(`${baseUrl}/users/1/1/itemId`);
    const resource = await response.json();


}

// GET (404) --> /users/:userId/:listId/:itemId

*/

/*
logTest({
        rubrik:
        metod:
        status:
        message:
    })
*/