// testList.js
const baseUrl = "http://localhost:3000";
const reqLog = document.getElementById("reqLog");

function logTest({ title, method, status, message }) {

  const statusClass = status >= 200 && status < 300 ? "success" : "fail";
  const newRow = document.createElement("div");
  newRow.className = "row";

  newRow.innerHTML = `
     <div>${title}</div>
     <div>${method}</div>
     <div><span class="status ${statusClass}">${status}</span></div>
     <div>${msg}</div>
   `;

  reqLog.appendChild(newRow);
  console.log(`testList2.js: --- [${method}] ${title} -> Status: ${status}`, message);
}

// POST /lists/:userId (201)
async function testCreateListSuccess() {

  const response = await fetch(`${baseUrl}/lists/1`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ listName: "Barcelona", purpose: 1 })
  });
  
  const body = await response.json();

  logTest({
    title: "Create List (Success)",
    method: "POST",
    status: response.status,
    message: body
  });
}

// POST /lists/:userId (404)
async function testCreateListTemplateNotFound() {

  const response = await fetch(`${baseUrl}/lists/1`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ listName: "Barcelona", purpose: 99 })
  });
  const body = await response.json();

  logTest({
    title: "Create List (Template Not Found)",
    method: "POST",
    status: response.status,
    message: body
  });

}

// GET /lists/:userId (200)
async function testGetAllLists() {

  const response = await fetch(`${baseUrl}/lists/1`);
  const body = await response.json();

  logTest({
    title: "Get All Lists",
    method: "GET",
    status: response.status,
    message: body
  });

}

// GET /lists/:userId/:listId (200)
async function testGetListFound() {

  const response = await fetch(`${baseUrl}/lists/1/1`);
  const body = await response.json();

  logTest({
    title: "Get List",
    method: "GET",
    status: response.status,
    message: body
  });
}

// GET /lists/:userId/:listId (404)
async function testGetListNotFound() {
  const response = await fetch(`${baseUrl}/lists/1/999`);
  const body = await response.json();

  logTest({
    title: "Get List (Not Found)",
    method: "GET",
    status: response.status,
    message: body
  });

}

// DELETE /lists/:userId/:listId (200)
async function testDeleteListSuccess() {

  const response = await fetch(`${baseUrl}/lists/1/1`, { method: "DELETE" });
  const body = await response.json();

  logTest({
    title: "Delete List",
    method: "DELETE",
    status: response.status,
    message: body
  });

}

// DELETE /lists/:userId/:listId (404)
async function testDeleteListNotFound() {

  const response = await fetch(`${baseUrl}/lists/1/999`, { method: "DELETE" });
  const body = await response.json();

  logTest({
    title: "Delete List (Not Found)",
    method: "DELETE",
    status: response.status,
    message: body
  });

}

// POST /lists/:userId/:listId/items (201)
async function testAddItemSuccess() {

  const response = await fetch(`${baseUrl}/lists/1/1/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemName: "Socks", itemQuantity: 3 })
  });
  const body = await response.json();

  logTest({
    title: "Add Item",
    method: "POST",
    status: response.status,
    message: body
  });

}

// POST /lists/:userId/:listId/items (404)
async function testAddItemListNotFound() {

  const response = await fetch(`${baseUrl}/lists/1/999/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemName: "Socks", itemQuantity: 3 })
  });
  const body = await response.json();

  logTest({
    title: "Add Item (List Not Found)",
    method: "POST",
    status: response.status,
    message: body
  });

}

// POST /lists/:userId/:listId/items (409)
async function testAddItemAlreadyExists() {

  const response = await fetch(`${baseUrl}/lists/1/1/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemName: "Socks", itemQuantity: 3 })
  });
  const body = await response.json();

  logTest({
    title: "Add Item (Already Exists)",
    method: "POST",
    status: response.status,
    message: body
  });

}

// GET /lists/:userId/:listId/items (200)
async function testGetAllItemsSuccess() {

  const response = await fetch(`${baseUrl}/lists/1/1/items`);
  const body = await response.json();

  logTest({
    title: "Get All Items",
    method: "GET",
    status: response.status,
    message: body
  });

}

// GET /lists/:userId/:listId/items (404)
async function testGetAllItemsNotFound() {

  const response = await fetch(`${baseUrl}/lists/1/999/items`);
  const body = await response.json();

  logTest({
    title: "Get All Items (List Not Found)",
    method: "GET",
    status: response.status,
    message: body
  });

}

// PUT /lists/:userId/:listId/items/:itemId (200)
async function testUpdateItemSuccess() {

  const response = await fetch(`${baseUrl}/lists/1/1/items/1`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemQuantity: 5 })
  });
  const body = await response.json();

  logTest({
    title: "Update Item",
    method: "PUT",
    status: response.status,
    message: body
  });

}

// PUT /lists/:userId/:listId/items/:itemId (404)
async function testUpdateItemListNotFound() {

  const response = await fetch(`${baseUrl}/lists/1/999/items/1`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemQuantity: 5 })
  });
  const body = await response.json();

  logTest({
    title: "Update Item (List Not Found)",
    method: "PUT",
    status: response.status,
    message: body
  });

}

// PUT /lists/:userId/:listId/items/:itemId (409)
async function testUpdateItemNotFound() {

  const response = await fetch(`${baseUrl}/lists/1/1/items/999`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemQuantity: 5 })
  });
  const body = await response.json();

  logTest({
    title: "Update Item (Item Not Found)",
    method: "PUT",
    status: response.status,
    message: body
  });

}

// DELETE /lists/:userId/:listId/items/:itemId (200)
async function testDeleteItemSuccess() {

  const response = await fetch(`${baseUrl}/lists/1/1/items/1`, { method: "DELETE" });
  const body = await response.json();

  logTest({
    title: "Delete Item",
    method: "DELETE",
    status: response.status,
    message: body
  });

}

// DELETE /lists/:userId/:listId/items/:itemId (404)
async function testDeleteItemListNotFound() {

  const response = await fetch(`${baseUrl}/lists/1/999/items/1`, { method: "DELETE" });
  const body = await response.json();

  logTest({
    title: "Delete Item (List Not Found)",
    method: "DELETE",
    status: response.status,
    message: body
  });

}

// DELETE /lists/:userId/:listId/items/:itemId (409)
async function testDeleteItemNotFound() {

  const response = await fetch(`${baseUrl}/lists/1/1/items/999`, { method: "DELETE" });
  const body = await response.json();

  logTest({
    title: "Delete Item (Item Not Found)",
    method: "DELETE",
    status: response.status,
    message: body
  });

}

// Run all tests
async function runTests() {
  await testCreateListSuccess();
  await testCreateListTemplateNotFound();
  await testGetAllLists();
  await testGetListFound();
  await testGetListNotFound();
  await testDeleteListSuccess();
  await testDeleteListNotFound();
  await testAddItemSuccess();
  await testAddItemListNotFound();
  await testAddItemAlreadyExists();
  await testGetAllItemsSuccess();
  await testGetAllItemsNotFound();
  await testUpdateItemSuccess();
  await testUpdateItemListNotFound();
  await testUpdateItemNotFound();
  await testDeleteItemSuccess();
  await testDeleteItemListNotFound();
  await testDeleteItemNotFound();
}

runTests();