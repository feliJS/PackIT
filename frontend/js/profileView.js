/* profileView.js */

import { UserAPI } from '/client/users-client.js';
import { ListAPI } from '/client/list-client.js';
import { navigateTo } from './router.js';
const userApi = new UserAPI('http://localhost:8000');
const listApi = new ListAPI('http://localhost:8000');



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




export default async function renderProfile(userId, tripData, weatherData) {
    const user = await findUser();
    if (!user) {
        navigateTo("login")
        return
    }
    const listData = listApi.getAllLists(user.id);
    
    
    // DOM OSV.
    const profileViewDOM = document.querySelector(".profile-box")
    const profileContainer = document.createElement("div");
    profileContainer.classList.add("profileHead")
    const allListsContainer = document.createElement("div");
    allListsContainer.classList.add("allListsContainer");
    profileViewDOM.appendChild(profileContainer);
    profileViewDOM.appendChild(allListsContainer);
    const handleListView = document.getElementById("handleListView");

    const createButton = document.createElement("button");
    createButton.id = "create-list-button";
    createButton.textContent = "Create List";
    
    profileContainer.appendChild(loadName(user.name));
    profileContainer.appendChild(createButton);

    loadLists(user.id, allListsContainer);

    if(tripData && weatherData) {
        renderNewList(userId, tripData, weatherData);
    }



// Väg från "Create List-mode"

function renderNewList(userId, tripData, weatherData) {
    const newList = listApi.createList(userId, tripData.listName, tripData.purpose);
    editList(newList, weatherData);

}

let userIDo = 1;

function loadLists(userIDo, container) {
    //getuserLists
    if (listData) {
        listApi.getAllLists(userIDo).then( (x) => {
            console.log(x)
    
            for (let list of x) {
                createListObj(list, container);
                
            }
            console.log(createListObj)
    
        } )
    }
   

}



function createListObj(list, container) {
    const listDOM = document.createElement("div");
    listDOM.classList.add("listContainer");
    let listHead = document.createElement("div");
    listHead.classList.add("listHead")
    let listName = document.createElement("h3");
    listName.classList.add("listname");
    listName.textContent = list.listName;
    let editImg = document.createElement("img");
    editImg.src = "../assets/icons/editPng.png";
    editImg.style.height = "16px";
    editImg.id = "edit";
    editImg.addEventListener("click", function (e) {
        let testList = listData.filter(list => list.listId == 1);
        console.log(testList);
        editList(testList);
    })
    
    listHead.appendChild(listName);
    listHead.appendChild(editImg);
    listDOM.appendChild(listHead);
    container.appendChild(listDOM);
}

function loadName (name) {
    const message = `Welcome ${name}`;
    const nameDiv = document.createElement("div");
    nameDiv.classList.add("nameDiv");
    const h2 = document.createElement("h2");
    h2.textContent = message;
    nameDiv.appendChild(h2);
    return nameDiv;
}


function createItem(item) {
    let itemDiv = document.createElement("div");
    itemDiv.classList.add("itemDiv");

    const check = document.createElement("input")
    check.setAttribute("type","checkbox");
    check.classList.add("checkbox");
    itemDiv.appendChild(check)

    const p = document.createElement("p");
    p.textContent = item.itemName;
    p.style.margin = "1px";
    itemDiv.appendChild(p);

    const quantDiv = document.createElement("div");
    quantDiv.style.display = "grid";
    quantDiv.style.gridTemplateColumns = "16px 1fr 1fr";

    quantDiv.style.alignItems = "center";
    quantDiv.style.gap = "4px";
    const quant = document.createElement("p");
    quant.style.margin = "0";
    quant.textContent = item.itemQuantity;
    quantDiv.appendChild(quant);

    const addBtn = document.createElement("button");
    addBtn.id = "addBtn";
    const png = document.createElement("img");
    png.src = "../assets/icons/plus.png";
    png.style.height = "8px";
    png.style.width = "8px";
    addBtn.appendChild(png);
    quantDiv.appendChild(addBtn);
    itemDiv.appendChild(quantDiv);
    addBtn.addEventListener("click", () => {
        item.itemQuantity++;
        quant.textContent = item.itemQuantity;
    });

    const reduceBtn = document.createElement("button");
    reduceBtn.id = "reduceBtn";
    const minPng = document.createElement("img");
    minPng.src = "../assets/icons/minus.png";
    minPng.style.width = "8px";
    reduceBtn.appendChild(minPng);
    quantDiv.appendChild(reduceBtn);
    reduceBtn.addEventListener("click", () => {
        if (item.itemQuantity > 0) {
        item.itemQuantity--;
        quant.textContent = item.itemQuantity;
        }
        
    });
    
    const removeBtn = document.createElement("div");
    removeBtn.classList.add("textBtn");
    removeBtn.textContent = "Remove";
    itemDiv.appendChild(removeBtn);
    ///--- REMOVEBTN-LYSSNARE
    removeBtn.addEventListener("click", () => {
        itemDiv.remove();
    })
    
    return itemDiv;
}


function editList (list, weatherData) {
    handleListView.classList.add("active");
    handleListView.innerHTML = "";
    let listContainer = document.createElement("div");
    listContainer.id = "editList";
    let listName = list[0].listName;
    let p = document.createElement("p");
    p.textContent = `${listName}`;
    listContainer.appendChild(p);

    let doneBtn = document.createElement("button");
    doneBtn.textContent = "Done";
    doneBtn.id = "doneBtn";
    listContainer.appendChild(doneBtn);

    doneBtn.addEventListener("click", () => {
        handleListView.classList.remove("active");
    })

    let itemBox = document.createElement("div");
    itemBox.id ="inner";
    let types = [... new Set(list[0].listItems.map(item => item.itemType))];
    let containers = {};
    for (let type of types) {
        let box = document.createElement("div");
        box.classList.add("type");
        box.id = `${type}`;

        let p = document.createElement("p");
        p.textContent = type[0].toUpperCase() + type.slice(1) + ":";
        box.appendChild(p);

        const itemsContainer = document.createElement("div");
        itemsContainer.classList.add("itemContainer");
        box.appendChild(itemsContainer);
        
        const inputDiv = document.createElement("div");
        inputDiv.classList.add("itemDiv");
        inputDiv.style.marginTop = "8px";
        const img = document.createElement("img");
        img.src = "../assets/Icons/plus.png";
        img.style.height = "8px";
        img.style.width = "8px";
        img.style.paddingLeft = "8px";
        inputDiv.appendChild(img);

        const input = document.createElement("input");
        input.classList.add("addItemInput");
        input.placeholder = "Add item";
        inputDiv.appendChild(input);

        const addItemBtn = document.createElement("div");
        addItemBtn.textContent = "Add item";
        addItemBtn.classList.add("textBtn")
        addItemBtn.style.width = "60px";
        addItemBtn.style.gridColumn = "span 2";
        inputDiv.appendChild(addItemBtn);
        
        ///ADDITEM-LYSSNARE
        addItemBtn.addEventListener("click", () => {
            const itemName = input.value.trim();
            if (!itemName) { return };
            input.value = "";
            const itemType = type;

            const newItem = {
                itemType: itemType,
                itemName: itemName,
                itemQuantity: 1
            };
            console.log(`Skapa item:`, newItem);

            const itemDiv = createItem(newItem);
            containers[itemType].itemsContainer.appendChild(itemDiv);
        })

        box.appendChild(inputDiv);

        containers[type] = {
            box: box,
            itemsContainer: itemsContainer,
            input: input
        };
        itemBox.appendChild(box);

    }

    for (let item of list[0].listItems){
        const container = containers[item.itemType]
        if(container) {
            let itemDiv = createItem(item);
     
            container.itemsContainer.appendChild(itemDiv);
        }
        
    }
    listContainer.appendChild(itemBox);
    handleListView.appendChild(listContainer);

    /// ABOUT
    const aboutBox = document.createElement("div");
    aboutBox.id = "aboutBox";
    
    const label = document.createElement("div");
    label.id = "aboutLabel";
    label.textContent = "ABOUT";
    aboutBox.appendChild(label);

    const weatherCard = document.createElement("div");
    weatherCard.classList.add("aboutCard", "weather");
    if(weatherData) {
        weatherCard.innerHTML = `
        <div>Weather</div>
        <div><span style="font-weight: normal;">${weatherData.temperature}°</span> Sunny</div>
        `;

    } else {
        weatherCard.innerHTML =`
        <div>Weather</div>
        <div><span style="font-weight: normal;">-</span> Sunny</div>
        `;
    }
    
    aboutBox.appendChild(weatherCard);

    const timeCard = document.createElement("div");
    timeCard.classList.add("aboutCard");
    //här lokal tid?
    timeCard.innerHTML = `
        <div>Local time</div>
        <div><span style="font-size: 2rem;">8:30</span></div>
        `;
    aboutBox.appendChild(timeCard);

    const bagCard = document.createElement("div");
    bagCard.classList.add("aboutCard", "bag");
    bagCard.innerHTML =`
        <div>Recommended bag:</div>
        <div>Cabin Bag</div>
        `;
    aboutBox.appendChild(bagCard);

    handleListView.appendChild(aboutBox);
}
}