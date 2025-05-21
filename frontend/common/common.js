import { UserAPI } from '/common/client-class.js';
const userApi = new UserAPI('http://localhost:8000');


//
//register
function createRegister() {
    const container = document.querySelector('.register-box');
    if (!container) return;

    container.innerHTML = `
            <div class="account-popup" id="account-field">
                <div class="account-container">
                    <div class="profile-pic"></div>
                    <h1>Create account!</h1>
                    <div class="inputs">
                        <input id="username" placeholder="Username" type="text">
                        <input id="password" placeholder="Password" type="password">
                        <button class="btn reg" id="reg">Register!</button>
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

    const registerBtn = document.getElementById('reg');
    registerBtn.addEventListener("click", function() {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        userApi.newAccount(username, password).then(user => {
            close();
        }).catch(err => {
            alert("Kunde inte skapa konto! " + (err.message || err));
        });
    });
}

//register
function createLogin() {
    const container = document.querySelector('.login-box');
    if (!container) return;

    container.innerHTML = `
            <div class="account-popup" id="account-field">
                <div class="account-container">
                    <div class="profile-pic"></div>
                    <h1>Login!</h1>
                    <div class="inputs">
                        <input id="username" placeholder="Username" type="text">
                        <input id="password" placeholder="Password" type="password">
                        <button class="btn log" id="log">Login!</button>
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

    const loginBtn = document.getElementById('log');
    loginBtn.addEventListener("click", function() {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        userApi.loginUser(username, password).then(user => {
            close();
        }).catch(err => {
            alert("Kunde ej logga in! " + (err.message || err));
        });
    });
}



function openRegister() {
    createRegister()
}

function openLogin() {
    createLogin()
}

function close() {
   const regBox = document.querySelector(".register-box");
   if (regBox) regBox.innerHTML = "";
   const loginBox = document.querySelector(".login-box");
   if (loginBox) loginBox.innerHTML = "";
}

document.getElementById("create-acc-button").addEventListener('click', openRegister);
document.getElementById("log-in-button").addEventListener('click', openLogin);