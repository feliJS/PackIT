
const API_KEY_WEATHER = "";
const BASE_URL = "https://api.weatherstack.com/current";


// GET request - weatherObject
export async function getWeatherDataFunc (city) {
    const url = `${BASE_URL}?access_key=${API_KEY_WEATHER}&query=city`;

    const response = await fetch(url);
    const weatherData = await response.json();

    return weatherData;
}