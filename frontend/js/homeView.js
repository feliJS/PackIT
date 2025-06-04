/**
renderHome fyller html för startsidan. kontrollerar om användaren är inloggad
(genom att läsa cookien och anpassar innehållet.)
T ex vill man ej se att man kan logga in och sånt, och knappen create list ska var available
vid log-in
 */



import { UserAPI } from "/client/users-client.js";
import { navigateTo } from "./router.js";
const userApi = new UserAPI("http://localhost:8000");

const isCookie = document.cookie //är en sträng med alla cookies
  .split('; ') //delar upp strängen i array där varje inlägg är key;value
  .find(cookie => cookie.startsWith("session_id=")) //letar upp rätt cookie
  ?.split('=')[1] || null; //om find hittade något, dela upp den i 2 delar där [1] blir cookien [0] är ju bara namnet på cookien
//om vi ej hittade cookien session-id så är den ju null, vilket denna säkerställer.
function toggleCreateListBtn() { //denna togglar ju om du kan faktiskt skapa en lista
  let errorMsg = document.getElementById("error-create-list");
  const createBtn = document.querySelector(".create-list-button");
  if (isCookie) {//om cookie blev true
    createBtn.disabled = false;
    errorMsg = ""
    createBtn.classList.remove("create-list-btn-disabled");
  } else { //annars så måste den säga tyvärr, du får logga in
    createBtn.disabled = true;
    errorMsg.textContent = "You need to login or create an account before creating a list!";
    createBtn.classList.add("create-list-btn-disabled");
  }
}

const loginDivDefaultHTML = ` //detta är login knapp delen
  <p>Log in to see your lists</p>
  <div class="login-button-div">
    <button class="log-create-acc-buttons login-button">Log In</button>
    <button class="log-create-acc-buttons create-button">Create Account</button>
  </div>
`;

function toggleLoginRegBtn() { //denna måste också hideas ibland
  const loginDiv = document.querySelector(".login-div");
  if (isCookie) {
    loginDiv.innerHTML = "";
  } else {
    loginDiv.innerHTML = loginDivDefaultHTML;
  }
}

async function toggleProfilePicture() { //profil bilden ska bytas om du är inloggad
  const profileImgEl = document.querySelector(
    ".header-container-right .user-profile"
  );
  if (!isCookie) {
    profileImgEl.src = "/assets/icons/user2.png"; //buta till user2 (vanliga)
    return;
  }
  try {
    const user = await userApi.getSpecificUser(isCookie); //async function så vi kan
    //await från userApi och hämta rätt användare (cookien är ju idet)

    if (user.pfp) { //om user har pfp
      profileImgEl.src = user.pfp;
    } else {
      profileImgEl.src = "/assets/icons/user2.png";
    }
  } catch (err) { //hantera ev. errors default
    profileImgEl.src = "/assets/icons/user2.png";
  }
}


export default function renderHome() {
  const homeDiv = document.getElementsByClassName("home-box")[0];
  if (!homeDiv) { //måste finnas home-box som redan finns i index.html de e den vi defaultar till
    console.error("Elementet .home-box hittades inte!");
    return;
  }

  homeDiv.innerHTML = ` //home div
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
  //logg in knapp delen (ska kunna hideas)

  toggleCreateListBtn();
  toggleLoginRegBtn();
  toggleProfilePicture()

  homeDiv.querySelector(".create-list-button")?.addEventListener("click", () => {
    navigateTo("create-list"); //öppnar skapa en lista mode
  });

  homeDiv.querySelector(".login-button")?.addEventListener("click", () => {
    navigateTo("login"); //login mode
  });

  homeDiv.querySelector(".create-button")?.addEventListener("click", () => {
    navigateTo("register"); //reg mode
  });
}

const profileBtn = document.querySelector(".user-profile");
profileBtn.addEventListener("click", () => {
  navigateTo("profile") //profile mode
})

