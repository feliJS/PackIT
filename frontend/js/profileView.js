// import { UserAPI } from '/common/client-class.js';
// const userApi = new UserAPI('http://localhost:8000');

// function getCookie(name) { //hittar rätt cookie
//     return document.cookie
//         .split('; ')
//         .find(cookie => cookie.startsWith(name + "="))
//         ?.split('=')[1] || null;
// }

// const sessionId = getCookie("session_id");

// const nameText = document.querySelector(".profileName");
// if (sessionId) {
//     userApi.getSpecificUser(sessionId).then(user => {
//                     nameText.textContent = `@${user.name}`;
//         })
// }
// else{
//     window.location.href = "/"; 
// }

/// --- placeholders
const userID = 0;
const userName = "Name";
const listData = [ {
        userId: 0,
        listId: 1,
        listName: "Basic List",
        listItems: [
            {
                itemId: 1,
                itemType: "clothes",
                itemName: "Socks",
                itemQuantity: 5
            },
            {
                itemId: 2,
                itemType: "clothes",
                itemName: "Underwear",
                itemQuantity: 5
            },
            {
                itemId: 3,
                itemType: "clothes",
                itemName: "Shirts",
                itemQuantity: 3
            },
            {
                itemId: 4,
                itemType: "clothes",
                itemName: "Pants",
                itemQuantity: 2
            },
            {
                itemId: 5,
                itemType: "clothes",
                itemName: "Sleepwear",
                itemQuantity: 1
            },
            {
                itemId: 6,
                itemType: "clothes",
                itemName: "Sweater",
                itemQuantity: 1
            },
            {
                itemId: 7,
                itemType: "hygiene",
                itemName: "Toothbrush",
                itemQuantity: 1
            },
            {
                itemId: 8,
                itemType: "hygiene",
                itemName: "Toothpaste",
                itemQuantity: 1
            },
            {
                itemId: 9,
                itemType: "hygiene",
                itemName: "Deodorant",
                itemQuantity: 1
            },
            {
                itemId: 10,
                itemType: "hygiene",
                itemName: "Shampoo",
                itemQuantity: 1
            },
            {
                itemId: 11,
                itemType: "hygiene",
                itemName: "Soap",
                itemQuantity: 1
            },
            {
                itemId: 12,
                itemType: "hygiene",
                itemName: "Hairbrush",
                itemQuantity: 1
            },
            {
                itemId: 13,
                itemType: "medication",
                itemName: "Painkillers",
                itemQuantity: 1
            },
            {
                itemId: 14,
                itemType: "medication",
                itemName: "Plasters",
                itemQuantity: 1
            },
            {
                itemId: 15,
                itemType: "medication",
                itemName: "Personal prescriptions",
                itemQuantity: 1
            },
            {
                itemId: 16,
                itemType: "other",
                itemName: "Passport",
                itemQuantity: 1
            },
            {
                itemId: 17,
                itemType: "other",
                itemName: "Traveldocuments",
                itemQuantity: 1
            },
            {
                itemId: 18,
                itemType: "other",
                itemName: "Phone",
                itemQuantity: 1
            },
            {
                itemId: 19,
                itemType: "other",
                itemName: "Charger",
                itemQuantity: 1
            },
            {
                itemId: 20,
                itemType: "other",
                itemName: "Headphones",
                itemQuantity: 1
            },
            {
                itemId: 21,
                itemType: "other",
                itemName: "Waterbottle",
                itemQuantity: 1
            },
            {
                itemId: 22,
                itemType: "other",
                itemName: "Wallet",
                itemQuantity: 1
            }
        ]
    },
    {
        userId: 0,
        listId: 2,
        listName: "Suntrip List",
        listItems: [
            {
                itemId: 1,
                itemType: "clothes",
                itemName: "Swimwear",
                itemQuantity: 2
            },
            {
                itemId: 2,
                itemType: "clothes",
                itemName: "Flip-flops",
                itemQuantity: 1
            },
            {
                itemId: 3,
                itemType:  "clothes",
                itemName: "Sun hat / Cap",
                itemQuantity: 1
            },
            {
                itemId: 4,
                itemType:  "clothes",
                itemName: "Sarong or beach cover-up",
                itemQuantity: 1
            },
            {
                itemId: 5,
                itemType: "clothes",
                itemName: "Evening outfit",
                itemQuantity: 1
            },
            {
                itemId: 6,
                itemType:  "hygiene",
                itemName: "Sunscreen",
                itemQuantity: 1
            },
            {
                itemId: 7,
                itemType:  "hygiene",
                itemName: "After sun lotion",
                itemQuantity: 1
            },
            {
                itemId: 8,
                itemType: "hygiene",
                itemName:  "SPF-lip balm",
                itemQuantity: 1
            },
            {
                itemId: 9,
                itemType: "medication",
                itemName: "Stomach medicine",
                itemQuantity: 1
            },
            {
                itemId: 10,
                itemType: "other",
                itemName: "Sunglasses",
                itemQuantity: 1
            },
            {
                itemId: 11,
                itemType: "other",
                itemName: "Beach bag",
                itemQuantity: 1
            },
            {
                itemId: 12,
                itemType: "other",
                itemName: "Beach towel",
                itemQuantity: 1
            },
            {
                itemId: 13,
                itemType: "other",
                itemName: "Portable fan",
                itemQuantity: 1
            }
        ]
    },
    {
        userId: 0,
        listId: 2,
        listName: "New York-25",
        listItems: [
            {
                itemId: 1,
                itemType: "clothes",
                itemName: "Swimwear",
                itemQuantity: 2
            },
            {
                itemId: 2,
                itemType: "clothes",
                itemName: "Flip-flops",
                itemQuantity: 1
            },
            {
                itemId: 3,
                itemType:  "clothes",
                itemName: "Sun hat / Cap",
                itemQuantity: 1
            },
            {
                itemId: 4,
                itemType:  "clothes",
                itemName: "Sarong or beach cover-up",
                itemQuantity: 1
            },
            {
                itemId: 5,
                itemType: "clothes",
                itemName: "Evening outfit",
                itemQuantity: 1
            },
            {
                itemId: 6,
                itemType:  "hygiene",
                itemName: "Sunscreen",
                itemQuantity: 1
            },
            {
                itemId: 7,
                itemType:  "hygiene",
                itemName: "After sun lotion",
                itemQuantity: 1
            },
            {
                itemId: 8,
                itemType: "hygiene",
                itemName:  "SPF-lip balm",
                itemQuantity: 1
            },
            {
                itemId: 9,
                itemType: "medication",
                itemName: "Stomach medicine",
                itemQuantity: 1
            },
            {
                itemId: 10,
                itemType: "other",
                itemName: "Sunglasses",
                itemQuantity: 1
            },
            {
                itemId: 11,
                itemType: "other",
                itemName: "Beach bag",
                itemQuantity: 1
            },
            {
                itemId: 12,
                itemType: "other",
                itemName: "Beach towel",
                itemQuantity: 1
            },
            {
                itemId: 13,
                itemType: "other",
                itemName: "Portable fan",
                itemQuantity: 1
            }
        ]
    },
    {
        userId: 0,
        listId: 2,
        listName: "Göteborg",
        listItems: [
            {
                itemId: 1,
                itemType: "clothes",
                itemName: "Swimwear",
                itemQuantity: 2
            },
            {
                itemId: 2,
                itemType: "clothes",
                itemName: "Flip-flops",
                itemQuantity: 1
            },
            {
                itemId: 3,
                itemType:  "clothes",
                itemName: "Sun hat / Cap",
                itemQuantity: 1
            },
            {
                itemId: 4,
                itemType:  "clothes",
                itemName: "Sarong or beach cover-up",
                itemQuantity: 1
            },
            {
                itemId: 5,
                itemType: "clothes",
                itemName: "Evening outfit",
                itemQuantity: 1
            },
            {
                itemId: 6,
                itemType:  "hygiene",
                itemName: "Sunscreen",
                itemQuantity: 1
            },
            {
                itemId: 7,
                itemType:  "hygiene",
                itemName: "After sun lotion",
                itemQuantity: 1
            },
            {
                itemId: 8,
                itemType: "hygiene",
                itemName:  "SPF-lip balm",
                itemQuantity: 1
            },
            {
                itemId: 9,
                itemType: "medication",
                itemName: "Stomach medicine",
                itemQuantity: 1
            },
            {
                itemId: 10,
                itemType: "other",
                itemName: "Sunglasses",
                itemQuantity: 1
            },
            {
                itemId: 11,
                itemType: "other",
                itemName: "Beach bag",
                itemQuantity: 1
            },
            {
                itemId: 12,
                itemType: "other",
                itemName: "Beach towel",
                itemQuantity: 1
            },
            {
                itemId: 13,
                itemType: "other",
                itemName: "Portable fan",
                itemQuantity: 1
            }
        ]
    },
    {
        userId: 0,
        listId: 2,
        listName: "Göteborg",
        listItems: [
            {
                itemId: 1,
                itemType: "clothes",
                itemName: "Swimwear",
                itemQuantity: 2
            },
            {
                itemId: 2,
                itemType: "clothes",
                itemName: "Flip-flops",
                itemQuantity: 1
            },
            {
                itemId: 3,
                itemType:  "clothes",
                itemName: "Sun hat / Cap",
                itemQuantity: 1
            },
            {
                itemId: 4,
                itemType:  "clothes",
                itemName: "Sarong or beach cover-up",
                itemQuantity: 1
            },
            {
                itemId: 5,
                itemType: "clothes",
                itemName: "Evening outfit",
                itemQuantity: 1
            },
            {
                itemId: 6,
                itemType:  "hygiene",
                itemName: "Sunscreen",
                itemQuantity: 1
            },
            {
                itemId: 7,
                itemType:  "hygiene",
                itemName: "After sun lotion",
                itemQuantity: 1
            },
            {
                itemId: 8,
                itemType: "hygiene",
                itemName:  "SPF-lip balm",
                itemQuantity: 1
            },
            {
                itemId: 9,
                itemType: "medication",
                itemName: "Stomach medicine",
                itemQuantity: 1
            },
            {
                itemId: 10,
                itemType: "other",
                itemName: "Sunglasses",
                itemQuantity: 1
            },
            {
                itemId: 11,
                itemType: "other",
                itemName: "Beach bag",
                itemQuantity: 1
            },
            {
                itemId: 12,
                itemType: "other",
                itemName: "Beach towel",
                itemQuantity: 1
            },
            {
                itemId: 13,
                itemType: "other",
                itemName: "Portable fan",
                itemQuantity: 1
            }
        ]
    }
];

