'use strict';

/**
 * ServiceWorker File to be used in the application
 */
self.addEventListener('install', function (installEvent) {
    console.log('[ServiceWorker] Install Event Emitted');
    console.log('[ServiceWorker says] HelloWorld');
    console.log('[ServiceWorker] Hey');
});

self.addEventListener('activate', function (activateEvent) {
    console.log('[ServiceWorker] Activated!');
    console.log('[ServiceWorker] YO!');
});