export class List {
    constructor(userId, items = [], listIndex = 0, title) {
        this.userId = userId;
        this.listItems = items;
        this.listId = `${userId}-${listIndex}`;
        this.listName = title;
    }
    addItem(item) {
        this.listItems.push(item);
    }
    removeItem(index) {
        this.listItems.splice(index, 1);
    }

}

export class UserListManager {
    constructor(listsByUser = {}) {
        this.listsByUser = listsByUser;
    }
    createListForUser(userId, items = [], title = "") {
        if (!this.listsByUser[userId]) {
            this.listsByUser[userId] = [];
        }
        if (!title || title.trim() === "") {
            title = this.generateTitle(userId)
        }

        const listIndex = this.listsByUser[userId].length;
        const newList = new List(userId, items, listIndex, title);
        this.listsByUser[userId].push(newList);
        saveListsToFile(this.listsByUser);
        return newList;
    }

    generateTitle(userId) {
        const existingTitles = getListsForUser(userId).map(list => listName);

        let counter = 1;
        let newTitle;

        do {
            newTitle = `New List${counter}`;
            counter++;
        } while (existingTitles.includes(newTitle));

        return newTitle;
    }

    renameList(userId, listId, newTitle) {
        const userLists = this.getListsForUser(userId);
        if (!userLists) {
            return false;
        }
        const titleExists = userLists.some(l => l.title === newTitle);
        if (titleExists) return "title-exists";
        let foundList = userLists.find(list => list.listId === listId);

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
        list.listItems.push(item);
        saveListsToFile(this.listsByUser);
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