const profileViewDOM = document.getElementById("profileView");
const profileContainer = document.createElement("div");
profileContainer.classList.add("profileHead")
const allListsContainer = document.createElement("div");
allListsContainer.classList.add("allListsContainer");
profileViewDOM.appendChild(profileContainer);
profileViewDOM.appendChild(allListsContainer);
const handleListView = document.getElementById("handleListView");




function loadLists(userID, listDB) {
    //getuserLists
    const userLists = listDB.filter((list) => list.userId === userID)
    for (let list of userLists) {
        
        let listDOM = document.createElement("div");
        listDOM.classList.add("listContainer");
        let listHead = document.createElement("div");
        listHead.classList.add("listHead")
        let listName = document.createElement("h3");
        listName.classList.add("listname");
        listName.textContent = list.listName;
        let editImg = document.createElement("img");
        editImg.src = "frontend/assets/icons/editPng.png";
        editImg.style.height = "16px";
        editImg.id = "edit";
        editImg.addEventListener("click", function (e) {
            let testList = listData.filter(list => list.listId == 1);
            console.log(testList);
            editList(testList)
        })
        

        listHead.appendChild(listName);
        listHead.appendChild(editImg);
        listDOM.appendChild(listHead);
        allListsContainer.appendChild(listDOM);

    }
}


