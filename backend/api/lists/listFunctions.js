
/* listFunctions.js */

const DB_PATH = "../databaser/lists.json";

function saveDB(listDB) {
    return Deno.writeTextFile(DB_PATH, JSON.stringify(listDB));
}

//används för att ge en grundläggande basic list! som alla får i början
function createBasicList(urlUserId, listDB) {
    //letar efter defaultBasic som finns i listDB som har userId 0 och heter basic list
    //Lite hård kodad, man hade kanske kunnat skapa listan här som en funktion istället?
    //eller något liknande...
    const defaultBasic = listDB.find(l => //hitta basic list i DB
        l.userId === 0 &&
        l.listName.toLowerCase() === "basic list"
    );

    if (!defaultBasic) { //om den ej finns, så får vi ju kasta en error!
        throw new Error("Default basic list not found");
    }
    //den hittar högsta listId:et av listDB och adderar med 1 för att få ett unikt listId
    //listDB.map() - kommer skapa en array med alla listId och math.max väljer största
    //OBS! math max tar EJ emot arrayer! därför gör vi spreading saken för att liksom lägga alla nummer direkt!
    const basicListId = Math.max(...listDB.map(l => l.listId)) + 1;
    //detta ovan är för att vi vill skapa en ny basic list till den nya användaren
    //så dem får sin egna basic list! allas kommer se olika ut IFALL man redigerar listan
    //men! dem ser lika ut alltid i början. dock får ju alla en unik!

    const newBasicList = {
        userId: Number(urlUserId), //urluserid blir ditt id som du har
        listId: basicListId, //det nya idet
        listName: "Basic List", //namnet!
        listItems: JSON.parse(JSON.stringify(defaultBasic.listItems))
        //ovan kopierar alla items som finns från defaultBasic (den listan som är 0 i vår DB)
        //och lägger dem i vår nya lista!
        //ehm parse stringfy:::

        //"Skapa en helt ny kopia av defaultBasic.listItems, så att om användaren senare lägger till, tar bort eller ändrar i sin lista, så påverkar det inte mall-datan (userId: 0)."
    };

    listDB.push(newBasicList); //pushar detta 
    return newBasicList; //returnerar newBasicList
}
// /users/:userId/lists
// (POST) - skapa en ny lista efter alla steg användaren klickat sig genom
export async function createListFunc(urlUserId, reqBody, listDB, responseHeaders) {
 /*Destrukturerar JSON‐body och förväntar sig fyra fält:

        listName: t.ex. stad eller namn på listan.

        purpose: ett nummer (1, 2 eller 3) som representerar typ av resa (t.ex. solresa, affärsresa, wellness).

        cover: URL till en omslagsbild.

        vehicle: ett nummer (1, 2 eller 3) som representerar om användaren tar backpack, cabin bag eller sportväska. */
  
    const { listName, purpose, cover, vehicle } = reqBody;

    //om du dock inte skickar med listname eller purpose eller något annat.. är det lite 
    //"förutsatt att du kommer göra en basic list"- du gör inte
    //"själva quizen" om man säger så?
    if (!listName && !purpose && !cover && !vehicle) {
             let userBasicList = listDB.find(l => //leta reda på om user har en basic lista 
            l.userId === Number(urlUserId) && //då vill vi säkerställa ifall användaren har gjort en basic lsit
            l.listName.toLowerCase() === "basic list"
        );

        if (!userBasicList) { //om man ej har en basicList, skapa en ny! och spara till databasen.
            userBasicList = createBasicList(urlUserId, listDB);
            await saveDB(listDB);
        }
        //denna skapar sedan en basic lista! för alla måste ha en från början,,
        //detta är t ex när du loggar in för första gången
        return new Response(JSON.stringify({ message: "Basic list created", list: userBasicList }), {
            status: 201,
            headers: { ...responseHeaders }
        });
    }
    //om du dock hade med dig parametrarna i reqbodyn- bra.. då har du 
    //"gjort quizen!"

    // olika purpose som finns som mallar i DB
    const purposeMap = {
        1: "Suntrip List",
        2: "Business List",
        3: "Wellness/activities List"
    };
    //det som motsvarar vilken typ av purpose det var, från reqbodyn.

    const mappedPurposeName = purposeMap[purpose];

    //en inre funktion som kommer ge dig vilken typ av väska
    function getRecommendedBag(vehicle) {
        //default är cabin bag.
        switch (vehicle) {
            case 1: return "Backpack";
            case 2: return "Cabin Bag";
            case 3: return "Sportbag";
            default: return "Cabin Bag";
        }
    }
    //sen får du ut just din recommended bag.
    const recommendedBag = getRecommendedBag(Number(vehicle));

    let userBasicList = listDB.find(l => //om användaren redan har en basic list!
        l.userId === Number(urlUserId) && //alla användare har ju en grund mall
        l.listName.toLowerCase() === "basic list" //som man sedan lägger en annan mall på!
    );

    if (!userBasicList) { //eller om den ej ha skapa den..
        userBasicList = createBasicList(urlUserId, listDB);
    }


    const typeTemplate = listDB.find(l => //här ska man hitta rätt template beroende
        l.userId === 0 && //på vilken purpose- så det är den som bestämmer
        l.listName.toLowerCase() === mappedPurposeName.toLowerCase()
    );//vilken typ av lista man egentligen får basic + mappedpurposeListan då

    if (!typeTemplate) { //en check för o se om du kunde hämta den
        return new Response(JSON.stringify({ error: "Purpose template not found" }), {
            status: 404,
            headers: { ...responseHeaders }
        });
    }


    // Hittar det högsta befintliga listId i hela listDB‐arrayen och adderar 1 för att få ett unikt ID för den nya listan.
    const newListId = Math.max(...listDB.map(l => l.listId)) + 1;

    const newList = { //skapa den nya listan!
        userId: Number(urlUserId),
        listId: newListId,
        listName: listName, // <-- stadens namn
        listItems: [...userBasicList.listItems, ...typeTemplate.listItems],
        //ha kvar listItems från userbasiclist...
        cover: cover,
        bag: recommendedBag
    };

    listDB.push(newList);
    await saveDB(listDB);

    return new Response(JSON.stringify({ message: "List created", list: newList }), {
        status: 201,
        headers: { ...responseHeaders }
    });
}


