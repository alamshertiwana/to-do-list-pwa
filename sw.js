var cacheName = 'mob-v1';
var version ='?v=5';


self.addEventListener('install', function(e) {

    e.waitUntil(
      caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
            if(key !== cacheName) {
              console.log('Cache Deleted');
              return caches.delete(key);
            }
        }));
      })
    );

    e.waitUntil(
      caches.open(cacheName).then(function(cache) {
        return cache.addAll([
          '/'+version,
          'index.html'+version,
          'add.html'+version,
          'help.html'+version,
          'detail.html'+version,
          'help.json'+version,
          'material-components-web.min.css'+version,
          'material-components-web.min.js'+version,
          'https://fonts.gstatic.com/s/materialicons/v126/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2'+version,
          'style.css'+version
        ]);
      }).catch(function(error) {
        console.log(error);
      })
    );
});


self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
          return Promise.all(keyList.map((key) => {
        if(key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('message', function (event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});


function fetchAndCache(url) {
  return fetch(url)
  .then(function(response) {
    // Check if we received a valid response
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return caches.open(cacheName)
    .then(function(cache) {
      cache.put(url, response.clone());
      return response;
    });
  })
  .catch(function(error) {
    console.log('Request failed:', error, url);
    // You could return a custom offline 404 page here
  });
}