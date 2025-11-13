// Importamos las versiones compat de Firebase para SW
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// Configuración igual que en app.js
firebase.initializeApp({
 apiKey: "AIzaSyAkQWlKHutHTntaP6LimMXh4LhSkqc2Y28",
  authDomain: "pwa-10d-bb33f.firebaseapp.com",
  projectId: "pwa-10d-bb33f",
  storageBucket: "pwa-10d-bb33f.firebasestorage.app",
  messagingSenderId: "108268044358",
  appId: "1:108268044358:web:ec735b7b62df61ac3cca47"
});

const messaging = firebase.messaging();

// Evento cuando llega un mensaje en segundo plano
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "Notificación";
  const options = {
    body: payload.notification?.body || "",
    
  };
  self.registration.showNotification(title, options);
});

// Manejar clics en la notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});