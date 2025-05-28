
const weatherDB = [
    {
        "request": {
          "type": "City",
          "query": "London, United Kingdom",
          "language": "en",
          "unit": "m"
        },
        "location": {
          "name": "London",
          "country": "United Kingdom",
          "region": "City of London, Greater London",
          "lat": "51.517",
          "lon": "-0.106",
          "timezone_id": "Europe/London",
          "localtime": "2025-05-16 12:31",
          "localtime_epoch": 1747398660,
          "utc_offset": "1.0"
        },
        "current": {
          "observation_time": "11:31 AM",
          "temperature": 17,
          "weather_code": 113,
          "weather_icons": [
            "https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png"
          ],
          "weather_descriptions": [ "Sunny" ],
          "astro": {
            "sunrise": "05:07 AM",
            "sunset": "08:48 PM",
            "moonrise": "12:26 AM",
            "moonset": "06:55 AM",
            "moon_phase": "Waning Gibbous",
            "moon_illumination": 90
          },
          "air_quality": {
            "co": "270.1",
            "no2": "12.395",
            "o3": "87",
            "so2": "2.59",
            "pm2_5": "9.805",
            "pm10": "17.02",
            "us-epa-index": "1",
            "gb-defra-index": "1"
          },
          "wind_speed": 19,
          "wind_degree": 10,
          "wind_dir": "N",
          "pressure": 1026,
          "precip": 0,
          "humidity": 42,
          "cloudcover": 0,
          "feelslike": 17,
          "uv_index": 6,
          "visibility": 10,
          "is_day": "yes"
        }
      }
]


// Läs in API-nyckel från apiKeys.json
/* const apiKeysFile = await Deno.readTextFile("../../../apiKeys.json");
const keys = JSON.parse(apiKeysFile);
const API_KEY_WEATHER = keys[0].API_KEY_WEATHER; */

const BASE_URL = "https://api.weatherstack.com/current";


// Klass som innehåller nycklarna temperature, localTime och country
class WeatherData {
    constructor(temperature, localTime, country, weatherDescriptions) {
        this.temperature = temperature;
        this.localTime = localTime;
        this.country = country;
        this.weatherDescriptions = weatherDescriptions;
    }
}


// GET request - weatherObject
export async function getWeatherDataFunc (city) {
    // TEST REQUESTS TILL SPARAD DATA:
    

    // REQUESTS ONLINE
    // const url = `${BASE_URL}?access_key=${API_KEY_WEATHER}&query=${encodeURIComponent(city)}`; // måste ha "encodeURIComponent" för att servern ska kunna koda av parametern korrekt!
    // console.log("URL som skickas:", url);

    // const response = await fetch(url);
    // const weatherObject = await response.json();

    
    // för online:
    // const weather = new WeatherData(weatherObject.current.temperature, weatherObject.location.localtime, weatherObject.location.country);
    // för offline:
    const weather = new WeatherData(weatherDB[0].current.temperature, weatherDB[0].location.localtime, weatherDB[0].location.country, weatherDB[0].current.weather_descriptions[0]);

    // console.log(weatherObject);
    console.log(weather);
    return weather;
}

getWeatherDataFunc("London");