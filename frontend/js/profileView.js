/* profileView.js 
Syfte: Visa användarens profilsida, där vi ser namn och profilbild, 
en “Create List”-knapp, en “Settings”-knapp, 
samt en lista över användarens befintliga listor som brickor. 
Från denna vy kan man även klicka “Edit” eller “Delete” för varje lista.  

ori: När användaren klickar “profil” i headern anropas navigateTo("profile"). 
Då anropas denna renderProfile(tripDataObj, weatherDataObj). 
Om vi nyss skapat en lista via createList‐vyn, 
skickas tripDataObj och weatherDataObj med, 
vilket i så fall triggar renderNewList och vi lägger direkt till den nya 
'listan i användarens vy. Annars visar vi befintliga listor.

*/

import { UserAPI } from '/client/users-client.js';
import { ListAPI } from '/client/list-client.js';
import { navigateTo } from './router.js';
import { editList } from "./handleListView.js";
import { renderSettingsView } from "./settingsView.js";

const userApi = new UserAPI('http://localhost:8000');
const listApi = new ListAPI('http://localhost:8000');

const imageApiBase = "http://localhost:8000/image";



async function findUser() { //returnera rätt användare
    function getCookie(name) {
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

async function fetchListPic(destination) { //ta en ny bild!
    const res = await fetch(`${imageApiBase}/randomimage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: `${destination}` }),
    });
    return await res.text();
}


//tar in tripdataObj och weatherDataObj
export default async function renderProfile(tripDataObj, weatherDataObj) { //man behöver ej specifia vad man exporterar
    const user = await findUser();
    if (!user) { //om user inte finns
        navigateTo("login") //då får man logga in
        return
    }

    if (tripDataObj && weatherDataObj) { //om tripdataObj och weatherdataobj finns, render ny lista
        //om det liksom skickades med, så kommer det finnas en ny lista och då tar man renderNewList
        renderNewList(user.id, tripDataObj, weatherDataObj); //dvs om vi kommit från att skapa en resa till profilen
    }



    let listData = await listApi.getAllLists(user.id);
    const hasBasicList = listData.some(list => list.listName === "Basic List");
    //ovan säkerställer om användaren har en basic lista, annars så måste man skapa en basic list
    if (!hasBasicList) {
        await listApi.createList(user.id);
        listData = await listApi.getAllLists(user.id); //sötter variablen med det nya
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
        navigateTo("create-list"); //om man klickar createList gå till createList viewn
    })

    const createButtonSettings = document.createElement("button");
    createButtonSettings.id = "settings-button";
    createButtonSettings.textContent = "Settings"; 
    createButtonSettings.addEventListener("click", () => {
        renderSettingsView() //settingsbutton renders
        //OBS! detta är ingen vy, för att den ska vara på profilen!
    })

    profileContainer.appendChild(loadName(user));
    profileContainer.appendChild(createButton);
    profileContainer.appendChild(createButtonSettings);

    loadLists(user.id, allListsContainer); //loada upp alla listor för just den användaren

    async function renderNewList(userId, tripDataObj) { //renderar den nya listan också
        const cover = await fetchListPic(tripDataObj.country); //ger den ett nytt cover
        const listName = tripDataObj.city //ett nytt namn
        const newList = await listApi.createList(userId, listName, tripDataObj.purpose, cover, tripDataObj.vehicle); //skapar listan
        editList(newList.list, tripDataObj); //efter vi skapade den nya listan så kommer vi visa editList
        //detta är för när vi klickar createList, går igenom frågorna så kommer vi först till profile, med tripdata och wather, sen in till edit mode i listan vi nyss skapade
        //så quiz -> profile -> edit mode -> profile när man är klar!
    }

    function loadLists(userId, container) {
        if (listData) {  //om vi har listData, dvs alla listor
            listApi.getAllLists(userId).then((x) => {//Hämta alla för just den användaren

                for (let list of x) { //för varje lista skapa ett listObj med lista och container
                    createListObj(list, container);

                }
            })
        }


    }


    function loadName(user) { //hämtar namnet
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
        if (list.listName === "Basic List") { //ge namnet om de e basic list ge jpg
            let backPic = "../assets/images/backpack.jpg"
            listDOM.style.backgroundImage = `url("${backPic}")`;
            listDOM.style.backgroundSize = "cover";
            listDOM.style.backgroundPosition = "top";
        }
        if (list.cover) { //ge list cover om de finns
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
            //om man vill redigera kommer den först hämta listan (vi får ladda in den igen för den kanske är uppdaterad)
            editList(upToDateList);  //sen går vi in i editList med listan
        });

        let deleteListBtn = document.createElement("img");
        deleteListBtn.src = "../assets/icons/deleteIconGray.png";
        deleteListBtn.style.height = "16px";
        deleteListBtn.classList.add("edit");
        deleteListBtn.addEventListener("click", () => {
            const confirmed = window.confirm("Är du säker på att du vill radera listan?")
            if (confirmed) {
                listApi.deleteList(user.id, list.listId); //raderar listan
                listDOM.remove(); //raderar den från dommen
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
profileBtn.addEventListener("click", () => { //om klicka profil bara ladda om, gå till profil.
    navigateTo("profile")
})