export class List {
    constructor(userId, listId, items = []) {
        this.userId = Number(userId);
        this.listId = Number(listId);
        this.listItems = items;
    }

    static createNewList(userId, listDB) {
        let maxId = 0;
        for (const list of listDB) {
            if (list.listId > maxId) {
                maxId = list.listId;
            }
        }
        const newListId = maxId + 1;
        return new List(userId, newListId);
    }
}