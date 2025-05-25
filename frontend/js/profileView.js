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


const profileViewDOM = document.getElementById("profileBox");
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
        editImg.classList.add("edit");
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

function editList (list) {
    handleListView.classList.add("active");
    let listContainer = document.createElement("div");
    listContainer.id = "editList";
    let listName = list[0].listName;
    let p = document.createElement("p");
    p.textContent = `${listName}`;
    listContainer.appendChild(p);
    let itemBox = document.createElement("div");
    itemBox.id ="inner";
    let types = [... new Set(list[0].listItems.map(item => item.itemType))];
    let containers = {};
    for (let type of types) {
        let box = document.createElement("div");
        box.classList.add("type");
        box.id = `${type}`;
        let p = document.createElement("p");
        p.textContent = type[0].toUpperCase() + type.slice(1);
        box.appendChild(p);
        itemBox.appendChild(box);
        containers[type] = box;
    }
    console.log(containers);
    for (let item of list[0].listItems){
        const container = containers[item.itemType]
        if(container) {
            let itemDiv = createItem(item);
     
            container.appendChild(itemDiv);
        }
        
    
}

