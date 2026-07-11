const CACHE_NAME="results-system-v1";
const FILES_TO_CACHE=[
"/results",
"/results.html",
"/results.webmanifest",
"/favicon.png"
];

self.addEventListener("install",event=>{
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache=>cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate",event=>{
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET") return;
  event.respondWith(
    caches.match(event.request).then(response=>{
      return response||fetch(event.request).then(networkResponse=>{
        const copy=networkResponse.clone();
        caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));
        return networkResponse;
      }).catch(()=>caches.match("/results.html"));
    })
  );
});
