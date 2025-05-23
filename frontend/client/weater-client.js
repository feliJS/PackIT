
// Läs in API-nyckel från apiKeys.json
/* const apiKeysFile = await Deno.readTextFile("../../../apiKeys.json");
const keys = JSON.parse(apiKeysFile);
const API_KEY_WEATHER = keys[0].API_KEY_WEATHER; */

const BASE_URL = "https://api.weatherstack.com/current";


// Klass som innehåller nycklarna temperature, localTime och country
class WeatherData {
    constructor(temperature, localTime, country) {
        this.temperature = temperature;
        this.localTime = localTime;
        this.country = country;
    }
}


// GET request - weatherObject
export async function getWeatherDataFunc (city) {
    // TEST REQUESTS TILL SPARAD DATA:
    const testDatabasFile = await Deno.readTextFile("testDatabas.json");
    const testWeatherObj = JSON.parse(testDatabasFile)[0];

    // REQUESTS ONLINE
    // const url = `${BASE_URL}?access_key=${API_KEY_WEATHER}&query=${encodeURIComponent(city)}`; // måste ha "encodeURIComponent" för att servern ska kunna koda av parametern korrekt!
    // console.log("URL som skickas:", url);

    // const response = await fetch(url);
    // const weatherObject = await response.json();

    
    // för online:
    // const weather = new WeatherData(weatherObject.current.temperature, weatherObject.location.localtime, weatherObject.location.country);
    // för offline:
    const weather = new WeatherData(testWeatherObj.current.temperature, testWeatherObj.location.localtime, testWeatherObj.location.country);

    // console.log(weatherObject);
    console.log(weather);
    return weather;
}

getWeatherDataFunc("London");