//här kan man använda sig av en klass som kraven bestämmer
export class UserAPI {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async getAllUsers() {
        const res = await fetch(`${this.baseUrl}/users`, {
            credentials: 'include', // fix so cookie can send from here as well
        });
        return await res.json();
    }

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

}