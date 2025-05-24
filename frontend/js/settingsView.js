const toggleBtn = document.getElementById('toggleSettings');
const container = document.getElementById('settingsContainer');
function createPanelHTML () {
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

toggleBtn.addEventListener('click', () => {
    const panel = document.getElementById('settingsPanel');
    if (panel) {
        container.innerHTML = '';
    } else {
        container.innerHTML = createPanelHTML();
    }
});