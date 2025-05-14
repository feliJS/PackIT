const url = 'http://localhost:8000';

function updateTestResult(testId, isSuccess, message) {
    const card = document.getElementById(testId);
    const result = card.querySelector(".test-result");

    card.classList.remove("success", "error");
    card.classList.add(isSuccess ? "success" : "error");

    result.innerHTML = `<span>${message}</span>`;
}
