export class List {
    constructor(userId, items = [], listIndex = 0) {
        this.userId = userId;
        this.items = items;
        this.id = `${userId}-${listIndex}`;
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
    createListForUser(userId, items = []) {
        if (!this.listsByUser[userId]) {
            this.listsByUser[userId] = [];
        }

        const listIndex = this.listsByUser[userId].length;
        const newList = new List(userId, items, listIndex);
        this.listsByUser[userId].push(newList);
        return newList;
    }
    getListsForUser(userId) {
        return this.listsByUser[userId] || [];
    }
    toJSON() {
        return this.listsByUser;
    }
}

