import { UserAPI } from "/client/users-client.js";
const userApi = new UserAPI("http://localhost:8000");

// (returnerar null om ej hittad)
function getCookie(name) {
  return (
    document.cookie
      .split("; ")
      .find((c) => c.startsWith(name + "="))
      ?.split("=")[1] || null
  );
}
// Hämta användare via session_id‑cookie
let currentUser = null;
async function currentUserFind() {
  const id = getCookie("session_id");
  if (!id) {
    return null;
  }
  try {
    currentUser = await userApi.getSpecificUser(id);
    return currentUser;
  } catch (err) {
    console.error(err);
    alert("Kunde inte hämta användardata.");
    return null;
  }
}

const toggleBtn = document.getElementById("toggleSettings");
const container = document.getElementById("settingsContainer");

function createPanelHTML() {
  return `
    <div class="settings-panel" id="settingsPanel">
      <div class="settings-header">Settings</div>
      <div class="settings-content">
        <div id="profile-updates">
          <p>Username</p>
          <div class="input-row">
            <input type="text" id="username" placeholder="Enter new name" />
            <button class="save-btn">Save</button>
          </div>
        </div>

        <button class="btn logout">Logout</button>
        <button class="btn delete">Delete account</button>
      </div>
    </div>`;
}

function settingsChoice(panel) {
  const saveBtn = panel.querySelector(".save-btn");
  const usernameInput = panel.querySelector("#username");
  const logoutBtn = panel.querySelector(".logout");
  const deleteBtn = panel.querySelector(".delete");

  //Change username & save 
  saveBtn.addEventListener("click", async () => {
    const newName = usernameInput.value
    if (!newName) {
      console.log("Name can’t be empty."); //ändra detta till error under input field
      return;
    }

    try {
      await userApi.updateUser(currentUser.id, newName);
      currentUser.name = newName;
    } catch (err) {
      console.error(err);
      //samma här visa istället vad som är problemet under input
    }
  });

  //  Logout
  logoutBtn.addEventListener("click", async () => {
    try {
      await userApi.logoutUser();
      window.location.href = "/"; //denna är jag osäker? kanske gå tillbaka till första sidan- en force reload dit..
    } catch (err) {
      console.error(err);
    //fixa
    }
  });

  //Delete account 
  deleteBtn.addEventListener("click", async () => {
    try {
      await userApi.deleteUser(currentUser.id);
      window.location.href = "/"; //samma som ovan.. kanske en reload till main sidan
    } catch (err) {
      console.error(err);
      //fixa
    }
  });
}

toggleBtn.addEventListener("click", async () => {
  const panel = document.getElementById("settingsPanel");
  if (panel) {
    container.innerHTML = ""; // close
  } else {
    await currentUserFind();
    container.innerHTML = createPanelHTML();
    settingsChoice(container.querySelector("#settingsPanel"));
  }
});
