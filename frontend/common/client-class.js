//här kan man använda sig av en klass som kraven bestämmer
export class UserAPI {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    //get all users
    async getAllUsers() {
        const res = await fetch(`${this.baseUrl}/users`, {
            credentials: 'include', // fix so cookie can send from here as well
        });
        return await res.json();
    }
    //create new account
    async newAccount(name, password) {
        const res = await fetch(`${this.baseUrl}/users`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: name, password: password })
        });
        return await res.json();
    }

    //logga in
    async loginUser(name, password) {
        const res = await fetch(`${this.baseUrl}/users/login`, {
            method: "POST",
            credentials: 'include', // fix so cookie can save from other server
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: name, password: password })
        });
        return await res.json();
    }
        //Hämta specifik använadre
    async getSpecificUser(id) {
        const res = await fetch(`${this.baseUrl}/users/${id}`, {
            method: "GET",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
        });
        return await res.json();
    }

    //uppdatera användare
    async updateUser(id, name) {
        const res = await fetch(`${this.baseUrl}/users/${id}`, {
            method: "PUT",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: name })
        });
        return await res.json();
    }
    //radera användare
    async deleteUser(id) {
        const res = await fetch(`${this.baseUrl}/users/${id}`, {
            method: "DELETE",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            }
        });
        return await res.json();
    }

    //logout
    async logoutUser() {
        const res = await fetch(`${this.baseUrl}/users/logout`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            }
        });
        return await res.json();
    }
}