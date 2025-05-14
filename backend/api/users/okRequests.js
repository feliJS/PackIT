//Använda själva responsen 

import { UserAPI } from './okRequests.js';

const userApi = new UserAPI('http://localhost:8000');

// Exempel på att hämta alla användare:
userApi.getAllUsers().then(users => {
    document.querySelector("body h1").textContent = JSON.stringify(users);
});

