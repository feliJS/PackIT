import { UserAPI } from "/client/users-client.js";
import { navigateTo } from "./router.js";
const userApi = new UserAPI("http://localhost:8000");
// Om användaren är inloggad aktiveras "create-list"-knappen

const isCookie = document.cookie
  .split('; ')
  .find(cookie => cookie.startsWith("session_id="))
  ?.split('=')[1] || null;

function toggleCreateListBtn() {
  let errorMsg = document.getElementById("error-create-list");
  const createBtn = document.querySelector(".create-list-button");
  if (isCookie) {
    createBtn.disabled = false;
    errorMsg = ""
    createBtn.classList.remove("create-list-btn-disabled");
  } else {
    createBtn.disabled = true;
    errorMsg.textContent = "You need to login or create an account before creating a list!";
    createBtn.classList.add("create-list-btn-disabled");
  }
}

// Spara originalinnehållet för login-div
const loginDivDefaultHTML = `
  <p>Log in to see your lists</p>
  <div class="login-button-div">
    <button class="log-create-acc-buttons login-button">Log In</button>
    <button class="log-create-acc-buttons create-button">Create Account</button>
  </div>
`;

function toggleLoginRegBtn() {
  const loginDiv = document.querySelector(".login-div");
  if (isCookie) {
    loginDiv.innerHTML = "";
  } else {
    loginDiv.innerHTML = loginDivDefaultHTML;
  }
}

async function toggleProfilePicture() {
  const profileImgEl = document.querySelector(
    ".header-container-right .user-profile"
  );
  if (!isCookie) { //om ingen profil bild visa standard ikon
    profileImgEl.src = "/assets/icons/user2.png";
    return;
  }
  try {
    const user = await userApi.getSpecificUser(isCookie);

    if (user.pfp) {
      profileImgEl.src = user.pfp;
    } else {
      profileImgEl.src = "/assets/icons/user2.png"; // fallback om pfp saknas
    }
  } catch (err) {
    profileImgEl.src = "/assets/icons/user2.png";   // fallback vid fel
  }
}


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
      <p id="error-create-list" style="color: #e74c3c;"></p>
    </div>

      <div class="login-div">
        ${loginDivDefaultHTML}
      </div>
    </div>
  `;

  toggleCreateListBtn();
  toggleLoginRegBtn();
  toggleProfilePicture()

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

const profileBtn = document.querySelector(".user-profile");
profileBtn.addEventListener("click", () => {
  navigateTo("profile")
})

