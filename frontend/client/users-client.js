export class UserAPI {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }


  async handleResponse(res) {
    if (!res.ok) {
      let err = { error: "Något gick fel" };
      try {
        err = await res.json();
      } catch {}
      throw err;
    }
    return res.json();
  }

  // (GET) /users – hämta alla användare
  async getAllUsers() {
    const res = await fetch(`${this.baseUrl}/users`, {
      credentials: "include", 
    });
    return this.handleResponse(res);
  }

  // (POST) /users – skapa konto
  async newAccount(name, password, pfp) {
    const res = await fetch(`${this.baseUrl}/users`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password, pfp }),
    });
    return this.handleResponse(res);
  }

  // (POST) /users/login – logga in
  async loginUser(name, password) {
    const res = await fetch(`${this.baseUrl}/users/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });
    return this.handleResponse(res);
  }

  // (GET) /users/:id – hämta specifik användare
  async getSpecificUser(id) {
    const res = await fetch(`${this.baseUrl}/users/${id}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    return this.handleResponse(res);
  }

  // (PUT) /users/:id – uppdatera användare
  async updateUser(id, name) {
    const res = await fetch(`${this.baseUrl}/users/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    return this.handleResponse(res);
  }

  // (DELETE) /users/:id – radera användare
  async deleteUser(id) {
    const res = await fetch(`${this.baseUrl}/users/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    return this.handleResponse(res);
  }

  // (POST) /users/logout – logga ut 
  async logoutUser() {
    const res = await fetch(`${this.baseUrl}/users/logout`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    return this.handleResponse(res);
  }
}
