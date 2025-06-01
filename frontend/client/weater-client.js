// weather-client.js

// Klass som innehåller nycklarna temperature, localTime och country
class WeatherData {
    constructor(temperature, localTime, country, weatherDescriptions) {
        this.temperature = temperature;
        this.localTime = localTime;
        this.country = country;
        this.weatherDescriptions = weatherDescriptions;
    }
}


const weatherCache = {};
let counter = 23;

export async function getWeatherDataFunc(city) {
    
    if(counter == 95){
        return alert("Rate Limit is a 100 requests!")
        
    }
    if (weatherCache[city]) {
        return weatherCache[city];
    }

    // === OFFLINE-LÄGE (lokal endpoint) ===
    const url = `http://localhost:8000/weather`;
    console.log("🔵 Online request URL:", url);

    let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ city: city }),
    });
    const weatherObject = await response.json();
    counter++

    // Skapa en instans av WeatherData
    const weather = new WeatherData(
        weatherObject.current.temperature,
        weatherObject.location.localtime,
        weatherObject.location.country,
        weatherObject.current.weather_descriptions[0]
    );

    // Spara i cache innan vi returnerar
    weatherCache[city] = weather;
    return weather;
}

// === ONLINE-LÄGE (riktigt API) ===
// KOMMENTERA IN DETTA BLOCK FÖR ONLINE:
/*
export async function getWeatherDataFunc(city) {
    if (weatherCache[city]) {
        return weatherCache[city];
    }

    const API_KEY = "DIN_ONLINE_API_KEY";
    const BASE_URL = "https://api.weatherstack.com/current";
    const response = await fetch(
        `${BASE_URL}?access_key=${API_KEY}&query=${encodeURIComponent(city)}`
    );
    const data = await response.json();

    if (data.error) {
        throw new Error("Fel från väder-API: " + data.error.type);
    }

    const weather = new WeatherData(
        data.current.temperature,
        data.location.localtime,
        data.location.country,
        data.current.weather_descriptions[0]
    );

    weatherCache[city] = weather;
    return weather;
}
*/
