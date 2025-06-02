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

    const url = `http://localhost:8000/weather`;

    let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ city: city }),
    });
    const weatherObject = await response.json();
    counter++

    const weather = new WeatherData(
        weatherObject.current.temperature,
        weatherObject.location.localtime,
        weatherObject.location.country,
        weatherObject.current.weather_descriptions[0]
    );

    weatherCache[city] = weather;
    return weather;
}