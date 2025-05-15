//Använda själva responsen 

import { UserAPI } from './requests.js';

const userApi = new UserAPI('http://localhost:8000');

userApi.loginUser("Frog", "123").then(user => {
    document.querySelector("body h2").textContent = JSON.stringify(user);
})

// Exempel på att hämta alla användare:
userApi.getAllUsers().then(users => {
    document.querySelector("body h1").textContent = JSON.stringify(users);
});

userApi.updateUser("2", "Alex").then(response => {
    document.querySelector("body h3").textContent = JSON.stringify(response);
});