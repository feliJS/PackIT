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
    let body = await req.json();
    if (!body.content) {
      return new Response(JSON.stringify({ error: "Bild måste anges" }), {
        status: 400,
        headers: {...corsHeaders,"content-type": "application/json" }
      });
    }
    const imagesDB = await readImages();
    if (!imagesDB.images[body.content]) imagesDB.images[body.content] = []; // lägg till om ej finns
    let randomImage = await getRandomImage(body.content);
    imagesDB.ratelimit = randomImage.ratelimit;
    if (randomImage.url == null) {
      if(!imagesDB.images[body.content] || imagesDB.images[body.content].length == 0){ //om ej finns eller längden på listan är 0
          return new Response(JSON.stringify({ error: "Bild kunde inte hämtas" }), {
          status: 404,
          headers: {...corsHeaders,"content-type": "application/json" }
        });
      }
      randomImage.url = imagesDB.images[body.content][Math.floor(Math.random() * imagesDB.images[body.content].length)];
    } else {
      imagesDB.images[body.content].push(randomImage.url);
    }
    await writeImages(imagesDB);
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

let ACCESS_KEY = "";
(async () => {
  ACCESS_KEY = JSON.parse(await Deno.readTextFile("../../apiKeys.json"))[0]["API_UNSPLASH"];
})()

async function getRandomImage(content) {
  let result = {
    "ratelimit": {
      "remaining": 50,
      "lastChecked": 0
    },
    "url": null
  };
  let images = await readImages();
  result.ratelimit = images.ratelimit;
  let timeDiff = Date.now() - result.ratelimit.lastChecked;
  if (result.ratelimit.remaining >= 25 || timeDiff >= 1000 * 60 * 60) {
    const response = await fetch(`https://api.unsplash.com/photos/random?query=${content}&content_filter=high&client_id=${ACCESS_KEY}`);
    result.ratelimit.remaining = response.headers.get("X-Ratelimit-Remaining");
    result.ratelimit.lastChecked = Date.now();
    if (response.status == 200) {
      const data = await response.json();
      result.url = data.urls.small;
    }
  }
  return result;
}