// (GET) - hämta alla listor för en userId (behövs till profilsidan för att displaya alla listor)
export async function getAllListsFunc(urlUserId, listDB, responseHeaders) {
    //: filtrerar alla listor som tillhör den angivna användaren (observera att == jämför sträng/tal).
    const userLists = listDB.filter(list => list.userId == urlUserId);

    return new Response(JSON.stringify(userLists), {
        status: 200,
        headers: { ...responseHeaders }
    });
}

2
// /users/:userId/lists/:listId
// (GET) - hämta en lista
export async function getListFunc(urlUserId, urlListId, listDB, responseHeaders) {
    //Letar efter ett listobjekt där både userId och listId matchar de angivna parametrarna.
    const foundList = listDB.find(currList => currList.userId == urlUserId && currList.listId == urlListId);

    if (foundList) {
        return new Response(JSON.stringify(foundList), {
            status: 200,
            headers: { ...responseHeaders }
        });
    }

    return new Response(JSON.stringify({ error: "No list found" }), {
        status: 404,
        headers: { ...responseHeaders }
    });
}

// (DELETE) - radera en lista
export async function deleteListFunc(urlUserId, urlListId, listDB, responseHeaders) {
    //etar upp indexet för den lista som matchar båda userId och listId.
    const listInx = listDB.findIndex(currList => currList.userId == urlUserId && currList.listId == urlListId);

    if (listInx === -1) {
        return new Response(JSON.stringify({ error: "List not found" }), {
            status: 404,
            headers: { ...responseHeaders }
        });
    }

    const deletedList = listDB.splice(listInx, 1);

    await saveDB(listDB);

    return new Response(JSON.stringify({ message: "Delete OK", deletedList }), {
        status: 200,
        headers: { ...responseHeaders }
    });
}





// --- ITEMS ---

