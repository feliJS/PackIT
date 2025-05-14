//här kan man använda sig av en klass som kraven bestämmer
export class UserAPI {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async getAllUsers() {
        const res = await fetch(`${this.baseUrl}/users`);
        return await res.json();
    }
}