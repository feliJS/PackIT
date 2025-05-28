/* profileView.js */

import { UserAPI } from '/client/users-client.js';
import { ListAPI } from '/client/list-client.js';
import { navigateTo } from './router.js';
import { editList } from "./handleListView.js";

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


export default async function renderProfile(tripData, weatherData) {
    const user = await findUser();
    if (!user) {
        navigateTo("login")
        return
    }
    console.log(tripData);
    console.log(weatherData);
    if(tripData && weatherData) {
        renderNewList(user.id, tripData, weatherData);
    }

    const listData = await listApi.getAllLists(user.id);
    
    
    // DOM OSV.
    const profileViewDOM = document.querySelector(".profile-box")
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
    
    profileContainer.appendChild(loadName(user));
    profileContainer.appendChild(createButton);

    loadLists(user.id, allListsContainer);

    



// Väg från "Create List-mode"

async function renderNewList(userId, tripData, weatherData) {
    const cover = await fetchListPic(tripData.country);
    const listName = tripData.city
    const newList = await listApi.createList(userId, listName, tripData.purpose, cover);
    editList(newList.list, weatherData);
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

function createListObj(list, container) {
    console.log(list.listName);
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
    let editImg = document.createElement("img");
    editImg.src = "../assets/icons/editPng.png";
    editImg.style.height = "16px";
    editImg.id = "edit";
    editImg.addEventListener("click", () => {
        editList(list); // vid klick på edit symbol
    });
    
    listHead.appendChild(listName);
    listHead.appendChild(editImg);
    listDOM.appendChild(listHead);
    container.appendChild(listDOM);
}

}