
/* router.js */
//Beroende på vilken vy man vill så syns den, de andra "göms", samma med css!
import renderHome from "../js/homeView.js";
import renderCreateList from "../js/createlistView.js";
import { openRegister, openLogin } from "/js/LogInView.js";
import renderProfile from "../js/profileView.js";

function loadCSS(href) {
    if (document.querySelector(`link[href="${href}"]`)) return; //om den finns returnera direkt
    // //denna kollar om det finns en link href i headern
    const link = document.createElement("link"); //denna skapar ett nytt element med lin
    link.rel = "stylesheet"; //lägger in allt du behöver
    link.href = href;
    document.head.appendChild(link);
}

function hideAllViews() { //döljer allting, alla views.
    document.querySelectorAll(".home-box, .create-list-box, .profile-box, .login-box, .register-box .settings-box").forEach((currElem) => {
        currElem.style.display = "none";
        currElem.innerHTML = "";
    });
}

function removeCSS(href) { //om där finns den länken du la i, ta bort den
    const link = document.querySelector(`link[href="${href}"]`);
    if (link) link.remove();
}


export function navigateTo(view, data = {}) { //data är ett valfritt objekt 
    // default är det tomt!
    //men används mär vi vill skicka med info, t ex tripdataObj och weatherdataObj.

    hideAllViews(); //börja med att hidea allt och ta bort ALL css
    //detta är för när vi går till en ny vy, säkerställa att allt är borttaget.
    removeCSS("/css/home.css");
    removeCSS("/css/create-list.css");
    removeCSS("/css/registerlogin.css");
    removeCSS("/css/profile.css");
    removeCSS("/css/settings.css");

    switch (view) { //enkel switch case med den vyn vi vill få fram!
        case "home": //om home
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

window.addEventListener("DOMContentLoaded", () => { //När eventet “DOMContentLoaded” avfyras, anropas funktionen och kör navigateTo("home"), vilket gör att startsidan automatiskt visas när sidan laddas i webbläsaren.
    navigateTo("home");
});
