
const weatherDB = [
    // London
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
      },

      // Paris
  {
    "request": {
      "type": "City",
      "query": "Paris, France",
      "language": "fr",
      "unit": "m"
    },
    "location": {
      "name": "Paris",
      "country": "France",
      "region": "Ile-de-France",
      "lat": "48.8566",
      "lon": "2.3522",
      "timezone_id": "Europe/Paris",
      "localtime": "2025-05-16 13:37",
      "localtime_epoch": 1747402260,
      "utc_offset": "2.0"
    },
    "current": {
      "observation_time": "11:31 AM",
      "temperature": 22,
      "weather_code": 116,
      "weather_icons": [
        "https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png"
      ],
      "weather_descriptions": [ "Partly Cloudy" ],
      "astro": {
        "sunrise": "06:05 AM",
        "sunset": "09:15 PM",
        "moonrise": "01:10 AM",
        "moonset": "07:45 AM",
        "moon_phase": "Waning Gibbous",
        "moon_illumination": 87
      },
      "air_quality": {
        "co": "190.3",
        "no2": "24.1",
        "o3": "68",
        "so2": "3.1",
        "pm2_5": "12.3",
        "pm10": "20.5",
        "us-epa-index": "2",
        "gb-defra-index": "2"
      },
      "wind_speed": 14,
      "wind_degree": 90,
      "wind_dir": "E",
      "pressure": 1018,
      "precip": 0,
      "humidity": 48,
      "cloudcover": 25,
      "feelslike": 22,
      "uv_index": 7,
      "visibility": 10,
      "is_day": "yes"
    }
  },

  // Berlin
  {
    "request": {
      "type": "City",
      "query": "Berlin, Germany",
      "language": "en",
      "unit": "m"
    },
    "location": {
      "name": "Berlin",
      "country": "Germany",
      "region": "Berlin",
      "lat": "52.52",
      "lon": "13.405",
      "timezone_id": "Europe/Berlin",
      "localtime": "2025-05-16 19:31",
      "localtime_epoch": 1747402260,
      "utc_offset": "2.0"
    },
    "current": {
      "observation_time": "11:31 AM",
      "temperature": 19,
      "weather_code": 119,
      "weather_icons": [
        "https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png"
      ],
      "weather_descriptions": [ "Rainy" ],
      "astro": {
        "sunrise": "05:15 AM",
        "sunset": "08:55 PM",
        "moonrise": "12:45 AM",
        "moonset": "07:10 AM",
        "moon_phase": "Waning Gibbous",
        "moon_illumination": 88
      },
      "air_quality": {
        "co": "160.1",
        "no2": "18.9",
        "o3": "59",
        "so2": "2.8",
        "pm2_5": "10.5",
        "pm10": "19.2",
        "us-epa-index": "2",
        "gb-defra-index": "2"
      },
      "wind_speed": 11,
      "wind_degree": 130,
      "wind_dir": "SE",
      "pressure": 1015,
      "precip": 0,
      "humidity": 60,
      "cloudcover": 85,
      "feelslike": 19,
      "uv_index": 4,
      "visibility": 9,
      "is_day": "yes"
    }
  },

  // Stockholm
  {
    "request": {
      "type": "City",
      "query": "Stockholm, Sweden",
      "language": "en",
      "unit": "m"
    },
    "location": {
      "name": "Stockholm",
      "country": "Sweden",
      "region": "Stockholm",
      "lat": "59.3293",
      "lon": "18.0686",
      "timezone_id": "Europe/Stockholm",
      "localtime": "2025-05-16 13:31",
      "localtime_epoch": 1747402260,
      "utc_offset": "2.0"
    },
    "current": {
      "observation_time": "11:31 AM",
      "temperature": 14,
      "weather_code": 176,
      "weather_icons": [
        "https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0010_heavy_rain_showers.png"
      ],
      "weather_descriptions": [ "Light rain showers" ],
      "astro": {
        "sunrise": "04:15 AM",
        "sunset": "09:25 PM",
        "moonrise": "12:55 AM",
        "moonset": "07:25 AM",
        "moon_phase": "Waning Gibbous",
        "moon_illumination": 89
      },
      "air_quality": {
        "co": "120.0",
        "no2": "11.2",
        "o3": "77",
        "so2": "1.7",
        "pm2_5": "6.8",
        "pm10": "12.4",
        "us-epa-index": "1",
        "gb-defra-index": "1"
      },
      "wind_speed": 17,
      "wind_degree": 190,
      "wind_dir": "S",
      "pressure": 1012,
      "precip": 1.2,
      "humidity": 71,
      "cloudcover": 70,
      "feelslike": 13,
      "uv_index": 3,
      "visibility": 8,
      "is_day": "yes"
    }
  },

  // Madrid
  {
    "request": {
      "type": "City",
      "query": "Madrid, Spain",
      "language": "en",
      "unit": "m"
    },
    "location": {
      "name": "Madrid",
      "country": "Spain",
      "region": "Madrid",
      "lat": "40.4168",
      "lon": "-3.7038",
      "timezone_id": "Europe/Madrid",
      "localtime": "2025-05-16 09:30",
      "localtime_epoch": 1747402260,
      "utc_offset": "2.0"
    },
    "current": {
      "observation_time": "09:30 AM",
      "temperature": 27,
      "weather_code": 113,
      "weather_icons": [
        "https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png"
      ],
      "weather_descriptions": [ "Sunny" ],
      "astro": {
        "sunrise": "06:45 AM",
        "sunset": "09:35 PM",
        "moonrise": "01:40 AM",
        "moonset": "08:00 AM",
        "moon_phase": "Waning Gibbous",
        "moon_illumination": 85
      },
      "air_quality": {
        "co": "250.5",
        "no2": "16.0",
        "o3": "91",
        "so2": "1.9",
        "pm2_5": "11.5",
        "pm10": "21.0",
        "us-epa-index": "2",
        "gb-defra-index": "2"
      },
      "wind_speed": 13,
      "wind_degree": 220,
      "wind_dir": "SW",
      "pressure": 1011,
      "precip": 0,
      "humidity": 28,
      "cloudcover": 0,
      "feelslike": 29,
      "uv_index": 9,
      "visibility": 10,
      "is_day": "yes"
    }
  },

  // Rome
  {
    "request": {
      "type": "City",
      "query": "Rome, Italy",
      "language": "en",
      "unit": "m"
    },
    "location": {
      "name": "Rome",
      "country": "Italy",
      "region": "Lazio",
      "lat": "41.9028",
      "lon": "12.4964",
      "timezone_id": "Europe/Rome",
      "localtime": "2025-05-16 13:31",
      "localtime_epoch": 1747402260,
      "utc_offset": "2.0"
    },
    "current": {
      "observation_time": "10:10 AM",
      "temperature": 24,
      "weather_code": 116,
      "weather_icons": [
        "https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png"
      ],
      "weather_descriptions": [ "Partly Cloudy" ],
      "astro": {
        "sunrise": "06:10 AM",
        "sunset": "08:45 PM",
        "moonrise": "01:20 AM",
        "moonset": "07:35 AM",
        "moon_phase": "Waning Gibbous",
        "moon_illumination": 87
      },
      "air_quality": {
        "co": "230.2",
        "no2": "14.5",
        "o3": "72",
        "so2": "2.0",
        "pm2_5": "9.0",
        "pm10": "18.7",
        "us-epa-index": "2",
        "gb-defra-index": "2"
      },
      "wind_speed": 10,
      "wind_degree": 100,
      "wind_dir": "E",
      "pressure": 1013,
      "precip": 0,
      "humidity": 39,
      "cloudcover": 30,
      "feelslike": 25,
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
    console.log("weatherInstans:", weather);
    return weather;
}

// getWeatherDataFunc("London");