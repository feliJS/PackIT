function getCookie(name) { //hittar rätt cookie
    return document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith(name + "="))
        ?.split('=')[1] || null;
}

async function main() {
    const sessionId = getCookie("session_id");
    const userData = await getSpecificUser(sessionId); 

    const loginDiv = document.getElementById("log-in-div");
    const createListButton = document.getElementById("create-list-button");
    const errorMsg = document.getElementById("error-create-list");
    const header = document.querySelector("#create-list-div h1");

    createListButton.addEventListener("click", function (e) {
        if (!sessionId) {
            errorMsg.textContent = "You need to login or create an account before creating a list!";
        } else {
            errorMsg.textContent = "";
            //här kommer sedan en "redirect till koden som kommer öppna frågorna
        }
    });

    if (sessionId) {
        if (loginDiv) {
            loginDiv.style.visibility = 'hidden';
        }
        if (userData && userData.name) {
            header.textContent = `Welcome, ${userData.name}!`;
        } 
    }
    else{
        if (loginDiv) {
            loginDiv.style.visibility = 'visible';
            header.textContent = "CREATE YOUR PACKING LIST";
        }
    }
}

main();
