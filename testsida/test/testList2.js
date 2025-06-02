

import { runTestsWeather } from "./testWeather.js";


export async function runTestsList() {

  const baseUrl = "http://localhost:8000";
  const reqLog = document.getElementById("reqLog");

  function logTest({ title, method, status, message }, matchedExpectations) {

    let mainMessage = null;
    if (typeof message === "object") {

      mainMessage = message[Object.keys(message)[0]];
      if (mainMessage.itemName) {

        mainMessage = `{itemName: ${mainMessage.itemName} }, ... `;
      }
    } else {
      mainMessage = message;
    }

    const statusClass = status >= 200 && status < 300 ? "success" : "fail";

    const newRow = document.createElement("div");
    if (matchedExpectations) {
      newRow.className = "row listRow expStatus";
    } else {
      newRow.className = "row listRow notExpStatus";
    }

    newRow.innerHTML = `
     <div class="rowDiv">${title}</div>
     <div class="rowDiv">${method}</div>
     <div class="rowDiv"><span class="status ${statusClass}">${status}</span></div>
     <div class="rowDiv">${mainMessage}</div>
   `;

    reqLog.appendChild(newRow);
  }


  /* --------------------- TESTS --------------------- */

  // POST (201) /lists/:userId
  async function testCreateList() {
    const expectedStatus = 201;
    let matchedExpectations = false;

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listName: "Taghazout",
        purpose: 2
      })
    }

    const response = await fetch(`${baseUrl}/lists/10`, options);
    const resource = await response.json();

    if (response.status === expectedStatus) {
      matchedExpectations = true;
    }

    logTest({
      title: "Create List",
      method: "POST",
      status: response.status,
      message: resource
    }, matchedExpectations)

  }

  // POST /lists/:userId (404)
  async function testCreateListTemplateNotFound() {
    const expectedStatus = 404;
    let matchedExpectations = false;

    const response = await fetch(`${baseUrl}/lists/1`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listName: "Barcelona", purpose: 99 })
    });

    const body = await response.json();

    if (response.status === expectedStatus) {
      matchedExpectations = true;
    }

    logTest({
      title: "Create List (Purpose Not Found)",
      method: "POST",
      status: response.status,
      message: body
    }, matchedExpectations);
  }


  // GET /lists/:userId (200)
  async function testGetAllLists() {
    const expectedStatus = 200;
    let matchedExpectations = false;

    const response = await fetch(`${baseUrl}/lists/1`);
    const body = await response.json();
    const body2 = body[Object.keys(body)[0]];

    if (response.status === expectedStatus) {
      matchedExpectations = true;
    }

    logTest({
      title: "Get List",
      method: "GET",
      status: response.status,
      message: body2
    }, matchedExpectations);
  }


  // GET /lists/:userId/:listId (200)
  async function testGetListFound() {
    const expectedStatus = 200;
    let matchedExpectations = false;

    const response = await fetch(`${baseUrl}/lists/1/1`);
    const body = await response.json();

    if (response.status === expectedStatus) {
      matchedExpectations = true;
    }

    logTest({
      title: "Get List (Found)",
      method: "GET",
      status: response.status,
      message: body
    }, matchedExpectations);
  }


  // GET /lists/:userId/:listId (404)
  async function testGetListNotFound() {
    const expectedStatus = 404;
    let matchedExpectations = false;

    const response = await fetch(`${baseUrl}/lists/1/999`);
    const body = await response.json();

    if (response.status === expectedStatus) {
      matchedExpectations = true;
    }

    logTest({
      title: "Get List (Not Found)",
      method: "GET",
      status: response.status,
      message: body
    }, matchedExpectations);
  }


  // DELETE /lists/:userId/:listId (200)
  async function testDeleteListSuccess() {
    const expectedStatus = 200;
    let matchedExpectations = false;

    const response = await fetch(`${baseUrl}/lists/1/1`, { method: "DELETE" });
    const body = await response.json();

    if (response.status === expectedStatus) {
      matchedExpectations = true;
    }

    logTest({
      title: "Delete List",
      method: "DELETE",
      status: response.status,
      message: body
    }, matchedExpectations);
  }


  // DELETE /lists/:userId/:listId (404)
  async function testDeleteListNotFound() {
    const expectedStatus = 404;
    let matchedExpectations = false;

    const response = await fetch(`${baseUrl}/lists/1/999`, { method: "DELETE" });
    const body = await response.json();

    if (response.status === expectedStatus) {
      matchedExpectations = true;
    }

    logTest({
      title: "Delete List (Not Found)",
      method: "DELETE",
      status: response.status,
      message: body
    }, matchedExpectations);
  }


  // POST /lists/:userId/:listId/items (201)
  async function testAddItemSuccess() {
    const expectedStatus = 201;
    let matchedExpectations = false;

    const response = await fetch(`${baseUrl}/lists/1/1/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemName: "Banana", itemQuantity: 3 })
    });
    const body = await response.json();

    if (response.status === expectedStatus) {
      matchedExpectations = true;
    }

    logTest({
      title: "Add Item",
      method: "POST",
      status: response.status,
      message: body
    }, matchedExpectations);
  }


  // POST /lists/:userId/:listId/items (404)
  async function testAddItemListNotFound() {
    const expectedStatus = 404;
    let matchedExpectations = false;

    const response = await fetch(`${baseUrl}/lists/1/999/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemName: "Socks", itemQuantity: 3 })
    });
    const body = await response.json();

    if (response.status === expectedStatus) {
      matchedExpectations = true;
    }

    logTest({
      title: "Add Item (List Not Found)",
      method: "POST",
      status: response.status,
      message: body
    }, matchedExpectations);
  }


  // POST /lists/:userId/:listId/items (409)
  async function testAddItemAlreadyExists() {
    const expectedStatus = 409;
    let matchedExpectations = false;

    const response = await fetch(`${baseUrl}/lists/1/1/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemName: "Socks", itemQuantity: 3 })
    });
    const body = await response.json();

    if (response.status === expectedStatus) {
      matchedExpectations = true;
    }

    logTest({
      title: "Add Item (Already Exists)",
      method: "POST",
      status: response.status,
      message: body
    }, matchedExpectations);
  }


  // GET /lists/:userId/:listId/items (200)
  async function testGetAllItemsSuccess() {
    const expectedStatus = 200;
    let matchedExpectations = false;

    const response = await fetch(`${baseUrl}/lists/1/1/items`);
    const body = await response.json();

    if (response.status === expectedStatus) {
      matchedExpectations = true;
    }

    logTest({
      title: "Get All Items",
      method: "GET",
      status: response.status,
      message: body
    }, matchedExpectations);
  }


  // GET /lists/:userId/:listId/items (404)
  async function testGetAllItemsNotFound() {
    const expectedStatus = 404;
    let matchedExpectations = false;

    const response = await fetch(`${baseUrl}/lists/1/999/items`);
    const body = await response.json();

    if (response.status === expectedStatus) {
      matchedExpectations = true;
    }

    logTest({
      title: "Get All Items (List Not Found)",
      method: "GET",
      status: response.status,
      message: body
    }, matchedExpectations);
  }


  // PUT /lists/:userId/:listId/items/:itemId (200)
  async function testUpdateItemSuccess() {
    const expectedStatus = 200;
    let matchedExpectations = false;

    const response = await fetch(`${baseUrl}/lists/1/1/items/1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemQuantity: 5 })
    });
    const body = await response.json();

    if (response.status === expectedStatus) {
      matchedExpectations = true;
    }

    logTest({
      title: "Update Item",
      method: "PUT",
      status: response.status,
      message: body
    }, matchedExpectations);
  }


  // PUT /lists/:userId/:listId/items/:itemId (404)
  async function testUpdateItemListNotFound() {
    const expectedStatus = 404;
    let matchedExpectations = false;

    const response = await fetch(`${baseUrl}/lists/1/999/items/1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemQuantity: 5 })
    });
    const body = await response.json();

    if (response.status === expectedStatus) {
      matchedExpectations = true;
    }

    logTest({
      title: "Update Item (List Not Found)",
      method: "PUT",
      status: response.status,
      message: body
    }, matchedExpectations);
  }


  // PUT /lists/:userId/:listId/items/:itemId (409)
  async function testUpdateItemNotFound() {
    const expectedStatus = 409;
    let matchedExpectations = false;

    const response = await fetch(`${baseUrl}/lists/1/1/items/999`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemQuantity: 5 })
    });
    const body = await response.json();

    if (response.status === expectedStatus) {
      matchedExpectations = true;
    }

    logTest({
      title: "Update Item (Item Not Found)",
      method: "PUT",
      status: response.status,
      message: body
    }, matchedExpectations);
  }


  // DELETE /lists/:userId/:listId/items/:itemId (200)
  async function testDeleteItemSuccess() {
    const expectedStatus = 200;
    let matchedExpectations = false;

    const response = await fetch(`${baseUrl}/lists/1/1/items/1`, { method: "DELETE" });
    const body = await response.json();

    if (response.status === expectedStatus) {
      matchedExpectations = true;
    }

    logTest({
      title: "Delete Item",
      method: "DELETE",
      status: response.status,
      message: body
    }, matchedExpectations);
  }


  // DELETE /lists/:userId/:listId/items/:itemId (404)
  async function testDeleteItemListNotFound() {
    const expectedStatus = 404;
    let matchedExpectations = false;

    const response = await fetch(`${baseUrl}/lists/1/999/items/1`, { method: "DELETE" });
    const body = await response.json();

    if (response.status === expectedStatus) {
      matchedExpectations = true;
    }

    logTest({
      title: "Delete Item (List Not Found)",
      method: "DELETE",
      status: response.status,
      message: body
    }, matchedExpectations);
  }


  // DELETE /lists/:userId/:listId/items/:itemId (409)
  async function testDeleteItemNotFound() {
    const expectedStatus = 409;
    let matchedExpectations = false;

    const response = await fetch(`${baseUrl}/lists/1/1/items/999`, { method: "DELETE" });
    const body = await response.json();

    if (response.status === expectedStatus) {
      matchedExpectations = true;
    }

    logTest({
      title: "Delete Item (Item Not Found)",
      method: "DELETE",
      status: response.status,
      message: body
    }, matchedExpectations);
  }


  /* Run all tests */
  async function runTests() {

    await testCreateList();
    await testGetAllLists();
    await testGetListFound();
    await testGetListNotFound();
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
    await testDeleteListSuccess();
    await testDeleteListNotFound();

  }

  await runTests();

  // Använder API KEYS för weather och unsplash nedan
  runTestsWeather();

}