// /users/:userId/lists/:listId/items
// (POST) - lägg till ett item
export async function addItemFunc(reqBody, urlUserId, urlListId, listDB, responseHeaders) {
    const foundList = listDB.find(currList => currList.userId == urlUserId && currList.listId == urlListId);

    if (!foundList) {
        return new Response(JSON.stringify({ error: "List not found" }), {
            status: 404,
            headers: { ...responseHeaders }
        });
    }

    const existingItem = foundList.listItems.some(currItem => currItem.itemName === reqBody.itemName);

    if (existingItem) {
        return new Response(JSON.stringify({ error: "Item already exists" }), {
            status: 409,
            headers: { ...responseHeaders }
        });
    }
    /**Om foundList.listItems.length > 0, loopa igenom alla itemId i foundList.listItems och hitta det högsta (highestId) för att sätta newItemId = highestId + 1.

    Annars (om ingen item finns i listan), sätt newItemId = 1.

    Detta säkerställer unika, löpande itemId inom en lista. */
    let newItemId;
    if (foundList.listItems.length > 0) {
        let highestId = 0;

        for (let i = 0; i < foundList.listItems.length; i++) {
            let currentId = foundList.listItems[i].itemId;
            if (currentId > highestId) {
                highestId = currentId;
            }
        }

        newItemId = highestId + 1;
    } else {
        newItemId = 1;
    }
    /**Skapar det nya item‐objektet baserat på reqBody‐fälten: typ 
     * (t.ex. “clothes”, “hygiene”), namn (t.ex. “Socks”), mängd (antal).

 */
    const newItem = {
        itemId: newItemId,
        itemType: reqBody.itemType,
        itemName: reqBody.itemName,
        itemQuantity: reqBody.itemQuantity
    };

    foundList.listItems.push(newItem);

    await saveDB(listDB);

    return new Response(JSON.stringify({ message: "Item added successfully", item: newItem }), {
        status: 201,
        headers: { ...responseHeaders }
    });
}

// (GET) Alla items i en lista (används för att displaya listan)
export async function getAllItemsFunc(urlUserId, urlListId, listDB, responseHeaders) {
    const foundList = listDB.find(currList => currList.userId == urlUserId && currList.listId == urlListId);

    if (!foundList) {
        return new Response(JSON.stringify({ error: "List not found" }), {
            status: 404,
            headers: { ...responseHeaders }
        });
    }

    return new Response(JSON.stringify(foundList.listItems), {
        status: 200,
        headers: { ...responseHeaders }
    });
}


// /users/:userId/lists/:listId/items/:itemId
// (PUT)
export async function updateItemFunc(reqBody, urlUserId, urlListId, urlItemId, listDB, responseHeaders) {
    const foundList = listDB.find(currList => currList.userId == urlUserId && currList.listId == urlListId);

    if (!foundList) {
        return new Response(JSON.stringify({ error: "List not found" }), {
            status: 404,
            headers: { ...responseHeaders }
        });
    }

    const foundItem = foundList.listItems.find(currItem => currItem.itemId == urlItemId);

    if (!foundItem) {
        return new Response(JSON.stringify({ error: "Item not found" }), {
            status: 409,
            headers: { ...responseHeaders }
        });
    }

    //Här kan vi uppdatera namn och kvantitet om klienten skickat med dessa fält.
    if (reqBody.itemName !== undefined) {
        foundItem.itemName = reqBody.itemName;
    }

    if (reqBody.itemQuantity !== undefined) {
        foundItem.itemQuantity = reqBody.itemQuantity;
    }

    await saveDB(listDB);

    return new Response(JSON.stringify({ message: "Item updated successfully" }), {
        status: 200,
        headers: { ...responseHeaders }
    });
}


// (DELETE) - radera ett item
export async function deleteItemFunc(urlUserId, urlListId, urlItemId, listDB, responseHeaders) {
    const foundList = listDB.find(currList => currList.userId == urlUserId && currList.listId == urlListId);

    if (!foundList) {
        return new Response(JSON.stringify({ error: "List not found" }), {
            status: 404,
            headers: { ...responseHeaders }
        });
    }
    /**Loopar genom foundList.listItems och sparar indexet där itemId matchar.

    Om inget hittas (index = -1), returnera 409 Conflict. */
    let itemIndex = -1;
    for (let i = 0; i < foundList.listItems.length; i++) {
        if (foundList.listItems[i].itemId == urlItemId) {
            itemIndex = i;
            break;
        }
    }

    if (itemIndex === -1) {
        return new Response(JSON.stringify({ error: "Item not found" }), {
            status: 409,
            headers: { ...responseHeaders }
        });
    }

    foundList.listItems.splice(itemIndex, 1);

    await saveDB(listDB);

    return new Response(JSON.stringify({ message: "Item deleted successfully" }), {
        status: 200,
        headers: { ...responseHeaders }
    });
}