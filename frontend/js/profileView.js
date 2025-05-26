/* profileView.js */

import { UserAPI } from '/client/users-client.js';
const userApi = new UserAPI('http://localhost:8000');


export default function renderProfile(tripData, weaterData) {
    // DOM OSV.
}


// SATTE TILLFÄLLIG FUNC RUNT BEF. KOD FÖR BÄTTRE ÖVERBLICK AV FILEN
function findUser() {
    function getCookie(name) { //hittar rätt cookie
        return document.cookie
            .split('; ')
            .find(cookie => cookie.startsWith(name + "="))
            ?.split('=')[1] || null;
    }

    const sessionId = getCookie("session_id");

    const nameText = document.querySelector(".profileName");
    if (sessionId) {
        userApi.getSpecificUser(sessionId).then(user => {
            nameText.textContent = `@${user.name}`;
        })
    }
    else {
        window.location.href = "/";
    }
}

