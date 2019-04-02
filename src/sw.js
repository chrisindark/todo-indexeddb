'use strict';

console.log('Started', self);
self.addEventListener('install', function (event) {
    self.skipWaiting();
    console.log('Installed', event);
});

self.addEventListener('activate', function (event) {
    console.log('Activated', event);
});
