
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

  homeDiv.querySelector(".create-list-button")?.addEventListener("click", () => {
    navigateTo("create-list");
  });

  homeDiv.querySelector(".log-in-button")?.addEventListener("click", () => {
    navigateTo("login");
  });

  homeDiv.querySelector(".create-acc-button")?.addEventListener("click", () => {
    navigateTo("register");
  });
}
