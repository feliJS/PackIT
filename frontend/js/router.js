import renderHome from "./pages/home/homeDOM.js";
import renderCreateList from "./pages/create-list/createListDOM.js";
import renderProfile from "./pages/profile/profileDOM.js";

function loadCSS(currentPath) {
    const existingCSS = document.querySelector(`link[href="${currentPath}"]`);
    if (existingCSS) return;

    const newLink = document.createElement("link");
    newLink.rel = "stylesheet";
    newLink.href = currentPath;
    document.head.appendChild(newLink);
}

function clearMain() {
    const existingMain = document.querySelector("main");
    if (existingMain) {
        existingMain.remove();
    }
    const newMain = document.createElement("main");
    document.getElementById("app").appendChild(newMain);
    return newMain;
}

export function renderCurrentRoute() {
    const path = window.location.pathname;
    const root = document.getElementById("app");
    root.innerHTML = "";
    let main;

    switch (path) {
        case "/":
        case "/home":
            loadCSS("/pages/home/style.css");
            main = clearMain();
            main.appendChild(renderHome());
            break;

        case "/create-list":
            loadCSS("/pages/create-list/style.css");
            main = clearMain();
            main.appendChild(renderCreateList());
            break;

        case "/profile":
            loadCSS("/pages/profile/profile.css");
            loadCSS("/common/common.css");
            main = clearMain();
            main.appendChild(renderProfile());
            break;

        default:
            root.innerHTML = "<h1>404 - Page not found</h1>";
    }
}

function handleLinkClick(event) {
    const target = event.target.closest("a[data-link]");
    if (target) {
        event.preventDefault();
        const url = target.getAttribute("href");
        history.pushState(null, null, url);
        renderCurrentRoute();
    }
}

document.addEventListener("click", handleLinkClick);
window.addEventListener("popstate", renderCurrentRoute);
window.addEventListener("DOMContentLoaded", renderCurrentRoute);
