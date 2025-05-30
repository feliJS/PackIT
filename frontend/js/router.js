
/* router.js */

import renderHome from "../js/homeView.js";
import renderCreateList from "../js/createlistView.js";
import { openRegister, openLogin } from "/js/LogInView.js";
import renderProfile from "../js/profileView.js";

function loadCSS(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
}

function hideAllViews() {
    document.querySelectorAll(".home-box, .create-list-box, .profile-box, .login-box, .register-box .settings-box").forEach((currElem) => {
        currElem.style.display = "none";
        currElem.innerHTML = "";
    });
}

function removeCSS(href) {
    const link = document.querySelector(`link[href="${href}"]`);
    if (link) link.remove();
}


export function navigateTo(view,  data = {}) {

    hideAllViews();
    removeCSS("/css/home.css");
    removeCSS("/css/create-list.css");
    removeCSS("/css/registerlogin.css");
    removeCSS("/css/profile.css");
    removeCSS("/css/settings.css");

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

        case "profile":
           loadCSS("/css/profile.css");
           loadCSS("/css/settings.css");
           document.querySelector(".profile-box").style.display = "inline-block";
           /* --- tripData, weatherData --- */
           renderProfile(data.tripDataObj, data.weatherDataObj);
           break; 

        case "login":
           loadCSS("/css/registerlogin.css");
           document.querySelector(".login-box").style.display = "inline-block";
           openLogin();
           break; 

        case "register":
           loadCSS("/css/registerlogin.css");
           document.querySelector(".register-box").style.display = "inline-block";
           openRegister();
           break; 

        default:
            loadCSS("/css/home.css");
            document.querySelector(".home-box").style.display = "inline-block";
            renderHome();
    }
}

window.addEventListener("DOMContentLoaded", () => {
    navigateTo("home");
});
