//Använda själva responsen 

import {allUsers} from "./requests.js"

allUsers().then((x) => {document.querySelector("body h1").textContent = JSON.stringify(x)})
