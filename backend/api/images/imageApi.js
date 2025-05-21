function handler(req) {
    
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
let currentImageUrl = ""; // Sparad bild-URL

async function getRandomImage() {
  const response = await fetch(`https://api.unsplash.com/photos/random?query=animal&content_filter=high&client_id=${ACCESS_KEY}`);
  if(response.status == 200) {
    const data = await response.json();
    return data.urls.small;
  }
}

Deno.serve({ port: 4200 })