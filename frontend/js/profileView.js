/* profileView.js */

import { UserAPI } from '/client/users-client.js';
import { ListAPI } from '/client/list-client.js';
import { navigateTo } from './router.js';
import { editList } from "./handleListView.js";
import { submitDestination } from "./createlistView.js";
import { renderSettingsView } from "./settingsView.js";

const userApi = new UserAPI('http://localhost:8000');
const listApi = new ListAPI('http://localhost:8000');

const imageApiBase = "http://localhost:8000/image";



async function findUser() {
    function getCookie(name) { //hittar rätt cookie
        return document.cookie
            .split('; ')
            .find(cookie => cookie.startsWith(name + "="))
            ?.split('=')[1] || null;
    }

    const sessionId = getCookie("session_id");
    
    if (sessionId) {
        let user = await userApi.getSpecificUser(sessionId);
        return user;
    }
    else {
        window.location.href = "/";
    }
}

async function fetchListPic(destination) {
  const res = await fetch(`${imageApiBase}/randomimage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: `${destination}` }),
  });
  return await res.text();
}


export default async function renderProfile(tripDataObj, weatherDataObj) {
    const user = await findUser();
    if (!user) {
        navigateTo("login")
        return
    }
    
    if(tripDataObj && weatherDataObj) {
        renderNewList(user.id, tripDataObj, weatherDataObj);
    }

    

    let listData = await listApi.getAllLists(user.id);
    const hasBasicList = listData.some(list => list.listName === "Basic List");

    if (!hasBasicList) {
    await listApi.createList(user.id);
    listData = await listApi.getAllLists(user.id);
    }
    
    const profileViewDOM = document.querySelector(".profile-box")
    profileViewDOM.innerHTML = "";
    const profileContainer = document.createElement("div");
    profileContainer.classList.add("profileHead")
    const allListsContainer = document.createElement("div");
    allListsContainer.classList.add("allListsContainer");
    profileViewDOM.appendChild(profileContainer);
    profileViewDOM.appendChild(allListsContainer);
    
    const createButton = document.createElement("button");
    createButton.id = "create-list-button";
    createButton.textContent = "Create List";
    createButton.addEventListener("click", () => {
        navigateTo("create-list");
    })

    const createButtonSettings = document.createElement("button");
    createButtonSettings.id = "settings-button";
    createButtonSettings.textContent = "settings"; //picture
    createButtonSettings.addEventListener("click", () => {
        renderSettingsView()
    })
    
    profileContainer.appendChild(loadName(user));
    profileContainer.appendChild(createButton);
    profileContainer.appendChild(createButtonSettings);  

    loadLists(user.id, allListsContainer);

    



// Väg från "Create List-mode"

async function renderNewList(userId, tripDataObj) {
    const cover = await fetchListPic(tripDataObj.country);
    const listName = tripDataObj.city
    console.log(tripDataObj.vehicle);
    const newList = await listApi.createList(userId, listName, tripDataObj.purpose, cover, tripDataObj.vehicle);
    console.log(newList);
    editList(newList.list, tripDataObj);
}

function loadLists(userId, container) {
    //getuserLists
    if (listData) {
        listApi.getAllLists(userId).then( (x) => {
    
            for (let list of x) {
                createListObj(list, container);
                
            }
        } )
    }
   

}


function loadName (user) {
    const nameDiv = document.createElement("div");
    nameDiv.classList.add("nameDiv");

    const pic = document.createElement("div");
    pic.classList.add("profile-pic")
    pic.style.backgroundImage = `url("${user.pfp}")`;
    pic.style.backgroundSize = "cover";
    pic.style.backgroundPosition = "center";
    nameDiv.appendChild(pic);

    const h2 = document.createElement("h2");
    h2.textContent = `${user.name}`;
    nameDiv.appendChild(h2);
    return nameDiv;
}

function createListObj(list, container, tripDataObj) {
    const listDOM = document.createElement("div");
    listDOM.classList.add("listContainer");
    if (list.listName === "Basic List") {
        let backPic = "../assets/images/backpack.jpg"
        listDOM.style.backgroundImage = `url("${backPic}")`;
        listDOM.style.backgroundSize ="cover";
        listDOM.style.backgroundPosition = "top";
    }
    if (list.cover) {
        listDOM.style.backgroundImage = `url("${list.cover}")`;
        listDOM.style.backgroundSize = "cover";
        listDOM.style.backgroundPosition = "center";
    }
    
    let listHead = document.createElement("div");
    listHead.classList.add("listHead")
    let listName = document.createElement("h3");
    listName.classList.add("listname");
    listName.textContent = list.listName;
    
    let buttonBox = document.createElement("div");
    buttonBox.style.display = "flex";
    buttonBox.style.gap = "8px";

    let editImg = document.createElement("img");
    editImg.src = "../assets/icons/editPng.png";
    editImg.style.height = "16px";
    editImg.classList.add("edit")
    editImg.addEventListener("click", async () => {
        let upToDateList = await listApi.getList(user.id, list.listId);
        console.log(upToDateList);
        editList(upToDateList); // vid klick på edit symbol
        submitDestination(tripDataObj.city);
    });

    let deleteListBtn = document.createElement("img");
    deleteListBtn.src = "../assets/icons/deleteIconGray.png";
    deleteListBtn.style.height = "16px";
    deleteListBtn.classList.add("edit");
    deleteListBtn.addEventListener("click", () => {
        const confirmed = window.confirm("Är du säker på att du vill radera listan?")
        if(confirmed) {
            listApi.deleteList(user.id, list.listId);
            listDOM.remove();
        }
    });
        
    buttonBox.appendChild(editImg)
    buttonBox.appendChild(deleteListBtn);

    listHead.appendChild(listName);
    listHead.appendChild(buttonBox);
    listDOM.appendChild(listHead);
    container.appendChild(listDOM);
}

}

const profileBtn = document.querySelector(".user-profile");
profileBtn.addEventListener("click", () => {
  navigateTo("profile")
})