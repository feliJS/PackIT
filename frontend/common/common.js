
//register & login
import { UserAPI } from '/common/client-class.js';
const userApi = new UserAPI('http://localhost:8000');

function createAccountPopup(containerSelector, title, btnId, btnText, onBtnClick) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = `
        <div class="account-popup" id="account-field">
            <div class="account-container">
                <div class="profile-pic"></div>
                <h1>${title}</h1>
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

    cancelBtn.addEventListener('mouseenter', function() {
        cancelBtn.textContent = originalText + ' :(';
    });

    cancelBtn.addEventListener('mouseleave', function() {
        cancelBtn.textContent = originalText;
    });

    cancelBtn.addEventListener('click', close);

    const actionBtn = document.getElementById(btnId);
    actionBtn.addEventListener("click", onBtnClick);
}

function createRegister() {
    createAccountPopup(
        '.register-box',
        'Create account!',
        'reg',
        'Register!',
        function() {
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            userApi.newAccount(username, password).then(user => {
                close();
            }).catch(err => {
                alert("Kunde inte skapa konto! " + (err.message || err));
            });
        }
    );
}

function createLogin() {
    createAccountPopup(
        '.login-box',
        'Login!',
        'log',
        'Login!',
        function() {
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            userApi.loginUser(username, password).then(user => {
                close();
            }).catch(err => {
                alert("Kunde ej logga in! " + (err.message || err));
            });
        }
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