import { UserAPI } from "/client/users-client.js";
import { navigateTo } from "./router.js";

const userApi = new UserAPI("http://localhost:8000");

const imageApiBase = "http://localhost:8000/image";
let cachedAvatarUrl = null;

function showError(containerSelector, msg) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const errEl = container.querySelector(".error-msg");
  if (errEl) {
    errEl.textContent = msg;
    errEl.style.display = "block";
  }
}

function hideError(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const errEl = container.querySelector(".error-msg");
  if (errEl) {
    errEl.textContent = "";
    errEl.style.display = "none";
  }
}

async function fetchRandomAvatar() {
  const res = await fetch(`${imageApiBase}/randomimage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: "animal" }),
  });
  return await res.text();
}

function createAccountPopup(
  containerSelector,
  btnId,
  btnText,
  onBtnClick,
  showProfilePic,
) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const profilePicHTML = showProfilePic
    ? '<div class="profile-pic"></div>'
    : "";

  container.innerHTML = `
    <div class="account-popup" id="account-field">
      <div class="account-container">
        ${profilePicHTML}
        <div class="inputs">
          <input id="username" placeholder="Username" type="text" />
          <input id="password" placeholder="Password" type="password" />
          <p class="error-msg" style="display: none"></p>
          <button class="btn" id="${btnId}">${btnText}</button>
          <button class="btn cancel" id="cancel-btn">Close</button>
        </div>
      </div>
    </div>
  `;

  hideError(containerSelector);

  const cancelBtn = document.getElementById("cancel-btn");
  const originalText = cancelBtn.textContent;

  cancelBtn.addEventListener("mouseenter", () => {
    cancelBtn.textContent = originalText + " :(";
  });

  cancelBtn.addEventListener("mouseleave", () => {
    cancelBtn.textContent = originalText;
  });

  cancelBtn.addEventListener("click", close);

  const actionBtn = document.getElementById(btnId);
  actionBtn.addEventListener("click", onBtnClick);
}

async function createRegister() {
  if (!cachedAvatarUrl) {
    cachedAvatarUrl = await fetchRandomAvatar();
  }

  createAccountPopup(
    ".register-box",
    "reg",
    "Register!",
    async () => {
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      try {
        await userApi.newAccount(username, password, cachedAvatarUrl);
        close();
        navigateTo("profile")
      } catch (err) {
        let errorMsg = "Kunde inte skapa konto!";
        if (err?.error) errorMsg = err.error;
        else if (err?.message) errorMsg = err.message;
        showError(".register-box", errorMsg);
      }
    },
    true,
  );

  const picDiv = document.querySelector(".profile-pic");
  if (picDiv) {
    picDiv.style.backgroundImage = `url(${cachedAvatarUrl})`;
    picDiv.style.backgroundSize = "cover";
    picDiv.style.backgroundPosition = "center";
  }
}

function createLogin() {
  createAccountPopup(
    ".login-box",
    "log",
    "Login!",
    async () => {
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      try {
        await userApi.loginUser(username, password);
        close();
        navigateTo("profile")
      } catch (err) {
        let errorMsg = "Kunde inte logga in!";
        if (err?.error) errorMsg = err.error;
        else if (err?.message) errorMsg = err.message;
        showError(".login-box", errorMsg);
      }
    },
    false,
  );
}

export function openRegister() {
  createRegister();
}

export function openLogin() {
  createLogin();
}

function close() {
  navigateTo("home");
  const regBox = document.querySelector(".register-box");
  if (regBox) regBox.innerHTML = "";
  const loginBox = document.querySelector(".login-box");
  if (loginBox) loginBox.innerHTML = "";
}
