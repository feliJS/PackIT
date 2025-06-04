/* list-client.js */

export class ListAPI {

    constructor(baseUrl) { //konstruktorn skapas alltid när du gör en ny list instans.
        this.baseUrl = baseUrl; //mer flexibel ig för att man kan byta url om man ska köra på ngn
        //test version eller nått? så behöver man ej byta överallt
    }

    async handleResponse(response) { //en emtod i klassen som expektar en response

        if (!response.ok) {
            try {
                err = await response.json(); //eftersom vi måste hämta responsen
                //vilket måste vara json
            } catch { } //vi gör inget den går direkt till något gick fel
            //om de ej är json
            throw { error: "Något gick fel" }; //annars får vi ju kasta en error.
        }

        return response.json(); //returnerar en promise
    }


    // --- LISTOR ---

    // (GET)  ENDPOINT = /lists/:userId   – hämta alla användarens listor
    async getAllLists(userId) {

        const reqURL = `${this.baseUrl}/lists/${userId}`;

        const response = await fetch(reqURL);
        return this.handleResponse(response);
    }

    // (GET)  ENDPOINT = /lists/:userId/:listId   – hämta specifik lista
    async getList(userId, listId) {

        const reqURL = `${this.baseUrl}/lists/${userId}/${listId}`;

        const response = await fetch(reqURL, {
            headers: { "Content-Type": "application/json" },
        });
        return this.handleResponse(response);
    }

    // (POST)  ENDPOINT = /lists/:userId   – skapa ny lista
    async createList(userId, listName, purpose, cover, vehicle) {

        const reqURL = `${this.baseUrl}/lists/${userId}`;

        const response = await fetch(reqURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "listName": listName, "purpose": purpose, "cover": cover, "vehicle": vehicle }),
        });
        return this.handleResponse(response);
    }

    // (DELETE)  ENDPOINT = /lists/:userId/:listId   – radera lista
    async deleteList(userId, listId) {

        const reqURL = `${this.baseUrl}/lists/${userId}/${listId}`;

        const response = await fetch(reqURL, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" } //Egentligen behövs ju ej denna
            //för vi har ingen body.
        });
        return this.handleResponse(response);
    }



    // --- ITEMS ---

    // (GET)   ENDPOINT = /lists/:userId/:listId/items   – hämta alla items i en lista *** ?
    async getAllItems(userId, listId) {

        const reqURL = `${this.baseUrl}/lists/${userId}/${listId}/items`;

        const response = await fetch(reqURL, {
            headers: { "Content-Type": "application/json" }, //Returnerar items som en json?
        });
        return this.handleResponse(response);
    }

    // (POST)   ENDPOINT = /lists/:userId/:listId/items   – lägg till en item i listan
    async addItem(userId, listId, itemType, itemName, itemQuantity) {

        const reqURL = `${this.baseUrl}/lists/${userId}/${listId}/items`;

        const response = await fetch(reqURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemType, itemName, itemQuantity }),
        });
        return this.handleResponse(response);
    }

    // (PUT)   ENDPOINT = /lists/:userId/:listId/items/:itemId   – uppdatera item 
    async updateItem(userId, listId, itemId, updatedFields) {

        const reqURL = `${this.baseUrl}/lists/${userId}/${listId}/items/${itemId}`;

        const response = await fetch(reqURL, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedFields),
        }
        );

        return this.handleResponse(response);
    }

    // (DELETE)   ENDPOINT = /lists/:userId/:listId/items/:itemId   – radera en item
    async deleteItem(userId, listId, itemId) {

        const reqURL = `${this.baseUrl}/lists/${userId}/${listId}/items/${itemId}`;

        const response = await fetch(reqURL, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        }
        );

        return this.handleResponse(response);
    }
}
