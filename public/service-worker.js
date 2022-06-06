/* Creating a constant variable for the app prefix, version, cache name, and files to
cache. */
const APP_PREFIX = "BudgetTrackmaster";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + " " + VERSION;
const FILES_TO_CACHE = ["./index.html"];

/* This is the code that is going to be used to fetch the files from the cache. */
self.addEventListener("fetch", function (e) {
  console.log("fetch request : " + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) {
        console.log("responding to cache : " + e.request.url);
        return request;
      } else {
        console.log("file is not cached, fetching : " + e.request.url);
        return fetch(e.request);
      }
    })
  );
});

/* This is the code that is going to be used to fetch the files from the cache. */
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("generating cache : " + CACHE_NAME);
      console.log(cache);
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

/* This is the code that is going to be used to fetch the files from the cache. */
self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      cacheKeeplist.push(CACHE_NAME);

      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log("removing cache : " + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});
