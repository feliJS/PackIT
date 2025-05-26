console.log("i createlistViiew")
import { navigateTo } from "./router.js";
import { getWeatherDataFunc } from "/client/weater-client.js";

export default function renderCreateList(tripData) {

    const tripDataObj = {
        city: "",
        country: "",
        month: "",
        day: "",
        duration: "",
        purpose: 1,
        vehicle: 2,
        userId: 77775443 // *** VALIDERA O HÄMTA USER
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

            <div class="create-list-header-container create-list-header-container-step-1">
                <h1 class="create-list-module-h1">1/4</h1>
                <h3 class="create-list-module-h3">Where are you going?</h3>
            </div>

            <div class="create-list-input-container create-list-input-container-step-1">
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
            tripDataObj.city = newDiv.querySelector(".create-list-module-user-input-city").value.trim();
            tripDataObj.country = newDiv.querySelector(".create-list-module-user-input-country").value.trim();

            if (!tripDataObj.city || !tripDataObj.country) {
                alert("Please enter both city and country");
                return;
            }

            // Anropa väderapi funktion
            const weather = await submitDestination(tripDataObj.city);
            goToStep(2);
        });

        return newDiv;
    }

    function renderStep2() {
        const newDiv = document.createElement("div");

        newDiv.innerHTML = `
        <div class="create-list-module">

            <div class="create-list-header-container create-list-header-container-step-2">
                <h1 class="create-list-module-h1">2/4</h1>
                <h3 class="create-list-module-h3">When is your trip?</h3>
            </div>

            <div class="create-list-input-container create-list-input-container-step-2">
                <input type="number" placeholder="Day" min="1" max="31" class="create-list-module-user-input-day create-list-module-user-input create-list-module-user-input-step-2" />
                <select class="create-list-module-user-input-month create-list-module-user-input-step-2">
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
                <input type="number" placeholder="Duration (days)" min="1" max="90" class="create-list-module-user-input-duration create-list-module-user-input create-list-module-user-input-step-2" />
            </div>

            <div class="create-list-btn-container">
                <button id="back" class="create-list-btn-back create-list-btn">Back</button>
                <button id="next" class="create-list-btn-next create-list-btn">Next</button>
            </div>

        </div>`;

        newDiv.querySelector(".create-list-btn-next").addEventListener("click", () => {
            tripDataObj.day = newDiv.querySelector(".create-list-module-user-input-day").value;
            tripDataObj.month = newDiv.querySelector(".create-list-module-user-input-month").value;
            tripDataObj.duration = newDiv.querySelector(".create-list-module-user-input-duration").value;

            if (!tripDataObj.day || !tripDataObj.month || !tripDataObj.duration) {
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
    
            <div class="create-list-header-container create-list-header-container-step-3">
                <h1 class="create-list-module-h1">3/4</h1>
                <h3 class="create-list-module-h3">What is the purpose of your trip?</h3>
            </div>
    
            <div class="create-list-input-container create-list-input-container-step-3">
            <label class="create-list-purpose-option-step-3 create-list-purpose-options">
                <img src="../assets/icons/suntripIcon.png" alt="suntrip" class="createListPurposeIcons universalRadioIcon">
                <h4 class="createListPurposeH4 universalRadioTitle">Suntrip</h4>
                <input type="radio" name="purpose" value="1" />
            </label>
        
            <label class="create-list-purpose-option-step-3 create-list-purpose-options">
                <img src="../assets/icons/businessIcon.png" alt="business" class="createListPurposeIcons universalRadioIcon">
                <h4 class="createListPurposeH4 universalRadioTitle">Business</h4>
                <input type="radio" name="purpose" value="2" checked/>
            </label>
        
            <label class="create-list-purpose-option-step-3 create-list-purpose-options create-list-purpose-options-wellness-container">
                <img src="../assets/icons/wellnessIcon.png" alt="Wellness or Activities" class="createListPurposeIcons universalRadioIcon">
                <h4 class="create-list-purpose-h4 create-list-purpose-h4-wellness universalRadioTitle create-list-purpose-h4-wellness-fist">Wellness</h4> 
                <h4 class="create-list-purpose-h4 create-list-purpose-h4-wellness create-list-purpose-h4-wellness-last universalRadioTitle">or Activities</h4>
                <input type="radio" name="purpose" value="3" />
            </label>
        </div>
        
    
            <div class="create-list-btn-container">
                <button class="create-list-btn-back create-list-btn">Back</button>
                <button class="create-list-btn-next create-list-btn">Next</button>
            </div>
    
        </div>`;
    
        newDiv.querySelector(".create-list-btn-next").addEventListener("click", () => {
            const selected = newDiv.querySelector("input[name='purpose']:checked");
            tripDataObj.purpose = parseInt(selected.value);
            goToStep(4);
            console.log(tripDataObj)
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
    
            <div class="create-list-header-container create-list-header-container-step-4">
                <h1 class="create-list-module-h1">4/4</h1>
                <h3 class="create-list-module-h3">How will you travel?</h3>
            </div>
    
            <div class="create-list-input-container create-list-input-container-step-4">
            <label class="create-list-vehicle-option-step-4 create-list-purpose-options">
                <img src="../assets/icons/trainIcon.png" alt="Train" class="createListPurposeIcons universalRadioIcon">
                <h4 class="createListPurposeH4 universalRadioTitle">Train</h4>
                <input type="radio" name="vehicle" value="1" />
            </label>
        
            <label class="create-list-vehicle-option-step-4 create-list-purpose-options">
                <img src="../assets/icons/airplaneIcon.png" alt="Plane" class="createListPurposeIcons universalRadioIcon">
                <h4 class="createListPurposeH4 universalRadioTitle">Plane</h4>
                <input type="radio" name="vehicle" value="2" checked/>
            </label>
        
            <label class="create-list-vehicle-option-step-4 create-list-purpose-options">
                <img src="../assets/icons/carIcon.png" alt="Car" class="createListPurposeIcons universalRadioIcon">
                <h4 class="createListPurposeH4 universalRadioTitle">Car</h4>
                <input type="radio" name="vehicle" value="3" />
            </label>
        </div>
        
    
            <div class="create-list-btn-container">
                <button class="create-list-btn-back create-list-btn">Back</button>
                <button class="create-list-btn-create create-list-btn">Create list</button>
            </div>
    
        </div>`;
    

        newDiv.querySelector(".create-list-btn-create").addEventListener("click", () => {
            const selectedVehicle = newDiv.querySelector("input[name='vehicle']:checked");
            tripDataObj.vehicle = parseInt(selectedVehicle.value);
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
