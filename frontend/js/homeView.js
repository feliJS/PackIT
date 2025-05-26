
console.log("i homeview")

import { navigateTo } from "./router.js";

export default function renderHome() {
  const homeDiv = document.getElementsByClassName("home-box")[0];
  if (!homeDiv) {
    console.error("Elementet .home-box hittades inte!");
    return;
  }

  homeDiv.innerHTML = `
    <div class="create-list-div">
      <h1 class="h1-title">CREATE YOUR PACKING LIST</h1>
      <p class="p-text">Don't know what to pack for your next trip? Click the button and get started!</p>
      <button class="create-list-button">Create List</button>
    </div>

    <div class="login-div">
      <p>Log in to see your lists</p>
      <div class="login-button-div">
        <button class="log-create-acc-buttons login-button">Log In</button>
        <button class="log-create-acc-buttons create-button">Create Account</button>
      </div>
    </div>
  `;

  toggleCreateListBtn();

  homeDiv.querySelector(".create-list-button")?.addEventListener("click", () => {
    navigateTo("create-list");
  });

  homeDiv.querySelector(".login-button")?.addEventListener("click", () => {
    navigateTo("login");
  });

  homeDiv.querySelector(".create-button")?.addEventListener("click", () => {
    navigateTo("register");
  });
}

// Om användaren är inloggad aktiveras "create-list"-knappen

function toggleCreateListBtn() {

  /* AKTIVERA NÄR LOGIN FUNGERAR
  const createBtn = document.querySelector(".create-list-button");
  const isCookie = document.cookie
      .split('; ')
      .find(cookie => cookie.startsWith("session_id="))
      ?.split('=')[1] || null;

  if (isCookie) { 
    createBtn.disabled = false;    
    createBtn.classList.remove("create-list-btn-disabled");
   } else {
    createBtn.disabled = true;    
    createBtn.classList.add("create-list-btn-disabled");
   }
 */
}