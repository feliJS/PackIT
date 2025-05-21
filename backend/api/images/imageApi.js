async function handler(req) {
  const reqUrl = new URL(req.url);
  const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
  };

  if(req.method == "POST" && reqUrl.pathname == "/randomimage") {
    let body = await req.json();
    const imagesDB = readImages();
    if(!imagesDB.images[body.content]) imagesDB.images[body.content] = []; // lägg till om ej finns
    let random = await getRandomImage(body.content);
    if(random == null) {
      random = imagesDB.images[body.content][Math.floor(Math.random() * imagesDB.images[body.content].length)];
    } else {
      imagesDB.images[body.content].push(random);
      writeImages(imagesDB);
    }
    return new Response(random, { headers: corsHeaders });
  }
}

const DB_PATH = "../../databaser/images.json";

async function readImages() {
  const data = await Deno.readTextFile(DB_PATH);
  return JSON.parse(data);
}

async function writeImages(images) {
  await Deno.writeTextFile(DB_PATH, JSON.stringify(images, null, 2));
}

const ACCESS_KEY = ""; // ← Ersätt med din riktiga API-nyckel

async function getRandomImage(content) {
  let images = readImages();
  let timeDiff = Date.now() - images.ratelimit.lastChecked;
  if(images.ratelimit.remaining >= 25 || timeDiff >= 1000*60*60) {
    const response = await fetch(`https://api.unsplash.com/photos/random?query=${content}&content_filter=high&client_id=${ACCESS_KEY}`);
    images.ratelimit.remaining = response.headers.get("X-Ratelimit-Remaining");
    images.ratelimit.lastChecked = Date.now();
    writeImages(images);
    if(response.status == 200) {
      const data = await response.json();
      return data.urls.small;
    }
  }
  return null;
}

Deno.serve({ port: 4200 }, handler);