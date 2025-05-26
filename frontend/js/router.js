
console.log("I router 2")

import renderHome from "../js/homeView.js";
 import renderCreateList from "../js/createlistView.js";

/* import renderProfile from "../js/profileView.js"; */

console.log("I router 9")

function loadCSS(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
}

function hideAllViews() {
    document.querySelectorAll(".home-box, .create-list-box, .profile-box").forEach((currElem) => {
        currElem.style.display = "none";
        currElem.innerHTML = "";
    });
}

function removeCSS(href) {
    const link = document.querySelector(`link[href="${href}"]`);
    if (link) link.remove();
  }
  

export function navigateTo(view) {

    hideAllViews();

    removeCSS("/css/home.css");
    removeCSS("/css/create-list.css");



    switch (view) {
        case "home":
            loadCSS("/css/home.css");
            document.querySelector(".home-box").style.display = "inline-block";
            renderHome();
            break;

        case "create-list":
            loadCSS("/css/create-list.css");
            document.querySelector(".create-list-box").style.display = "inline-block";
            renderCreateList();
            break;

        /*   
        case "profile":
           loadCSS("/frontend/css/profile.css");
           document.querySelector(".profile-box").style.display = "inline-block";
           renderProfile();
           break; 
        */

        default:
            loadCSS("/css/home.css");
            document.querySelector(".home-box").style.display = "inline-block";
            renderHome();
    }
}

window.addEventListener("DOMContentLoaded", () => {
    navigateTo("home");
});
