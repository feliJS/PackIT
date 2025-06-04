// weather-client.js

// Klass som innehåller nycklarna temperature, localTime och country
class WeatherData { //en simpel klass som har följande:
    //Detta är bland annat för att få ut det mest väsentliga
    //vi får ju en massa värden av väder apiet.. men vi vill ju inte ha allt allt..
    //denna körs automatiskt när du skapar en ny instans
    constructor(temperature, localTime, country, weatherDescriptions) {
        this.temperature = temperature;
        this.localTime = localTime;
        this.country = country;
        this.weatherDescriptions = weatherDescriptions;
    }
}

//hämtar städer som redan finns.. unvika anrop
const weatherCache = {};
let counter = 23; //counter som ej kommer direkt fungera..

export async function getWeatherDataFunc(city) {
    
    if(counter == 95){ //skulle användas för ratelimit
        //dock hade vi behövt hämta det som imageAPi.js istället
        //liksom live så att den uppdateras.. men stod inge i dokumetnationen
        //att de hade ngn rate_limit header
        return alert("Rate Limit is a 100 requests!")
        
    }
    if (weatherCache[city]) { //om det redan finns ett cache sparat med denna stad..
        // gör aldrig ett nytt nätverks anrop! detta är för att vi ej ska skicka för många req!
        //så om vi hämtar malmö, i nästa sekvens också hämtar malmö, blir det samma;
        //t ex om vi redigerar en lista vill vi ju inte den skickar en ny request varje gng
        //vi öppnar den!
        return weatherCache[city];
    }

    const url = `http://localhost:8000/weather`; //hårdkodad endpoint, ahde ikunnat vara så base.url o så

    let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ city: city }),
    });
    const weatherObject = await response.json();
    counter++ //varje gång du gör ett nytt anrop kommer den öka
    //men så fort du startar om servern eller liknande kommer den ju sättas till 23..
    //så vi har inte riktigt ngn check om ratelimit

    const weather = new WeatherData( //skapar ett nytt projekt och tar ut det viktigaste!
        //vi vill ju inte bara skicka tillbaka allt..
        //objektet vi får av weatherstaack innehåller massa "onödigt.."
        weatherObject.current.temperature,
        weatherObject.location.localtime,
        weatherObject.location.country,
        weatherObject.current.weather_descriptions[0]
    );

    weatherCache[city] = weather;
    return weather;
}