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

function createPanelHTML() {
 const profileBox = document.querySelector('.profile-box');

    let existingPanel = document.querySelector('.settings-panel');
    if (existingPanel) {
        existingPanel.classList.toggle('active');
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
      console.log("Name can’t be empty.");
      return;
    }

    try {
      await userApi.updateUser(currentUser.id, newName);
      currentUser.name = newName;
    } catch (err) {
      console.error(err);
    }
  });

  logoutBtn.addEventListener("click", async () => {
    try {
      await userApi.logoutUser();
      window.location.href = "/";
    } catch (err) {
      console.error(err);
    }
  });

  deleteBtn.addEventListener("click", async () => {
    try {
      await userApi.deleteUser(currentUser.id);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
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
