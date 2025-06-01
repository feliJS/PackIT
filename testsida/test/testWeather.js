import { runTestsUnsplash } from "./testUnsplash.js";

export async function runTestsWeather() {

    const baseUrl = "http://localhost:8000";
    const reqLog = document.getElementById("reqLog");

    function logTest({ title, method, status, message }, matchedExpectations) {

        let mainMessage = null;

        if (typeof message === "object") {

            mainMessage = message[Object.keys(message)[0]];

            if (mainMessage.query) {
                mainMessage = `{query: ${mainMessage.query} }, ... `;
            }

        } else {
            mainMessage = message;
        }

        const statusClass = status >= 200 && status < 300 ? "success" : "fail";

        const newRow = document.createElement("div");
        if (matchedExpectations) {
            newRow.className = "row weatherRow expStatus";
        } else {
            newRow.className = "row weatherRow notExpStatus";
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

    // === POST /weather (Success) ===
    async function testWeatherSuccess() {
        const expectedStatus = 200;
        let matchedExpectations = false;

        const response = await fetch(`${baseUrl}/weather`, {
            method: "POST",
            body: JSON.stringify({ city: "stockholm" })
        });

        const body = await response.json();

        if (response.status === expectedStatus) {
            matchedExpectations = true;
        }

        logTest({
            title: "Weather (Success)",
            method: "POST",
            status: response.status,
            message: body
        }, matchedExpectations);
    }

    // === POST /weather (Missing City) ===
    async function testWeatherMissingCity() {
        const expectedStatus = 400;
        let matchedExpectations = false;

        const response = await fetch(`${baseUrl}/weather`, {
            method: "POST",
            body: JSON.stringify({})
        });

        const body = await response.json();

        if (response.status === expectedStatus) {
            matchedExpectations = true;
        }

        logTest({
            title: "Weather (Missing City)",
            method: "POST",
            status: response.status,
            message: body
        }, matchedExpectations);
    }

    // === POST /weather (API Failure Simulated) ===
    async function testWeatherApiFailure() {
        const expectedStatus = 502;
        let matchedExpectations = false;

        const response = await fetch(`${baseUrl}/weather`, {
            method: "POST",
            body: JSON.stringify({ city: "wrongcity123456" }) 
        });

        const body = await response.json();

        if (response.status === expectedStatus) {
            matchedExpectations = true;
        }

        logTest({
            title: "Weather (API Error)",
            method: "POST",
            status: response.status,
            message: body
        }, matchedExpectations);
    }

    // === Kör alla tester ===
    async function runTests() {

        await testWeatherSuccess();         // 200
        await testWeatherMissingCity();     // 400
        await testWeatherApiFailure();      // 502

    }

    await runTests();

    await runTestsUnsplash();
}



