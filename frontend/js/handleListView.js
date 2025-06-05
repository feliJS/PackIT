import { ListAPI } from "/client/list-client.js";
import { submitDestination } from "./createlistView.js";
import renderProfile from "./profileView.js";

const listApi = new ListAPI("http://localhost:8000"); //konstruktorn! baseURL


export async function editList(list) { //tar emot själva list objektet 
    const weatherDataObj = await submitDestination(list.listName);//funktionen hämtar väderdata från staden

    const handleListView = document.createElement("div");
    handleListView.id = "handleListView";
    document.querySelector("#app").appendChild(handleListView);

    handleListView.classList.add("active"); //lägger till klassen active
    handleListView.innerHTML = "";

    let listContainer = document.createElement("div");
    listContainer.id = "editList";

    let listName = list.listName;
    let p = document.createElement("p");
    p.textContent = `${listName}`;
    listContainer.appendChild(p);

    let doneBtn = document.createElement("button");
    doneBtn.textContent = "Done";
    doneBtn.id = "doneBtn";
    listContainer.appendChild(doneBtn);

    doneBtn.addEventListener("click", () => {
        handleListView.classList.remove("active"); //tar bort klassen active
        handleListView.style.display = "none";
        renderProfile();
    });

    let itemBox = document.createElement("div");
    itemBox.id = "inner";

    let types = [...new Set(list.listItems.map((item) => item.itemType || "other"))];
    //list.listItems.map((item) => item.itemType || "other") - fast alla items fast itemtype
    //types är bara en array av alla typer som finns (clothes, hygein och allt sånt)
    //set var en lista som inte kan ha duplicates, 
    let containers = {}; //detta är för att lägga in rätt item i rätt kateogri

    for (let type of types) { //för varje typ då så får man ju skapa en div som kommer hålla i dem
        let box = document.createElement("div");
        box.classList.add("type");
        box.id = `${type}`;

        let p = document.createElement("p");
        p.textContent = type[0].toUpperCase() + type.slice(1) + ":"; //ja få det i stor bokstav i början
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
        addItemBtn.classList.add("textBtn");
        addItemBtn.style.width = "60px";
        addItemBtn.style.gridColumn = "span 2";
        inputDiv.appendChild(addItemBtn);

        addItemBtn.addEventListener("click", async () => {
            const itemName = input.value.trim(); //ja men såhär ta bort mellanslag
            if (!itemName) return; //om inte ngt nytt item return
            input.value = ""; //input värde rensat

            const userId = list.userId;
            const listId = list.listId;

            const added = await listApi.addItem(userId, listId, box.id, itemName, 1); //add item
            if (added) { //om de gick bra lägg till det i domen
                const itemDiv = createItem(added.item, list);
                itemsContainer.appendChild(itemDiv);
            }

        });

        box.appendChild(inputDiv);

        containers[type] = { //typen (clothes t ex)
            box, //hela boxen för liksom hela typen
            itemsContainer, //alla items
            input, //själva input
        };
        itemBox.appendChild(box);
    }

    for (let item of list.listItems) { //denna kommer faktiskt lägga till allting på skärmen
        const container = containers[item.itemType]; //så gå igenom alla items och lägg in dem en och en vilken typ
        if (container) { //om container finns så skapa itemet där, och lägg till dem
            const itemDiv = createItem(item, list); //skapa itemsen liksom så man ser dem
            container.itemsContainer.appendChild(itemDiv);
        }
    }

    listContainer.appendChild(itemBox);
    handleListView.appendChild(listContainer);

    // ABOUT
    const aboutBox = document.createElement("div");
    aboutBox.id = "aboutBox";

    const label = document.createElement("div");
    label.id = "aboutLabel";
    label.textContent = "ABOUT";
    aboutBox.appendChild(label);

    const weatherCard = document.createElement("div");
    weatherCard.classList.add("aboutCard", "weather");
    weatherCard.innerHTML = `<div>Weather</div><div><span style="font-weight: normal;">${weatherDataObj.temperature}°</span>${weatherDataObj.weatherDescriptions}</div>`
    aboutBox.appendChild(weatherCard);

    const timeCard = document.createElement("div");
    timeCard.classList.add("aboutCard");
    timeCard.innerHTML = `<div>Local time</div><div><span style="font-size: 2rem;">${weatherDataObj.localTime.split(" ")[1]}</div>`;
    aboutBox.appendChild(timeCard);

    let recommendedBag = list.bag;
    if (!recommendedBag) {
        recommendedBag = "Cabin Bag";
    }

    const bagCard = document.createElement("div");
    bagCard.classList.add("aboutCard", "bag");
    bagCard.innerHTML = `<div>Recommended bag:</div><div>${recommendedBag}</div>`;
    aboutBox.appendChild(bagCard);

    handleListView.appendChild(aboutBox);
}


export function createItem(item, list) { //skapa en item liksom dom
    let itemDiv = document.createElement("div");
    itemDiv.classList.add("itemDiv");

    const check = document.createElement("input");
    check.setAttribute("type", "checkbox");
    check.classList.add("checkbox");
    itemDiv.appendChild(check);

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

    addBtn.addEventListener("click", async () => { //lägg mer till på itemquantitiy
        item.itemQuantity++;
        quant.textContent = item.itemQuantity;
        await listApi.updateItem(list.userId, list.listId, item.itemId, { //uppdatera itemquan
            itemQuantity: item.itemQuantity,
        });
    });

    const reduceBtn = document.createElement("button");
    reduceBtn.id = "reduceBtn";
    const minPng = document.createElement("img");
    minPng.src = "../assets/icons/minus.png";
    minPng.style.width = "8px";
    reduceBtn.appendChild(minPng);
    quantDiv.appendChild(reduceBtn);

    reduceBtn.addEventListener("click", async () => { //ta bort
        if (item.itemQuantity > 0) { //om större än noll
            item.itemQuantity--; //minus minus
            quant.textContent = item.itemQuantity;
            await listApi.updateItem(list.userId, list.listId, item.itemId, {
                itemQuantity: item.itemQuantity,
            });
        }
    });

    itemDiv.appendChild(quantDiv);

    const removeBtn = document.createElement("div");
    removeBtn.classList.add("textBtn");
    removeBtn.textContent = "Remove";
    itemDiv.appendChild(removeBtn);

    removeBtn.addEventListener("click", async () => { //remove btn
        await listApi.deleteItem(list.userId, list.listId, item.itemId);
        itemDiv.remove();
    });

    return itemDiv;
}


