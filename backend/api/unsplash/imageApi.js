export async function imageHandler(req) {
  const reqUrl = new URL(req.url);
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method == "POST" && reqUrl.pathname == "/image/randomimage") {
    let body = await req.json(); //läser in json...
    if (!body.content) {//.. som borde ha content: som en key, du måste ange vilken typ av bild
      return new Response(JSON.stringify({ error: "Bild måste anges" }), {
        status: 400,
        headers: { ...corsHeaders, "content-type": "application/json" }
      });
    }
    const imagesDB = await readImages(); //läser in json filen som håller koll på tidigare hämtade bilder + rate limit!
    //om det inte finns en array för den givna söktermen, skapa en tom.
    if (!imagesDB.images[body.content]) imagesDB.images[body.content] = [];
    //anropa randomImage som returnerar ett objekt med url och ratelimit saker.
    let randomImage = await getRandomImage(body.content);
    imagesDB.ratelimit = randomImage.ratelimit; //uppdaterar rateLimit i cachen med 
    //det nya värdet  (alltså bytar ut det i databasen)
    if (randomImage.url == null) { //om getRandomImage inte kunde returnera ngn bild
      //(av ratelimit skäl eller fel-)
      //kontrollerar vi ifall det finns några andra cachade bilder för just den body.content
      if (!imagesDB.images[body.content] || imagesDB.images[body.content].length == 0) {
        //om inga cachade bilder finns, returnera error.
        return new Response(JSON.stringify({ error: "Bild kunde inte hämtas" }), {
          status: 404,
          headers: { ...corsHeaders, "content-type": "application/json" }
        });
      }
      //annars hämta en random bild från images med rätt body.content! 
      //en redan hämtad bild så att säga.
      randomImage.url = imagesDB.images[body.content][Math.floor(Math.random() * imagesDB.images[body.content].length)];
    } else {
      //men låt oss säga om vi faktiskt fick ett url av unsplash! ja men perfekt. lägg det
      //i cachen för framtida skäl!
      imagesDB.images[body.content].push(randomImage.url);
    }
    await writeImages(imagesDB); //skriv sedan det till databasen
    //detta ger oss en ny bild i databasen
    //...men det som vi faktiskt bryr oss om är ju randomImage url vilket är den nya bilden!
    return new Response(randomImage.url, { headers: corsHeaders });
  }
}

const DB_PATH = "../databaser/images.json";

async function readImages() {
  const data = await Deno.readTextFile(DB_PATH);
  return JSON.parse(data);
}

async function writeImages(images) {
  await Deno.writeTextFile(DB_PATH, JSON.stringify(images, null, 2));
}

let ACCESS_KEY = ""; //declarerar en variabel acceskey.
(async () => { //Denna anropas direkt när man läser in imageApi.js
  //alltså så deklarerar du och anropar funktionen här
  //det är för att den måste vara async och för readTextFile är async jmfr. readTextFileSync
  //men vi vill ju ha den direkt! 
  ACCESS_KEY = JSON.parse(await Deno.readTextFile("../../apiKeys.json"))[0]["API_UNSPLASH"];
})()

//Hämtar antingen en ny slumpad bild‐URL från Unsplash‐API (om ratelimit tillåter) eller returnerar url = null så att cachen används istället.
async function getRandomImage(content) {
  let result = {
    //objektet nedan är viktigt!
    //vi har bara 50 anrop per 1 timme i unsplash.
    //för att vara säkra!
    //ratelimit.remaining: antalet anrop kvar innan API:et stryper (här initierat till 50).
    //ratelimit.lastChecked: när ratelimit‐informationen senast uppdaterades (initieras till 0 timestamp).
    //url: själva bilden!
    "ratelimit": {
      "remaining": 50,
      "lastChecked": 0
    },
    "url": null
  };
  //läser in alla bilder.
  let images = await readImages();
  //Tar ratelimit‐informationen från cachen och sätter in i result.ratelimit (det den blir efter man uppdaterar)
  result.ratelimit = images.ratelimit;
  //Räknar ut hur många millisekunder sedan ratelimit senast kontrollerades.
  let timeDiff = Date.now() - result.ratelimit.lastChecked;
  //Bara om vi har minst 25 anrop kvar, eller om det gått minst en timme (60 min × 60 s × 1000 ms)
  //så kan vi anropa till unsplash o hämta en ny bild!
  if (result.ratelimit.remaining >= 25 || timeDiff >= 1000 * 60 * 60) {
    //hämta bild från externa apiet unsplash..
    const response = await fetch(`https://api.unsplash.com/photos/random?query=${content}&content_filter=high&client_id=${ACCESS_KEY}`);
    //Hämtar hur många anrop vi har kvar (Unsplash returnerar det i headern X-Ratelimit-Remaining) och sparar det i result.ratelimit.remaining.
    result.ratelimit.remaining = response.headers.get("X-Ratelimit-Remaining");
    //sätter tiden till nuvarandre tid!
    result.ratelimit.lastChecked = Date.now();
    //om vi fick tibaks en response!
    if (response.status == 200) {
      //vänta in json datan från responsen av unsplash
      const data = await response.json();
      //och sedan lägg data urln som är small(man kan ha olika sorts bilder)
      //som result url!
      result.url = data.urls.small;
    }
  }
  return result;
}