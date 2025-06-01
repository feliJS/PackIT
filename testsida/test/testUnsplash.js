export async function runTestsUnsplash() {

    const baseUrl = "http://localhost:8000";
    const reqLog = document.getElementById("reqLog");

    function logTest({ title, method, status, message }, matchedExpectations) {

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
        if (matchedExpectations) {
            newRow.className = "row unsplashRow expStatus";
        } else {
            newRow.className = "row unsplashRow notExpStatus";
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

    // === POST /image/randomimage (200) ===
    async function testImageSuccess() {
        const expectedStatus = 200;
        let matchedExpectations = false;

        const response = await fetch(`${baseUrl}/image/randomimage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: "animal" })
        });

        const body = await response.text();

        if (response.status === expectedStatus) {
            matchedExpectations = true;
        }

        logTest({
            title: "Random Image (Success)",
            method: "POST",
            status: response.status,
            message: body
        }, matchedExpectations);
    }

    // === POST /image/randomimage (missing content) ===
    async function testImageMissingContent() {
        const expectedStatus = 400;
        let matchedExpectations = false;

        const response = await fetch(`${baseUrl}/image/randomimage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        });

        const body = await response.json();

        if (response.status === expectedStatus) {
            matchedExpectations = true;
        }

        logTest({
            title: "Random Image (Missing Content)",
            method: "POST",
            status: response.status,
            message: body
        }, matchedExpectations);
    }

    // === POST /image/randomimage (unsuccessful fetch) ===
    async function testImageNotFound() {
        const expectedStatus = 404;
        let matchedExpectations = false;

        const response = await fetch(`${baseUrl}/image/randomimage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: "thiswontreturnanythingxyz" }) 
        });

        const body = await response.json();

        if (response.status === expectedStatus) {
            matchedExpectations = true;
        }

        logTest({
            title: "Random Image (Fetch Failed)",
            method: "POST",
            status: response.status,
            message: body
        }, matchedExpectations);
    }


    // === Kör alla tester ===
    async function runTests() {

        await testImageSuccess();          // 200
        await testImageMissingContent();   // 400
        await testImageNotFound();         // 404

    }

    await runTests();

}
