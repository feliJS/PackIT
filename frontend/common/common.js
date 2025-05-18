import { UserAPI } from '/common/client-class.js';
const userApi = new UserAPI('http://localhost:8000');

function openRegister() {
    document.getElementById("account-field").style.display = "block";
}

function closeRegister() {
    document.getElementById("account-field").style.display = "none";
}

document.getElementById('open-btn').addEventListener('click', openRegister);

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
});