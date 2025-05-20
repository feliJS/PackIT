const usersURL = "http://localhost:8000/users";

const testUser = { name: "alle", password: "yaya" }
//GET USERS
const requestLog = document.getElementById("reqLog")
let newUserID;

function publishUsers(data) {
    const users = data;

    const list = document.getElementById("user-list");


    users.forEach(user => {
        const item = document.createElement("div")
        item.classList.add("user-item")
        item.textContent = `ID: ${user.id}, Namn: ${user.name}`;
        list.appendChild(item);
    });

}
function showRequestDone(obj) {
    let divRow = document.createElement("div")
    divRow.classList.add("row");
    const rubrik = document.createElement("div");
    const metod = document.createElement("div");
    const status = document.createElement("div");
    const meddelande = document.createElement("div");
    rubrik.textContent = obj.rubrik;
    metod.textContent = obj.metod;
    status.innerHTML = `<span class="status success">${obj.status}</span>`;
    meddelande.textContent = obj.meddelande;
    divRow.append(rubrik, metod, status, meddelande);
    requestLog.appendChild(divRow);
}




async function testGetAllUsers() {
    const DOMobject = {
        rubrik: "Get all users",
        metod: "GET"
    }
    const opts = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    }
    const req = new Request("http://localhost:8000/users", opts);
    try {
        const response = await fetch(req);
        const data = await response.json();
        DOMobject.status = response.status;
        DOMobject.meddelande = response.statusText;
        publishUsers(data);
        showRequestDone(DOMobject);
        return testPostUser(testUser);
    }
    catch (error) {
        // DOMobject.status = error.status;
        // DOMobject.meddelande = error.statusText;
        console.log(error);
        return
    }



};



async function testPostUser(user, password) {
    const DOMobject = {
        rubrik: "Create New User",
        metod: "POST"
    }
    const opts = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(testUser)
    }
    const req = new Request("http://localhost:8000/users", opts)
    try {
        const response = await fetch(req);
        const data = await response.json();
        DOMobject.status = response.status;
        DOMobject.meddelande = response.statusText;
        showRequestDone(DOMobject)
        newUserID = data.id;
        return testLoginUser(testUser.name, testUser.password);
    }
    catch (error) {
        DOMobject.status = error.status;
        DOMobject.meddelande = error.statusText;
        showRequestDone(DOMobject)
        return
    }
}

async function testLoginUser(user, password) {
    const DOMobject = {
        rubrik: "Login New User",
        metod: "POST"
    }
    const opts = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: user, password: password })
    }
    const req = new Request("http://localhost:8000/users/login", opts);
    try {
        const response = await fetch(req);
        DOMobject.status = response.status;
        DOMobject.meddelande = response.statusText;
        showRequestDone(DOMobject);
        return testLogoutUser()
    } catch (error) {
        DOMobject.status = response.status;
        DOMobject.meddelande = response.statusText;
        console.log(error);
        showRequestDone(DOMobject);
    }

}
async function testLogoutUser(user, password) {
    const DOMobject = {
        rubrik: "Logout New User",
        metod: "POST"
    }
    const opts = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: user, password: password })
    }
    const req = new Request("http://localhost:8000/users/logout", opts);
    try {
        const response = await fetch(req);
        DOMobject.status = response.status;
        DOMobject.meddelande = response.statusText;
        showRequestDone(DOMobject);
        return testDeleteUser(newUserID);
    } catch (error) {
        DOMobject.status = response.status;
        DOMobject.meddelande = response.statusText;
        console.log(error);
        showRequestDone(DOMobject);
    }
}

//här en deletefunktion men kanske vill testa göra grejer med listor innan delete
async function testDeleteUser(id) {
    const DOMobject = {
        rubrik: "Logout New User",
        metod: "POST"
    }
    const deleteURL = new URL(`http://localhost:8000/users/${id}`);
    const opts = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
        //body: JSON.stringify({ name: user, password: password })
    }
    const req = new Request(deleteURL, opts)
    try {
        const response = await fetch(req);
        const data = await response.json();
        DOMobject.status = response.status;
        DOMobject.meddelande = response.statusText
    }
    catch (error) {
        console.log(error);
    }


}

testGetAllUsers();
///HALLÅ