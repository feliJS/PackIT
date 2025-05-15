
const API_KEY_COOR = "";
const API_KEY_WEATHER = "";

export async function getCoordinatesFunc(destination) {

    coordinatesUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${destination}&limit=1&appid=${API_KEY_COOR}`
    const coorResponse = await fetch(coordinatesUrl);
    const coorData = await coorResponse.json();

    return coorData; // { [ lat: ... , lon: ... , name: ... ] } för att få objektet

}

export async function getForecastFunc(latitude, longitude) {

    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY_WEATHER}&units=metric` // SE ÖVER PERIOD
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    return weatherData;

}


