/* createlistView.js */

import { navigateTo } from "./router.js";
import { getWeatherDataFunc } from "../client/weater-client.js";



export async function submitDestination(city) {
    try {
        const weatherResponse = await getWeatherDataFunc(city); //hämtar väder data

        if (!weatherResponse) {
            throw new Error("No weather data returned");
        }

        const weatherDataObj = { //onödig
            //ta bort den och bara returnera weather response direkt
            temperature: weatherResponse.temperature,
            localTime: weatherResponse.localTime,
            country: weatherResponse.country,
            weatherDescriptions: weatherResponse.weatherDescriptions
        };

        return weatherDataObj; //denna gör liksom inget man kan bara returnera weatherResponse direkt

    } catch (error) {
        console.error("Kunde inte hämta väderdata:", error);
        return null;
    }
}


export default function renderCreateList() {

    //Skapar ett objekt som ska hålla användarens val under alla fyra steg. Förutbestämda värden:
    const tripDataObj = {
        city: "",
        country: "",
        month: "",
        day: "",
        duration: "",
        purpose: 1,
        vehicle: 2,
        userId: null
    };

    //Ett tomt objekt som vi avser att fylla med data när vi kallar submitDestination på steg 4.
    const weatherDataObj = {
        country: "",
        temperature: "",
        localtime: "",
        weather_descriptions: "",
    }

    const createlistDiv = document.querySelector(".create-list-box");

    if (!createlistDiv) {
        console.error("Elementet .createlist-box finns ej i HTML");
        return;
    }

    let currentStep = 1; //variabel som håller koll på vilket steg
    goToStep(currentStep); //gå till det steget man är på


    function goToStep(step) {

        currentStep = step;
        createlistDiv.innerHTML = "";

        switch (step) { //byta ssteg
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


    /* ---  STEP 1 --- */
    function renderStep1() { //första
        const newDiv = document.createElement("div");
        newDiv.innerHTML = `
        <div class="create-list-module">
        <img src="../assets/icons/closeIcon.png" alt="Close" class="create-list-header-close-icon-outside">
            <div class="create-list-header-container create-list-header-container-step-1">
                     <h1 class="create-list-module-h1">1/4</h1>
                     <h3 class="create-list-module-h3">Where are you going?</h3>
            </div>
            <div class="create-list-input-container create-list-input-container-step-1">
                <input type="text" placeholder="City" id="city" class="create-list-module-user-input create-list-module-user-input-city" />
                <input type="text" placeholder="Country" id="country" class="create-list-module-user-input create-list-module-user-input-country" />
            </div>
            <div class="user-feedback-container">  </div>
            <div class="create-list-btn-container">
                <button class="create-list-btn create-list-btn-hide">Hide</button>
                <button class="create-list-btn create-list-btn-next" id="next">Next</button>
            </div>

        </div>
        `;

        newDiv.querySelector(".create-list-header-close-icon-outside").addEventListener("click", () => {
            navigateTo("profile") //om close g till profile
        })

        newDiv.querySelector(".create-list-btn-next").addEventListener("click", async () => {
            tripDataObj.city = newDiv.querySelector(".create-list-module-user-input-city").value.trim(); //trim tar bort alla mellanslag och sånt, för att input kan man ju bara skriva en massa mellanslag så de tar bort de
            tripDataObj.country = newDiv.querySelector(".create-list-module-user-input-country").value.trim();

            if (!tripDataObj.city || !tripDataObj.country) { //man måste skriva in båda

                userFeedbackDiv = document.querySelector(".user-feedback-container")
                handleError("Please enter both city and country");

                return;
            }
            userFeedbackDiv = document.querySelector(".user-feedback-container")
            handleError(null);

            goToStep(2);
        });

        return newDiv;
    }



    /* ---  STEP 2 --- */
    function renderStep2() {
        const newDiv = document.createElement("div");

        newDiv.innerHTML = `
        <div class="create-list-module">
        <img src="../assets/icons/closeIcon.png" alt="Close" class="create-list-header-close-icon-outside">
            <div class="create-list-header-container create-list-header-container-step-1">
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
                    <option value="06" selected>June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>
                <input type="number" placeholder="Duration (days)" min="1" max="90" class="create-list-module-user-input-duration create-list-module-user-input create-list-module-user-input-step-2" />
            </div>

            <div class="user-feedback-container">  </div>

            <div class="create-list-btn-container">
                <button id="back" class="create-list-btn-back create-list-btn">Back</button>
                <button id="next" class="create-list-btn-next create-list-btn">Next</button>
            </div>

        </div>`;

        newDiv.querySelector(".create-list-header-close-icon-outside").addEventListener("click", () => {
            navigateTo("profile")
        })


        newDiv.querySelector(".create-list-btn-next").addEventListener("click", () => {
            tripDataObj.day = newDiv.querySelector(".create-list-module-user-input-day").value;
            tripDataObj.month = newDiv.querySelector(".create-list-module-user-input-month").value;
            tripDataObj.duration = newDiv.querySelector(".create-list-module-user-input-duration").value;

            if (!tripDataObj.day || !tripDataObj.month || !tripDataObj.duration) {

                userFeedbackDiv = document.querySelector(".user-feedback-container")
                handleError("Please enter all fields");

                return;
            }
            userFeedbackDiv = document.querySelector(".user-feedback-container")
            handleError(null);

            goToStep(3);
        });

        newDiv.querySelector(".create-list-btn-back").addEventListener("click", () => {
            userFeedbackDiv = document.querySelector(".user-feedback-container")
            handleError(null);

            goToStep(1);
        });

        return newDiv;
    }



    /* ---  STEP 3 --- */
    function renderStep3() {
        const newDiv = document.createElement("div");

        newDiv.innerHTML = `
        <div class="create-list-module">
        <img src="../assets/icons/closeIcon.png" alt="Close" class="create-list-header-close-icon-outside">
            <div class="create-list-header-container create-list-header-container-step-3">
                     <h1 class="create-list-module-h1">3/4</h1>
                     <h3 class="create-list-module-h3">What is the purpose oof your trip?</h3>
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
        
        <div class="user-feedback-container">  </div>    

            <div class="create-list-btn-container">
                <button class="create-list-btn-back create-list-btn">Back</button>
                <button class="create-list-btn-next create-list-btn">Next</button>
            </div>
    
        </div>`;

        newDiv.querySelector(".create-list-header-close-icon-outside").addEventListener("click", () => {
            navigateTo("profile")
        })

        newDiv.querySelector(".create-list-btn-next").addEventListener("click", () => {
            const selected = newDiv.querySelector("input[name='purpose']:checked");
            tripDataObj.purpose = parseInt(selected.value);

            userFeedbackDiv = document.querySelector(".user-feedback-container")
            handleError(null);

            goToStep(4);
        });

        newDiv.querySelector(".create-list-btn-back").addEventListener("click", () => {
            userFeedbackDiv = document.querySelector(".user-feedback-container")
            handleError(null);
            goToStep(2);
        });

        return newDiv;
    }


    /* ---  STEP 4 --- */
    function renderStep4() {
        const newDiv = document.createElement("div");

        newDiv.innerHTML = `
        <div class="create-list-module">
        <img src="../assets/icons/closeIcon.png" alt="Close" class="create-list-header-close-icon-outside">
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
        
        <div class="user-feedback-container">  </div>
    
            <div class="create-list-btn-container">
                <button class="create-list-btn-back create-list-btn">Back</button>
                <button class="create-list-btn-create create-list-btn">Create list</button>
            </div>
    
        </div>`;

        newDiv.querySelector(".create-list-header-close-icon-outside").addEventListener("click", () => {

            userFeedbackDiv = document.querySelector(".user-feedback-container")
            handleError(null);

            navigateTo("profile")
        })


        newDiv.querySelector(".create-list-btn-back").addEventListener("click", () => {
            userFeedbackDiv = document.querySelector(".user-feedback-container")
            handleError(null);

            goToStep(3);
        });

        newDiv.querySelector(".create-list-btn-create").addEventListener("click", async () => {

            const selectedVehicle = newDiv.querySelector("input[name='vehicle']:checked");
            tripDataObj.vehicle = parseInt(selectedVehicle.value);

            const weatherResponseOK = await submitDestination(tripDataObj.city);

            if (weatherResponseOK) {
                navigateTo("profile", { tripDataObj, weatherDataObj }); //man navigerar till profile med nya objketen!
                //och profile tittade ju ifall man hade med sig dem eller inte.. dvs om man ska rendera med den nya listan eller hur det fungerar.
                //men att man också ska komma in i editView direkt efter detta.
            } else {

                userFeedbackDiv = document.querySelector(".user-feedback-container")
                handleError("Could not retrieve weather data. Please try again.");
            }
        });

        return newDiv;
    }

}

const profileBtn = document.querySelector(".user-profile");

profileBtn.addEventListener("click", () => {
    navigateTo("profile")
})

let userFeedbackDiv;

function handleError(message) {

    if (!message) {
        userFeedbackDiv.innerHTML = "";
    }

    userFeedbackDiv.innerHTML = message
}