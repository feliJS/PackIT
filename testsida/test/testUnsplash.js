export async function runTestsUnsplash() {

    const baseUrl = "http://localhost:8000";
    const reqLog = document.getElementById("reqLog");

    function logTest({ title, method, status, message }) {

        let mainMessage = null;

        if (typeof message === "object") {
            const firstKey = Object.keys(message)[0];
            mainMessage = message[firstKey];
        } else {
            mainMessage = message;
        }

        if (typeof mainMessage === "string" && mainMessage.includes("images.unsplash.com")) {
            const shortUrl = mainMessage.split("?")[0];
            mainMessage = shortUrl.slice(0, 55) + "  ...";
        }



        const statusClass = status >= 200 && status < 300 ? "success" : "fail";

        const newRow = document.createElement("div");
        newRow.className = "row unsplashRow";

        newRow.innerHTML = `
           <div class="rowDiv">${title}</div>
           <div class="rowDiv">${method}</div>
           <div class="rowDiv"><span class="status ${statusClass}">${status}</span></div>
           <div class="rowDiv">${mainMessage}</div>
         `;

        reqLog.appendChild(newRow);
        console.log(`testUnsplash.js: --- [${method}] ${title} -> Status: ${status}`, message);
    }



    /* --------------------- TESTS --------------------- */

    // === POST /image/randomimage (200) ===
    async function testImageSuccess() {
        console.log(" Inuti testImageSuccess ")
        const response = await fetch(`${baseUrl}/image/randomimage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: "animal" })
        });

        console.log(response)
        console.log(" ----------_____----")
        const body = await response.text();
        console.log(body, " ----------_____----")

        logTest({
            title: "Random Image (Success)",
            method: "POST",
            status: response.status,
            message: body
        });
    }

    // === POST /image/randomimage (missing content) ===
    async function testImageMissingContent() {
        const response = await fetch(`${baseUrl}/image/randomimage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        });

        const body = await response.json();

        logTest({
            title: "Random Image (Missing Content)",
            method: "POST",
            status: response.status,
            message: body
        });
    }

    // === POST /image/randomimage (unsuccessful fetch) ===
    async function testImageNotFound() {
        const response = await fetch(`${baseUrl}/image/randomimage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: "thiswontreturnanythingxyz" }) // Triggerar misslyckad hämtning
        });

        const body = await response.json();

        logTest({
            title: "Random Image (Fetch Failed)",
            method: "POST",
            status: response.status,
            message: body
        });
    }


    // === Kör alla tester ===
    async function runTests() {
        console.log("runTestsUnsplash() start");

        await testImageSuccess();          // 200
        console.log("testImageSuccess()");

        await testImageMissingContent();   // 400
        console.log("testImageMissingContent()");

        await testImageNotFound();         // 404
        console.log("testImageNotFound()");

        console.log("runTestsUnsplash() done");

    }

    await runTests();

}




