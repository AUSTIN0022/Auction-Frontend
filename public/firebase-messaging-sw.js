// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase in service worker using the same config
firebase.initializeApp({
  apiKey: "AIzaSyAGH_yE_Fo7Yyj99cBUBB6Hol5gk_jZ40g",
  authDomain: "auction-3b256.firebaseapp.com",
  projectId: "auction-3b256",
  storageBucket: "auction-3b256.firebasestorage.app",
  messagingSenderId: "165002779847",
  appId: "1:165002779847:web:e0dc73b92f92a70517b2e2",
  measurementId: "BO-xbv_VZHICsdwVIpzEcTQ-ChtlP8KqsVA1b7qqMd6TCfP6FqiNU1g1YZPfkSCwhk8QNdmAil5IDMN4BQAIb_8"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);
  
  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message',
    icon: '/favicon.ico', // Use your app icon
    badge: '/favicon.ico',
    tag: 'notification-' + Date.now(),
    requireInteraction: false,
    silent: false
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  // Open your app when notification is clicked
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If app is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // If app is not open, open it
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});