//register & login
import { UserAPI } from '/common/client-class.js';
const userApi = new UserAPI('http://localhost:8000');

const imageApiBase = "http://localhost:8000/image";
let cachedAvatarUrl = null; 

async function fetchRandomAvatar() {
    // content kan vara vad du vill söka på i Unsplash – t.ex. "avatar"
    const res = await fetch(`${imageApiBase}/randomimage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "animal" })
    });
    // imageAPI returnerar bara URL:en som ren text
    return await res.text();
}

function createAccountPopup(containerSelector, btnId, btnText, onBtnClick, showProfilePic) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // Lägg bara till profile-pic om showProfilePic är true
    const profilePicHTML = showProfilePic ? '<div class="profile-pic"></div>' : '';

    container.innerHTML = `
        <div class="account-popup" id="account-field">
            <div class="account-container">
                ${profilePicHTML}
                <div class="inputs">
                    <input id="username" placeholder="Username" type="text">
                    <input id="password" placeholder="Password" type="password">
                    <button class="btn" id="${btnId}">${btnText}</button>
                    <button class="btn cancel" id="cancel-btn">Close</button>
                </div>
            </div>
        </div>
    `;

    const cancelBtn = document.getElementById('cancel-btn');
    const originalText = cancelBtn.textContent;

    cancelBtn.addEventListener('mouseenter', () => {
        cancelBtn.textContent = originalText + ' :(';
    });

    cancelBtn.addEventListener('mouseleave', () => {
        cancelBtn.textContent = originalText;
    });

    cancelBtn.addEventListener('click', close);

    const actionBtn = document.getElementById(btnId);
    actionBtn.addEventListener("click", onBtnClick);
}
async function createRegister() {
    // Hämta endast en ny bild om vi inte redan har en
    if (!cachedAvatarUrl) {
        cachedAvatarUrl = await fetchRandomAvatar();
    }

    // Bygg popupen
    createAccountPopup(
        '.register-box',
        'reg',
        'Register!',
        () => {
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            userApi.newAccount(username, password, cachedAvatarUrl)
                .then(user => {
                    close();
                    window.location.reload(true);
                })
                .catch(err => {
                    alert("Kunde inte skapa konto! " + (err.message || err));
                });
        },
        true
    );

    // Visa bilden
    const picDiv = document.querySelector('.profile-pic');
    if (picDiv) {
        picDiv.style.backgroundImage = `url(${cachedAvatarUrl})`;
        picDiv.style.backgroundSize = "cover";
        picDiv.style.backgroundPosition = "center";
    }
}


function createLogin() {
    createAccountPopup(
        '.login-box',
        'log',
        'Login!',
        () => {
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            userApi.loginUser(username, password).then(user => {
                close();
                window.location.reload(true);
            }).catch(err => {
                alert("Kunde ej logga in! " + (err.message || err));
            });
        },
        false 
    );
}

function openRegister() {
    createRegister();
}

function openLogin() {
    createLogin();
}

function close() {
    const regBox = document.querySelector(".register-box");
    if (regBox) regBox.innerHTML = "";
    const loginBox = document.querySelector(".login-box");
    if (loginBox) loginBox.innerHTML = "";
}

document.getElementById("create-acc-button").addEventListener('click', openRegister);
document.getElementById("log-in-button").addEventListener('click', openLogin);



// script.js till index.html home!!!

function getCookie(name) { //hittar rätt cookie
    return document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith(name + "="))
        ?.split('=')[1] || null;
}

const sessionId = getCookie("session_id");

const loginDiv = document.getElementById("log-in-div");
const createListButton = document.getElementById("create-list-button");
const errorMsg = document.getElementById("error-create-list");
const header = document.querySelector("#create-list-div h1");

createListButton.addEventListener("click", function (e) {
    if (!sessionId) {
        errorMsg.textContent = "You need to login or create an account before creating a list!";
    } else {
        errorMsg.textContent = "";
        //här kommer sedan en "redirect" till koden som kommer öppna frågorna
    }
});

if (sessionId) {
    const loginDiv = document.getElementById("log-in-div");
    if (loginDiv) {
        loginDiv.style.visibility = 'hidden';
    }
    userApi.getSpecificUser(sessionId).then(user => {
                header.textContent = `Welcome, ${user.name}!`;
            })
        }
else{
    if (loginDiv) {
        loginDiv.style.visibility = 'visible';
        header.textContent = "CREATE YOUR PACKING LIST";
    }
}
