console.log("i createlistViiew")
import { navigateTo } from "./router.js";
import { getWeatherDataFunc } from "/client/weater-client.js";

export default function renderCreateList() {

    const tripData = {
        city: "",
        country: "",
        month: "",
        day: "",
        duration: "",
        purpose: 1,
        vehicle: 2
    };

    const createlistDiv = document.querySelector(".create-list-box");

    if (!createlistDiv) {
        console.error("Elementet .createlist-box hittades inte!");
        return;
    }

    let currentStep = 1;
    goToStep(currentStep);

    function goToStep(step) {
        currentStep = step;
        createlistDiv.innerHTML = "";

        switch (step) {
            case 1:
                createlistDiv.appendChild(renderStep1());
                break;
            case 2:
                createlistDiv.appendChild(renderStep2());
                break;
            case 3:
                createlistDiv.appendChild(renderStep3());
                break;
            case 4:
                createlistDiv.appendChild(renderStep4());
                break;
        }
    }

    function renderStep1() {
        const newDiv = document.createElement("div");
        newDiv.innerHTML = `
        <div class="create-list-module">

            <!-- ÄNDRAT: Struktur uppdelad i header/input/knappcontainer -->
            <div class="create-list-header-container">
                <h1 class="create-list-module-h1">1/4</h1>
                <h3 class="create-list-module-h3">Where are you going?</h3>
            </div>

            <div class="create-list-input-container">
                <input type="text" placeholder="City" id="city" class="create-list-module-user-input create-list-module-user-input-city" />
                <input type="text" placeholder="Country" id="country" class="create-list-module-user-input create-list-module-user-input-country" />
            </div>

            <div class="create-list-btn-container">
                <button class="create-list-btn create-list-btn-hide">Hide</button>
                <button class="create-list-btn create-list-btn-next" id="next">Next</button>
            </div>

        </div>
        `;

        newDiv.querySelector(".create-list-btn-next").addEventListener("click", async () => {
            tripData.city = newDiv.querySelector(".create-list-module-user-input-city").value.trim();
            tripData.country = newDiv.querySelector(".create-list-module-user-input-country").value.trim();

            if (!tripData.city || !tripData.country) {
                alert("Please enter both city and country");
                return;
            }

            // Anropa väderapi funktion
            const weather = await submitDestination(tripData.city);
            goToStep(2);
        });

        return newDiv;
    }

    function renderStep2() {
        const newDiv = document.createElement("div");

        newDiv.innerHTML = `
        <div class="create-list-module">

            <!-- ÄNDRAT: Uppdelning i header/input/knappar -->
            <div class="create-list-header-container">
                <h1 class="create-list-module-h1">2/4</h1>
                <h3 class="create-list-module-h3">When is your trip?</h3>
            </div>

            <div class="create-list-input-container">
                <input type="number" placeholder="Day" min="1" max="31" class="create-list-module-user-input-day create-list-module-user-input" />
                <select class="create-list-module-user-input-month">
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>
                <input type="number" placeholder="Duration (days)" min="1" max="90" class="create-list-module-user-input-duration create-list-module-user-input" />
            </div>

            <div class="create-list-btn-container">
                <button id="back" class="create-list-btn-back">Back</button>
                <button id="next" class="create-list-btn-next">Next</button>
            </div>

        </div>`;

        newDiv.querySelector(".create-list-btn-next").addEventListener("click", () => {
            tripData.day = newDiv.querySelector(".create-list-module-user-input-day").value;
            tripData.month = newDiv.querySelector(".create-list-module-user-input-month").value;
            tripData.duration = newDiv.querySelector(".create-list-module-user-input-duration").value;

            if (!tripData.day || !tripData.month || !tripData.duration) {
                alert("Please enter fields");
                return;
            }

            goToStep(3);
        });

        newDiv.querySelector(".create-list-btn-back").addEventListener("click", () => {
            goToStep(1);
        });

        return newDiv;
    }

    function renderStep3() {
        const newDiv = document.createElement("div");

        newDiv.innerHTML = `
        <div class="create-list-module">

            <!-- ÄNDRAT: Header + val + knappcontainer -->
            <div class="create-list-header-container">
                <h1 class="create-list-module-h1">3/4</h1>
                <h3 class="create-list-module-h3">What is the purpose of your trip?</h3>
            </div>

            <div class="create-list-input-container">
                <label><input type="radio" name="purpose" value="1" checked /> Suntrip</label>
                <label><input type="radio" name="purpose" value="2" /> Business</label>
                <label><input type="radio" name="purpose" value="3" /> Wellness</label>
            </div>

            <div class="create-list-btn-container">
                <button class="create-list-btn-back">Back</button>
                <button class="create-list-btn-next">Next</button>
            </div>

        </div>`;

        newDiv.querySelector(".create-list-btn-next").addEventListener("click", () => {
            const selected = newDiv.querySelector("input[name='purpose']:checked");
            tripData.purpose = parseInt(selected.value);
            goToStep(4);
            console.log(tripData)
        });

        newDiv.querySelector(".create-list-btn-back").addEventListener("click", () => {
            goToStep(2);
        });

        return newDiv;
    }

    function renderStep4() {
        const newDiv = document.createElement("div");

        newDiv.innerHTML = `
        <div class="create-list-module">

            <!-- ÄNDRAT: Header + val + knappar -->
            <div class="create-list-header-container">
                <h1 class="create-list-module-h1">4/4</h1>
                <h3 class="create-list-module-h3">How will you travel?</h3>
            </div>

            <div class="create-list-input-container">
                <label><input type="radio" name="vehicle" value="1" checked /> Train</label>
                <label><input type="radio" name="vehicle" value="2" /> Plane</label>
                <label><input type="radio" name="vehicle" value="3" /> Car</label>
            </div>

            <div class="create-list-btn-container">
                <button class="create-list-btn-back">Back</button>
                <button class="create-list-btn-create">Create list</button>
            </div>

        </div>`;

        newDiv.querySelector(".create-list-btn-create").addEventListener("click", () => {
            const selectedVehicle = newDiv.querySelector("input[name='vehicle']:checked");
            tripData.vehicle = parseInt(selectedVehicle.value);
            // Spara ner res-datan
            // Anropa profileView
        });

        newDiv.querySelector(".create-list-btn-back").addEventListener("click", () => {
            goToStep(3);
        });

        return newDiv;
    }

    async function submitDestination(city) {
        try {
            // weather 
            const weatherObj = await getWeatherDataFunc(city);
            const weatherData = await weatherObj.json();
            return weatherData;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}
