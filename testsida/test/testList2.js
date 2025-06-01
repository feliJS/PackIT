

import { runTestsWeather } from "./testWeather.js";


export async function runTestsList() {

  const baseUrl = "http://localhost:8000";
  const reqLog = document.getElementById("reqLog");

  function logTest({ title, method, status, message }) {

    const mainMessage = message[Object.keys(message)[0]];
    const statusClass = status >= 200 && status < 300 ? "success" : "fail";

    const newRow = document.createElement("div");
    newRow.className = "row listRow";

    newRow.innerHTML = `
     <div class="rowDiv">${title}</div>
     <div class="rowDiv">${method}</div>
     <div class="rowDiv"><span class="status ${statusClass}">${status}</span></div>
     <div class="rowDiv">${mainMessage}</div>
   `;

    reqLog.appendChild(newRow);
    console.log(`testList2.js: --- [${method}] ${title} -> Status: ${status}`, message);
  }


  /* --------------------- TESTS --------------------- */

  // POST (201) --> /lists/:userId
  async function testCreateList() {
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

    logTest({
      title: "Create List",
      method: "POST",
      status: response.status,
      message: resource
    })

  }

  /*   // POST /lists/:userId (201)    //                          ??? 
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
   */


  // POST /lists/:userId (404)
  async function testCreateListTemplateNotFound() {

    const response = await fetch(`${baseUrl}/lists/1`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listName: "Barcelona", purpose: 99 })
    });

    const body = await response.json();

    logTest({
      title: "Create List (Purpose Not Found)",
      method: "POST",
      status: response.status,
      message: body
    });

  }

  // GET /lists/:userId (200)
  async function testGetAllLists() {

    const response = await fetch(`${baseUrl}/lists/1`);
    const body = await response.json();

    console.log(body, " async function testGetAllLists() ")
    const body2 = body[Object.keys(body)[0]]; /* *** */


    logTest({
      title: "Get List",
      method: "GET",
      status: response.status,
      message: body2
    });

  }

  // GET /lists/:userId/:listId (200)
  async function testGetListFound() {

    const response = await fetch(`${baseUrl}/lists/1/1`);
    const body = await response.json();

    logTest({
      title: "Get List (Found)",
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
      body: JSON.stringify({ itemName: "Banana", itemQuantity: 3 })
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

  /* Run all tests */
  async function runTests() {

    console.log("runTests() -- (testList.js) start");

    await testCreateList();
    console.log("testCreateList()")

    /*  
    await testCreateListTemplateNotFound();
    console.log("testCreateListTemplateNotFound()")
    */

    await testGetAllLists();
    console.log("testCreateUserSuccess()")

    await testGetListFound();
    console.log("testGetListFound()")

    await testGetListNotFound();
    console.log("testGetListNotFound()")

    await testAddItemSuccess();
    console.log("testAddItemSuccess()")

    await testAddItemListNotFound();
    console.log("testAddItemListNotFound()")

    await testAddItemAlreadyExists();
    console.log("testAddItemAlreadyExists()")

    await testGetAllItemsSuccess();
    console.log("testGetAllItemsSuccess()")

    await testGetAllItemsNotFound();
    console.log("testGetAllItemsNotFound()")

    await testUpdateItemSuccess();
    console.log("testUpdateItemSuccess()")

    await testUpdateItemListNotFound();
    console.log("testUpdateItemListNotFound()")

    await testUpdateItemNotFound();
    console.log("testUpdateItemNotFound()")

    await testDeleteItemSuccess();
    console.log("testDeleteItemSuccess()")

    await testDeleteItemListNotFound();
    console.log("testDeleteItemListNotFound()")

    await testDeleteItemNotFound();
    console.log("testDeleteItemNotFound()")

    await testDeleteListSuccess();
    console.log("testDeleteListSuccess()")

    await testDeleteListNotFound();
    console.log("testDeleteListNotFound()")


    console.log("runTests() -- (testList.js) done");

  }

  await runTests();
  
  runTestsWeather();

}