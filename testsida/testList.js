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


// GET (200) --> /users/:userId/:listId 
async function testGetListFound () {
    const response = await fetch(`${baseUrl}/1/1`);
    const resource = await response.json();

    logTest({
        rubrik: "Get List",
        metod: "GET",
        status: response.status,
        message: resource.listId
    })
}




/*
logTest({
        rubrik:
        metod:
        status:
        message:
    })
*/