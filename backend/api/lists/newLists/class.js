export class List {
    constructor(userId, items = [], listIndex = 0, name) {
        this.userId = userId;
        this.items = items;
        this.id = `${userId}-${listIndex}`;
        this.name = name;
    }
    addItem(item) {
        this.items.push(item);
    }
    removeItem(index) {
        this.items.splice(index, 1);
    }
}

export class UserListManager {
    constructor(listsByUser = {}) {
        this.listsByUser = listsByUser;
    }
    createListForUser(userId, title, items = []) {
        if (!this.listsByUser[userId]) {
            this.listsByUser[userId] = [];
        }

        const listIndex = this.listsByUser[userId].length;
        const newList = new List(userId, items, listIndex, title);
        this.listsByUser[userId].push(newList);
        saveListsToFile(this.listsByUser);
        return newList;
    }

    deleteListForUser(userId, listId) {
        const userLists = this.listsByUser[userId];
        if (!userLists) return false;

        const index = userLists.findIndex(list => list.id === listId);
        if (index === -1) return false;

        userLists.splice(index, 1);
        saveListsToFile(this.listsByUser);
        return true;
    }

    getListsForUser(userId) {
        return this.listsByUser[userId] || [];
    }

    getListById(listId) {
        for (const lists of Object.values(this.listsByUser)) {
            const match = lists.find(list => list.id === listId);
            if (match) return match;
        }
        return null;
    }


    toJSON() {
        return this.listsByUser;
    }
    addItemToList(userId, listId, item) {
        const userLists = this.listsByUser[userId];
        if (!userLists) {
            return false
        }
        const list = userLists.find(list => list.id === listId);
        if (!list) {
            return false
        }
        list.items.push(item);
        saveListsToFile(this.listsByUser); // uppdatera filen direkt
        return true;
    }

}



export async function loadListsFromFile() {
    try {
        const data = await Deno.readTextFile("lists.json");
        return JSON.parse(data);
    } catch {
        return {};
    }
}

export async function saveListsToFile(listsData) {
    const jsonString = JSON.stringify(listsData, null, 2); // null gör att alla nycklar kommer med, 2 skapar läsbarhet
    await Deno.writeTextFile("lists.json", jsonString);
}
