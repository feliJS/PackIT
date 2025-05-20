




//register
function createLoginRegister() {
    const container = document.querySelector('.login-register');
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
}


import { UserAPI } from '/common/client-class.js';
const userApi = new UserAPI('http://localhost:8000');

function openRegister() {
    createLoginRegister()
}

function closeRegister() {
   document.querySelector('.login-register').innerHTML = ""
}

document.getElementById('create-acc-button').addEventListener('click', openRegister);

const cancelBtn = document.getElementById('cancel-btn');
const originalText = cancelBtn.textContent;

cancelBtn.addEventListener('mouseenter', function() {
    cancelBtn.textContent = originalText + ' :(';
});

cancelBtn.addEventListener('mouseleave', function() {
    cancelBtn.textContent = originalText;
});

cancelBtn.addEventListener('click', closeRegister);

const registerBtn = document.getElementById('reg');
registerBtn.addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    userApi.newAccount(username, password).then(user => {
        closeRegister();
    }).catch(err => {
        alert('Kunde inte skapa konto! ' + (err.message || err));
    });
});//l