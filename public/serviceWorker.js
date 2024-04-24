const CACHE_NAME = 'version-1';
const urlsToCache = ['index.html', 'offline.html'];

const self = this;

// Install SW
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log('Opened cache');

			return cache.addAll(urlsToCache);
		})
	);
});

// // Listen for requests
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//       caches.match(event.request).then(function(res){
//           if(res){
//               return res;
//           }
//           return requestBackend(event);
//       })
//   )
// });

// Activate the SW
self.addEventListener('activate', (event) => {
	const cacheWhitelist = [];
	cacheWhitelist.push(CACHE_NAME);

	event.waitUntil(
		caches.keys().then((cacheNames) =>
			Promise.all(
				cacheNames.map((cacheName) => {
					if (!cacheWhitelist.includes(cacheName)) {
						return caches.delete(cacheName);
					}
				})
			)
		)
	);
});