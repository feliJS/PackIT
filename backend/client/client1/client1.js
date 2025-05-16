
// Läs in API-nyckel från apiKeys.json
const apiKeysFile = await Deno.readTextFile("../../../apiKeys.json");
const keys = JSON.parse(apiKeysFile);
const API_KEY_WEATHER = keys[0].API_KEY_WEATHER;

/* TEST REUESTS TILL SPARAD DATA:
const savedData = await Deno.readTextFile("./weather-london.json");
const weather = JSON.parse(savedData);
console.log(weather.location.localtime);
console.log(weather.current.temperature);
*/

const BASE_URL = "https://api.weatherstack.com/current";


// GET request - weatherObject
export async function getWeatherDataFunc (city) {
    const url = `${BASE_URL}?access_key=${API_KEY_WEATHER}&query=${encodeURIComponent(city)}`; // måste ha "encodeURIComponent" för att servern ska kunna koda av parametern korrekt!
    console.log("URL som skickas:", url);

    const response = await fetch(url);
    const weatherData = await response.json();

    console.log(weatherData);
    return weatherData;
}

getWeatherDataFunc("London");