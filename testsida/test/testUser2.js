
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

const sessionId = getCookie("session_id");



async function runTestsUser() {

    let newUserId = null;

    // === LOG UTDATA TILL DOM/CONSOLE ===
    function logTest({ title, method, status, message }) {

        const mainMessage = message[Object.keys(message)[0]];
        const statusClass = status >= 200 && status < 300 ? "success" : "fail";

        const newRow = document.createElement("div");
        newRow.className = "row userRow";

        newRow.innerHTML = `
       <div class="rowDiv">${title}</div>
       <div class="rowDiv">${method}</div>
       <div class="rowDiv"><span class="status ${statusClass}">${status}</span></div>
       <div class="rowDiv">${mainMessage}</div>
     `;

        reqLog.appendChild(newRow);
        console.log(`testUser2.js: --- [${method}] ${title} -> Status: ${status}`, message);

    }



    /* --------------------- TESTS --------------------- */

    // === POST /users ===
    async function testCreateUserSuccess() {
        const response = await fetch(`${baseUrl}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(testUser)
        });

        const body = await response.json();
        newUserId = body.id;

        logTest({
            title: "Create User (Success)",
            method: "POST",
            status: response.status,
            message: body
        });
    }

    // === POST /users/login ===
    async function testLoginUserSuccess() {
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

        logTest({
            title: "Login User (Success)",
            method: "POST",
            status: response.status,
            message: body
        });
    }

    // === POST /users/logout ===
    async function testLogoutUserSuccess() {
        const response = await fetch(`${baseUrl}/users/logout`, {
            method: "POST",
            body: JSON.stringify({}),
            credentials: "include"
        });

        const body = await response.json();

        logTest({
            title: "Logout User (Success)",
            method: "POST",
            status: response.status,
            message: body
        });
    }

    // === DELETE /users/:id ===
    async function testDeleteUserSuccess() {
        const response = await fetch(`${baseUrl}/users/${getCookie("session_id")}`, {
            method: "DELETE",
            body: JSON.stringify({}),
            credentials: "include"
        });

        const body = await response.json();

        logTest({
            title: "Delete User (Success)",
            method: "DELETE",
            status: response.status,
            message: body
        });
    }

    // === POST /users (duplicate user) ===
    async function testCreateDuplicateUser() {
        const response = await fetch(`${baseUrl}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(testUser)
        });

        const body = await response.json();

        logTest({
            title: "Create Duplicate User (Conflict)",
            method: "POST",
            status: response.status,
            message: body
        });
    }

    // === POST /users (missing fields) ===
    async function testCreateUserMissingFields() {
        const response = await fetch(`${baseUrl}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "namnlös" }) // saknar lösenord och pfp
        });

        const body = await response.json();

        logTest({
            title: "Create User (Missing Fields)",
            method: "POST",
            status: response.status,
            message: body
        });
    }

    // === POST /users/login (wrong password) ===
    async function testLoginWrongPassword() {
        const response = await fetch(`${baseUrl}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: testUser.name,
                password: "fel_losen"
            })
        });

        const body = await response.json();

        logTest({
            title: "Login Wrong Password",
            method: "POST",
            status: response.status,
            message: body
        });
    }

    // === POST /users/login (missing fields) ===
    async function testLoginMissingFields() {
        const response = await fetch(`${baseUrl}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: testUser.name }) // saknar password
        });

        const body = await response.json();

        logTest({
            title: "Login Missing Fields",
            method: "POST",
            status: response.status,
            message: body
        });
    }

    // === DELETE /users/999999 (nonexistent) ===
    async function testDeleteNonexistentUser() {
        const response = await fetch(`${baseUrl}/users/999999`, {
            method: "DELETE",
            body: JSON.stringify({}),
            headers: { "Content-Type": "application/json" }
        });

        const body = await response.json();

        logTest({
            title: "Delete (Not Authorized)",
            method: "DELETE",
            status: response.status,
            message: body
        });
    }

    // === Kör alla tester ===
    async function runTests() {
        console.log("runTests() (testUser.js) start");

        await testCreateUserSuccess();          // 201
        console.log("testCreateUserSuccess()")

        await testCreateDuplicateUser();        // 409
        console.log("testCreateDuplicateUser()")

        await testCreateUserMissingFields();    // 400
        console.log("testCreateUserMissingFields()")

        await testLoginUserSuccess();           // 200
        console.log("testCreateUserSuccess()")

        await testLoginWrongPassword();         // 401
        console.log("testLoginWrongPassword()")

        await testLoginMissingFields();         // 400
        console.log("testLoginMissingFields()")

        await testLogoutUserSuccess();          // 200
        console.log("testLogoutUserSuccess()")

        await testLoginUserSuccess();           // 200   // EJ DOM ***
        console.log("testCreateUserSuccess()")


        console.log(getCookie("session_id"))

        await testDeleteUserSuccess();          // 200
        console.log("testDeleteUserSuccess()")



        await testDeleteNonexistentUser();      // 404
        console.log("testDeleteNonexistentUser()")

        console.log("runTests() (testUser.js) done");
    }

    await runTests();

    runTestsList();
}


runTestBtn.addEventListener("click", runTestsUser);