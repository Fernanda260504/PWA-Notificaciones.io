// Importamos los módulos de Firebase desde CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getMessaging, getToken, onMessage, isSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

// Configuración obtenida desde Firebase Console
const firebaseConfig = {
 apiKey: "AIzaSyAkQWlKHutHTntaP6LimMXh4LhSkqc2Y28",
  authDomain: "pwa-10d-bb33f.firebaseapp.com",
  projectId: "pwa-10d-bb33f",
  storageBucket: "pwa-10d-bb33f.firebasestorage.app",
  messagingSenderId: "108268044358",
  appId: "1:108268044358:web:ec735b7b62df61ac3cca47"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Utilidades para manipular el DOM
const $ = (sel) => document.querySelector(sel);
const log = (m) => ($("#log").textContent += ( ($("#log").textContent === "—" ? "" : "\n") + m));

// Mostramos el estado inicial del permiso
$("#perm").textContent = Notification.permission;

// Registramos el Service Worker que manejará las notificaciones en segundo plano
let swReg;
if ('serviceWorker' in navigator) {
  swReg = await navigator.serviceWorker.register('./firebase-messaging-sw.js');
  console.log('SW registrado:', swReg.scope);
}  

// Verificamos si el navegador soporta FCM
const supported = await isSupported();
let messaging = null;

if (supported) {
  messaging = getMessaging(app);
} else {
  log("Este navegador no soporta FCM en la Web.");
}

// Clave pública VAPID (de Cloud Messaging)
const VAPID_KEY = "BL_VI3q6eVEfwxbjlGN8AX4cXtblMDHjSofwlwKS-VUyI1IK0v-h_5VkiNDBSQLvPXUlndhWptOZmHAUOE269lU";

// Función para pedir permiso al usuario y obtener token
async function requestPermissionAndGetToken() {
  try {
    const permission = await Notification.requestPermission();
    $("#perm").textContent = permission;

    if (permission !== 'granted') {
      log("Permiso denegado por el usuario.");
      return;
    }

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swReg,
    });

    if (token) {
      $("#token").textContent = token;
      log("Token obtenido. Usa este token en Firebase Console → Cloud Messaging.");
    } else {
      log("No se pudo obtener el token.");
    }
  } catch (err) {
    console.error(err);
    log("Error al obtener token: " + err.message);
  }
}

// Escuchamos mensajes cuando la pestaña está abierta
if (messaging) {
  onMessage(messaging, (payload) => {
    log("Mensaje en primer plano:\n" + JSON.stringify(payload, null, 2));
  });
}

// Vinculamos la función al botón de permiso
$("#btn-permission").addEventListener("click", requestPermissionAndGetToken);
