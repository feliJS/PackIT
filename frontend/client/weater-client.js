

// === LÄS IN API-KEY FÖR ONLINE-LÄGE ===
/* Görs nu i api.js, eftersom det är backends jobb! */


// === SKA FINNAS FÖR BÅDE OFFLINE & ONLINE!
// Klass som innehåller nycklarna temperature, localTime och country
class WeatherData {
    constructor(temperature, localTime, country, weatherDescriptions) {
        this.temperature = temperature;
        this.localTime = localTime;
        this.country = country;
        this.weatherDescriptions = weatherDescriptions;
    }
}

export async function getWeatherDataFunc (city) {
    
    // === OFFLINE-LÄGE ===
    // KOMMENTERA BORT DETTA BLOCK FÖR ONLINE:
    const url = `http://localhost:8000/weather`; 
        console.log("🔵 Online request URL:", url);

        let response = await fetch(url, {method: "POST", body: JSON.stringify({city: city})})
        const weatherObject = await response.json();
        const weather = new WeatherData(
            weatherObject.current.temperature,
            weatherObject.location.localtime,
            weatherObject.location.country,
            weatherObject.current.weather_descriptions[0]
          );

        console.log("✅ Online weather instance:", weather);
        return weather;
    } 

    // === ONLINE-LÄGE ===
    // KOMMENTERA IN DETTA BLOCK FÖR ONLINE:
    /*
    
    */


