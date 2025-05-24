
console.log("I routeer")

import renderHome from "../js/homeView.js";
/* import renderCreateList from "../js/createlistView.js";
import renderProfile from "../js/profileView.js";
 */

console.log("I routeer")
function loadCSS(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
}

function hideAllViews() {
    document.querySelectorAll(".home-box, .createlist-box, .profile-box").forEach((currElem) => {
        currElem.style.display = "none";
        currElem.innerHTML = "";
    });
}

export function navigateTo(view) {

    hideAllViews();

    switch (view) {
        case "home":
            loadCSS("/css/home.css");
            document.querySelector(".home-box").style.display = "inline-block";
            renderHome(); 
            break;

/*         case "create-list":
            loadCSS("/frontend/css/createlist.css");
            document.querySelector(".createlist-box").style.display = "block";
            renderCreateList();
            break;

        case "profile":
            loadCSS("/frontend/css/profile.css");
            document.querySelector(".profile-box").style.display = "block";
            renderProfile();
            break; */

        default:
            document.querySelector("main").innerHTML = "<h1>404 - Vy hittades inte</h1>";
    }
}

window.addEventListener("DOMContentLoaded", () => {
    navigateTo("home");
});
