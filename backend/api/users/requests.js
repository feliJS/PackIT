export async function allUsers(params) {
    let response = await fetch("http://localhost:8000/users")
    let allUsersJson = await response.json()
    return allUsersJson
}