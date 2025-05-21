function getCookie(name) { //hittar rätt cookie
    return document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith(name + '='))
        ?.split('=')[1] || null;
}

const sessionId = getCookie('session_id');

const createListButton = document.getElementById('create-list-button');
const errorMsg = document.getElementById('error-create-list');

createListButton.addEventListener('click', function (e) {
    if (!sessionId) {
        errorMsg.textContent = "You need to login or create account before creating a list!";
    } else {
        errorMsg.textContent = "";
        //här kommer sedan en "redirect till koden som kommer öppna frågorna
    }
});