function loadName (name) {
    const message = `Welcome ${name}`;
    const nameDiv = document.createElement("div");
    nameDiv.classList.add("nameDiv");
    const h2 = document.createElement("h2");
    h2.textContent = message;
    nameDiv.appendChild(h2);
    profileContainer.appendChild(nameDiv);
}
loadName(userName);
const createButton = document.createElement("button");
createButton.id = "create-list-button";
createButton.textContent = "Create List";
profileContainer.appendChild(createButton);

loadLists(userID, listData);

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

    const addBtn = document.createElement("div");
    addBtn.id = "addBtn";
    const png = document.createElement("img");
    png.src = "frontend/assets/Icons/plus.png";
    png.style.height = "8px";
    png.style.width = "8px";
    addBtn.appendChild(png);
    quantDiv.appendChild(addBtn);
    itemDiv.appendChild(quantDiv);
    addBtn.addEventListener("click", () => {
        item.itemQuantity++;
        quant.textContent = item.itemQuantity;
    });

    const reduceBtn = document.createElement("div");
    reduceBtn.id = "reduceBtn";
    const minPng = document.createElement("img");
    minPng.src = "frontend/assets/icons/minus.png";
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

    removeBtn.addEventListener("click", () => {
        itemDiv.remove();
    })
    
    return itemDiv;
}


function editList (list) {
    handleListView.classList.add("active");
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
        img.src = "frontend/assets/Icons/plus.png";
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
    //här hämta info om vädret
    weatherCard.innerHTML = `
        <div>Weather</div>
        <div><span style="font-weight: normal;">17°</span> Sunny</div>
        `;
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



