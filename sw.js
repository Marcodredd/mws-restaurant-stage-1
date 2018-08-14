var staticCacheName = 'restaurant-info';

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      return cache.addAll([
        //cache all static files
        '/',
        'index.html',
        'restaurant.html',
        'js/dbhelper.js',
        'js/main.js',
        'sw.js',
        'img/',
        'js/restaurant_info.js',
        'css/styles.css',
        'https://fonts.googleapis.com/css?family=Ubuntu',
        'https://fonts.googleapis.com/css?family=Fira+Sans',
        'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={pk.eyJ1IjoibGV0ZSIsImEiOiJjamtmZmdlbmYwNml0M2tvNmRuNjAxb2ZwIn0.hS92_IFDLZxJJAuo6V8G3Q}'
      ]);
    })
  );
});

self.addEventListener('fetch', function (event) {
  var requestUrl = new URL(event.request.url);
  if (requestUrl.pathname === '/restaurant.html') {
    console.log(requestUrl);
    event.respondWith(caches.match('/restaurant.html'));
    return;
  }
  if (requestUrl.pathname.startsWith('/data')) {
    event.respondWith(
      caches.open(staticCacheName).then((cache) => {
        return cache.match(event.request.url).then((cacheResponse) => {
          var netFetch = fetch(event.request).then((netResponse) => {
            cache.put(event.request.url, netResponse.clone());
            return netResponse;
          });

          return cacheResponse || netFetch;
        })
      })
    );
    return;
  }


  event.respondWith(
    caches.open(staticCacheName).then((cache) => {
      return cache.match(event.request).then((response) => {
        return response || fetch(event.request);
      });
    })
  );
});

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});