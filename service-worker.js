const CACHE_NAME = "music-app-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./songs.json",
  "./Songs/Aavan_Jaavan.mp3",
  "./Songs/Apna_Bana_Le.mp3",
  "./Songs/Bheegi_Si_Bhaagi_Si.mp3",
  "./Songs/Girl_I_Need_You.mp3",
  "./Songs/Humsafar.mp3",
  "./Songs/Ik_Vaari_Aa.mp3",
  "./Songs/Itni_Si_Baat_Hai.mp3",
  "./Songs/Khoobsurat.mp3",
  "./Songs/Leja_Re.mp3",
  "./Songs/Pehla_Pyaar.mp3",
  "./Songs/Phir_Kabhi.mp3",
  "./Songs/Raanjhana_Ve_Lofi.mp3",
  "./Songs/Raat_Bhar.mp3",
  "./Songs/Rasiya.mp3",
  "./Songs/Shaky.mp3",
  "./Songs/Tera_Ban_Jaunga.mp3",
  "./Songs/Tera_Fitoor.mp3",
  "./Songs/Tera_Hi_Rahoon.mp3",
  "./Songs/Tera_Hone_Laga_Hoon.mp3",
  "./Songs/Tera_Hua.mp3",
  "./Songs/Tu_Chahiye.mp3",
  "./Songs/Tu_Meri.mp3",
  "./Songs/Tum_Jo_Aaye.mp3",
  "./Songs/Tum_Se_Hi.mp3",
  "./Songs/Vaaste.mp3",
  "./Icons/icon-192.png",
  "./Icons/icon-512.png",
  "./Icons/icon-maskable.png"
];

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});