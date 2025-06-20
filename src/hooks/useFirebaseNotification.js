// src/hooks/useFirebaseNotification.js
import { useEffect } from 'react';
import { showNotificationToast } from '../components/shared/Toast';
import { registerToken } from '../services/notification';
import { getToken, messaging, onMessage } from '../utils/firebase';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY; 

export default function useFirebaseNotification({ userId, role }) {
  useEffect(() => {
    if (!userId || !role) return;
    
    const requestPermissionAndRegister = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.warn('Permission not granted for notifications');
          return;
        }

        const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        if (token) {
          // Send token to backend
          await registerToken({ token, userId, role });
          console.log('FCM token registered:', token);
        }
      } catch (error) {
        console.error('Error getting FCM token:', error);
      }
    };

    requestPermissionAndRegister();

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Foreground message received:');
      
      // Use custom toast instead of react-hot-toast default
      showNotificationToast(payload);
    });

    return () => unsubscribe();
  }, [userId, role]);
}