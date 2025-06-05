import { UserAPI } from "/client/users-client.js";
const userApi = new UserAPI("http://localhost:8000");

function getCookie(name) {
  return (
    document.cookie
      .split("; ")
      .find((c) => c.startsWith(name + "="))
      ?.split("=")[1] || null
  );
}

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
    return null;
  }
}

function showError(panel, message) {
  const errorDiv = panel.querySelector(".error-msg");
  errorDiv.innerText = message;
  const successDiv = panel.querySelector(".success-msg");
  successDiv.innerText = "";
}

function showSuccess(panel, message) {
  const successDiv = panel.querySelector(".success-msg");
  successDiv.innerText = message;
  const errorDiv = panel.querySelector(".error-msg");
  errorDiv.innerText = "";
}

function createPanelHTML() {
 const profileBox = document.querySelector('.profile-box');

    let existingPanel = document.querySelector('.settings-panel');
    if (existingPanel) { //kolalr om den finns
        existingPanel.classList.toggle('active'); //Om den finns så försvinner den om den inte finns lägg till
        return;
    }

    const panel = document.createElement('div');
    panel.classList.add('settings-panel', 'active');

    panel.innerHTML = `
        <div class="settings-header">Settings</div>
        <div class="settings-content">
            <div id="profile-updates">
                <p>Name</p>
                <div class="input-row">
                    <input type="text" placeholder="Update name..." />
                    <button class="save-btn">Save</button>
                    <div class="error-msg"></div>
                    <div class="success-msg"></div>
                </div>
            </div>
            <button class="btn delete">Delete Account</button>
            <button class="btn logout">Logout</button>
        </div>
    `;

    profileBox.appendChild(panel);
}

function settingsChoice(panel) {
  const saveBtn = panel.querySelector(".input-row .save-btn");
  const usernameInput = panel.querySelector(".input-row input");
  const logoutBtn = panel.querySelector(".logout");
  const deleteBtn = panel.querySelector(".delete");

  saveBtn.addEventListener("click", async () => {
    const newName = usernameInput.value;
    
    if (!newName) {
      showError(panel, "Name kan inte vara tom.");
      return;
    }

    try {
      await userApi.updateUser(currentUser.id, newName);
      currentUser.name = newName;
       showSuccess(panel, "Namnet uppdaterades!");
    } catch (err) {
      showError(panel, "Kunde inte uppdatera namn: " + (err.message || err));
    }
  });

  logoutBtn.addEventListener("click", async () => {
    try {
      await userApi.logoutUser();
      window.location.href = "/";
    } catch (err) {
      showError(panel, "Kunde inte logga ut: " + (err.message || err));
    }
  });

  deleteBtn.addEventListener("click", async () => {
    try {
      await userApi.deleteUser(currentUser.id);
      window.location.href = "/";
    } catch (err) {
      showError(panel, "Kunde inte radera konto: " + (err.message || err));
    }
  });
}

export async function renderSettingsView() {
  const container = document.querySelector(".profile-box");
  const toggleBtn = document.getElementById("toggleSettings");

  if (!container) {
    console.error("settings-box finns inte i DOM:en.");
    return;
  }

  await currentUserFind();
  createPanelHTML();
  settingsChoice(container.querySelector(".settings-panel"));
}
