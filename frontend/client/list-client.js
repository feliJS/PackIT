/* list-client.js */

export class ListAPI {

    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async handleResponse(response) {

        if (!response.ok) {
            try {
                err = await response.json();
            } catch { }
            throw { error: "Något gick fel" }; // NGT MER?
        }

        return res.json();
    }

    /* SKA CREDENTIALS VARA MED? *** */


    // --- LISTOR ---

    // (GET)  ENDPOINT = /users/:userId/lists   – hämta alla användarens listor
    async getAllLists(userId) {

        const reqURL = `${this.baseUrl}/users/${userId}/lists`;

        const response = await fetch(reqURL, {
            headers: { "Content-Type": "application/json" },
        });
        return this.handleResponse(response);
    }

    // (GET)  ENDPOINT = /users/:userId/lists/:listId   – hämta specifik lista
    async getList(userId, listId) {

        const reqURL = `${this.baseUrl}/users/${userId}/lists/${listId}`;

        const response = await fetch(reqURL, {
            headers: { "Content-Type": "application/json" },
        });
        return this.handleResponse(response);
    }

    // (POST)  ENDPOINT = /users/:userId/lists   – skapa ny lista
    async createList(userId, listName, template) {

        const reqURL = `${this.baseUrl}/users/${userId}/lists`;

        const response = await fetch(reqURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ listName, template }),
        });
        return this.handleResponse(response);
    }

    // (DELETE)  ENDPOINT = /users/:userId/lists/:listId   – radera lista
    async deleteList(userId, listId) {

        const reqURL = `${this.baseUrl}/users/${userId}/lists/${listId}`;

        const response = await fetch(reqURL, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });
        return this.handleResponse(response);
    }



    // --- ITEMS ---

    // (GET)   ENDPOINT = /users/:userId/lists/:listId/items   – hämta alla items i en lista *** ?
    async getAllItems(userId, listId) {

        const reqURL = `${this.baseUrl}/users/${userId}/lists/${listId}/items`;

        const response = await fetch(reqURL, {
            headers: { "Content-Type": "application/json" },
        });
        return this.handleResponse(response);
    }

    // (POST)   ENDPOINT = /users/:userId/lists/:listId/items   – lägg till en item i listan
    async addItem(userId, listId, itemName, itemQuantity) {

        const reqURL = `${this.baseUrl}/users/${userId}/lists/${listId}/items`;

        const response = await fetch(reqURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemName, itemQuantity }),
        });
        return this.handleResponse(response);
    }

    // (PUT)   ENDPOINT = /users/:userId/lists/:listId/items/:itemId   – uppdatera item *** ?
    async updateItem(userId, listId, itemId, updatedFields) {

        const reqURL = `${this.baseUrl}/users/${userId}/lists/${listId}/items/${itemId}`;

        const response = await fetch(reqURL, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedFields),
        }
        );

        return this.handleResponse(response);
    }

    // (DELETE)   ENDPOINT = /users/:userId/lists/:listId/items/:itemId   – radera en item
    async deleteItem(userId, listId, itemId) {

        const reqURL = `${this.baseUrl}/users/${userId}/lists/${listId}/items/${itemId}`;

        const response = await fetch(reqURL, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        }
        );

        return this.handleResponse(response);
    }
}
