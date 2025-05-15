const url = 'http://localhost:8000';

function updateTestResult(testId, isSuccess, message) {
    const card = document.getElementById(testId);
    const result = card.querySelector(".test-result");

    card.classList.remove("success", "error");
    card.classList.add(isSuccess ? "success" : "error");

    result.innerHTML = `<pre>${message}</pre>`;
}

async function testGetAllUsers() {
    const testId = 'test-get-users';
    try {
        const res = await fetch(`${url}/users`);
        const data = await res.json();

        if (res.status === 200) {
            updateTestResult(testId, true, `Status: ${res.status}\n${JSON.stringify(data)}`);
        } else {
            updateTestResult(testId, false, `Unexpected response:\n${JSON.stringify(data)}`);
        }
    } catch (err) {
        updateTestResult(testId, false, err.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#btn-test-get-users")
        .addEventListener("click", testGetAllUsers);
});

