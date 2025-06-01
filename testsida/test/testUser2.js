
/* testUser2.js */

import { runTestsList } from "./testList2.js";

const baseUrl = "http://localhost:8000";
const reqLog = document.getElementById("reqLog");
const runTestBtn = document.querySelector(".run-tests-btn");




const testUser = {
    name: "allee12",
    password: "yaya",
    pfp: "https://example.com/alle.jpg"
};



function getCookie(name) { //hittar rätt cookie
    return document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith(name + "="))
        ?.split('=')[1] || null;
}


async function runTestsUser() {

    let newUserId = null;

    // === LOG UTDATA TILL DOM/CONSOLE ===
    function logTest({ title, method, status, message }, matchedExpectations) {

        const mainMessage = message[Object.keys(message)[0]];
        const statusClass = status >= 200 && status < 300 ? "success" : "fail";

        const newRow = document.createElement("div");
        if (matchedExpectations) {
            newRow.className = "row userRow expStatus";
        } else {
            newRow.className = "row userRow notExpStatus";
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

 // === POST /users === (201 Created)
async function testCreateUserSuccess() {
    const expectedStatus = 201;
    let matchedExpectations = false;

    const response = await fetch(`${baseUrl}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testUser)
    });

    const body = await response.json();
    newUserId = body.id;

    if (response.status === expectedStatus) {
        matchedExpectations = true;
    }

    logTest({
        title: "Create User (Success)",
        method: "POST",
        status: response.status,
        message: body
    }, matchedExpectations);
}

// === POST /users/login === (200 OK)
async function testLoginUserSuccess() {
    const expectedStatus = 200;
    let matchedExpectations = false;

    const response = await fetch(`${baseUrl}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            name: testUser.name,
            password: testUser.password
        })
    });

    const body = await response.json();

    if (response.status === expectedStatus) {
        matchedExpectations = true;
    }

    logTest({
        title: "Login User (Success)",
        method: "POST",
        status: response.status,
        message: body
    }, matchedExpectations);
}

// === POST /users/logout === (200 OK)
async function testLogoutUserSuccess() {
    const expectedStatus = 200;
    let matchedExpectations = false;

    const response = await fetch(`${baseUrl}/users/logout`, {
        method: "POST",
        body: JSON.stringify({}),
        credentials: "include"
    });

    const body = await response.json();

    if (response.status === expectedStatus) {
        matchedExpectations = true;
    }

    logTest({
        title: "Logout User (Success)",
        method: "POST",
        status: response.status,
        message: body
    }, matchedExpectations);
}

// === DELETE /users/:id === (200 OK – om session_id matchar)
async function testDeleteUserSuccess() {
    const expectedStatus = 200;
    let matchedExpectations = false;

    const response = await fetch(`${baseUrl}/users/${getCookie("session_id")}`, {
        method: "DELETE",
        body: JSON.stringify({}),
        credentials: "include"
    });

    const body = await response.json();

    if (response.status === expectedStatus) {
        matchedExpectations = true;
    }

    logTest({
        title: "Delete User (Success)",
        method: "DELETE",
        status: response.status,
        message: body
    }, matchedExpectations);
}

// === POST /users (duplicate user) === (409 Conflict)
async function testCreateDuplicateUser() {
    const expectedStatus = 409;
    let matchedExpectations = false;

    const response = await fetch(`${baseUrl}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testUser)
    });

    const body = await response.json();

    if (response.status === expectedStatus) {
        matchedExpectations = true;
    }

    logTest({
        title: "Create Duplicate User (Conflict)",
        method: "POST",
        status: response.status,
        message: body
    }, matchedExpectations);
}

// === POST /users (missing fields) === (400 Bad Request)
async function testCreateUserMissingFields() {
    const expectedStatus = 400;
    let matchedExpectations = false;

    const response = await fetch(`${baseUrl}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "namnlös" }) // saknar lösenord och pfp
    });

    const body = await response.json();

    if (response.status === expectedStatus) {
        matchedExpectations = true;
    }

    logTest({
        title: "Create User (Missing Fields)",
        method: "POST",
        status: response.status,
        message: body
    }, matchedExpectations);
}

// === POST /users/login (wrong password) === (401 Unauthorized)
async function testLoginWrongPassword() {
    const expectedStatus = 401;
    let matchedExpectations = false;

    const response = await fetch(`${baseUrl}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: testUser.name,
            password: "fel_losen"
        })
    });

    const body = await response.json();

    if (response.status === expectedStatus) {
        matchedExpectations = true;
    }

    logTest({
        title: "Login Wrong Password",
        method: "POST",
        status: response.status,
        message: body
    }, matchedExpectations);
}

// === POST /users/login (missing fields) === (400 Bad Request)
async function testLoginMissingFields() {
    const expectedStatus = 400;
    let matchedExpectations = false;

    const response = await fetch(`${baseUrl}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: testUser.name }) // saknar password
    });

    const body = await response.json();

    if (response.status === expectedStatus) {
        matchedExpectations = true;
    }

    logTest({
        title: "Login Missing Fields",
        method: "POST",
        status: response.status,
        message: body
    }, matchedExpectations);
}

// === DELETE /users/999999 (nonexistent) === (403 Not Found)
async function testDeleteNonexistentUser() {
    const expectedStatus = 403;
    let matchedExpectations = false;

    const response = await fetch(`${baseUrl}/users/999999`, {
        method: "DELETE",
        body: JSON.stringify({}),
        headers: { "Content-Type": "application/json" }
    });

    const body = await response.json();

    if (response.status === expectedStatus) {
        matchedExpectations = true;
    }

    logTest({
        title: "Delete (Not Authorized)",
        method: "DELETE",
        status: response.status,
        message: body
    }, matchedExpectations);
}


    // === Kör alla tester ===
    async function runTests() {

        await testCreateUserSuccess();          // 201
        await testCreateDuplicateUser();        // 409
        await testCreateUserMissingFields();    // 400
        await testLoginUserSuccess();           // 200
        await testLoginWrongPassword();         // 401
        await testLoginMissingFields();         // 400
        await testLogoutUserSuccess();          // 200
        await testLoginUserSuccess();           // 200 
        await testDeleteUserSuccess();          // 200
        await testDeleteNonexistentUser();      // 404
    }

    await runTests();

    runTestsList();
}


runTestBtn.addEventListener("click", runTestsUser);