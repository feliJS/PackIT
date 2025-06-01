
import { runTestsUnsplash } from "./testUnsplash.js";


export async function runTestsWeather() {

    const baseUrl = "http://localhost:8000";
    const reqLog = document.getElementById("reqLog");

    function logTest({ title, method, status, message }) {

        const mainMessage = message[Object.keys(message)[0]];
        const statusClass = status >= 200 && status < 300 ? "success" : "fail";

        const newRow = document.createElement("div");
        newRow.className = "row weatherRow";

        newRow.innerHTML = `
           <div class="rowDiv">${title}</div>
           <div class="rowDiv">${method}</div>
           <div class="rowDiv"><span class="status ${statusClass}">${status}</span></div>
           <div class="rowDiv">${mainMessage}</div>
         `;

        reqLog.appendChild(newRow);
        console.log(`testWeather.js: --- [${method}] ${title} -> Status: ${status}`, message);
    }




    /* --------------------- TESTS --------------------- */

    // === POST /weather (Success) ===
    async function testWeatherSuccess() {
        const response = await fetch(`${baseUrl}/weather`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ city: "stockholm" })
        });

        const body = await response.json();

        logTest({
            title: "Weather (Success)",
            method: "POST",
            status: response.status,
            message: body
        });
    }

    // === POST /weather (Missing City) ===
    async function testWeatherMissingCity() {
        const response = await fetch(`${baseUrl}/weather`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        });

        const body = await response.json();

        logTest({
            title: "Weather (Missing City)",
            method: "POST",
            status: response.status,
            message: body
        });
    }

    // === POST /weather (API Failure Simulated) ===
    async function testWeatherApiFailure() {
        const response = await fetch(`${baseUrl}/weather`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ city: "wrongcity123456" }) // eller något som api:n returnerar fel på
        });

        const body = await response.json();

        logTest({
            title: "Weather (API Error)",
            method: "POST",
            status: response.status,
            message: body
        });
    }

    // === POST /weather (Internal Server Error Simulated) ===
    async function testWeatherInternalError() {
        const response = await fetch(`${baseUrl}/weather`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ city: null }) // Triggar troligen 500
        });

        const body = await response.json();

        logTest({
            title: "Weather (Internal Error)",
            method: "POST",
            status: response.status,
            message: body
        });
    }

    // === Kör alla tester ===
    async function runTests() {
        console.log("runTestsWeather() start");

        await testWeatherSuccess();         // 200
        console.log("testWeatherSuccess()");

        await testWeatherMissingCity();     // 400
        console.log("testWeatherMissingCity()");

        await testWeatherApiFailure();      // 502
        console.log("testWeatherApiFailure()");

        await testWeatherInternalError();   // 500
        console.log("testWeatherInternalError()");

        console.log("runTestsWeather() done");
    }


    /*  await runTests(); */

    await runTestsUnsplash();

    console.log("DONE = runTestsWeather() ")


}




