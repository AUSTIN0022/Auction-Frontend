# 🧿 Auction Frontend

This is a modern React frontend built with **Vite** for an online auction platform. It includes complete support for user and admin layouts, Firebase push notifications, and a modular component-based architecture ready for production deployment on **Vercel**.

---

## 🚀 Features

- ⚡ Fast Development with Vite
- 🧑‍💼 Admin Dashboard with Sidebar, Header, and Auction Management
- 🔔 Firebase Push Notifications (Service Worker Setup)
- 🧩 Reusable UI Components (Modal, Toasts, Navbar)
- 📦 Environment-based Configuration (via `.env`)
- 🖼️ Responsive UI and clean layout
- ☁️ Vercel deployment support
- 🧠 Cleanly organized structure with layouts, hooks, and routes

---

## 📁 Project Structure

```
├── public/
│ ├── firebase-messaging-sw.js # Firebase messaging worker
│ └── images and icons
├── src/
│ ├── assets/ # Static assets
│ ├── components/
│ │ ├── admin/ # Admin-specific components
│ │ └── shared/ # Shared UI components
│ ├── hooks/ # Custom hooks (e.g., useFirebaseNotification)
│ ├── layouts/ # Admin and User layout wrappers
│ ├── pages/
│ │ ├── admin/ # Admin Pages (CreateAuction, Auction List)
│ │ └── LandingPage, ErrorPage
│ ├── App.jsx # Root component
│ └── main.jsx # Vite entrypoint
├── scripts/generate-sw.js # Generates Service Worker
├── .env # Environment Variables
├── vite.config.js # Vite config
├── vercel.json # Vercel deployment config
└── package.json
 ```
---

## 🛠️ Getting Started

### 1. Install Dependencies
``` npm install ```

2. Setup .env File
Create a .env file at the root level:
Here are the environment variables used in your project (with sensitive values redacted for safety):

```
VITE_BASE_URL=https://api.bidbazaar.shop

# Firebase Config (for Messaging & App Initialization)
VITE_FIREBASE_API_KEY=***
VITE_FIREBASE_AUTH_DOMAIN=auction-3b256.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=auction-3b256
VITE_FIREBASE_STORAGE_BUCKET=auction-3b256.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=***
VITE_FIREBASE_APP_ID=***
VITE_FIREBASE_MEASUREMENT_ID=***

# Firebase Admin SDK (for server-side Firebase use)
VITE_FIREBASE_TYPE=service_account
VITE_FIREBASE_PRIVATE_KEY_ID=***
VITE_FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvAIBADAN...END PRIVATE KEY-----\n"
VITE_FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@...
VITE_FIREBASE_CLIENT_ID=***
VITE_FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
VITE_FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
VITE_FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
VITE_FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc@...
VITE_FIREBASE_UNIVERSE_DOMAIN=googleapis.com

```
---

3. **Run the Development Server**
``` npm run dev```

4. **Build for Production**
``` npm run build```

### 📦 Firebase Push Notifications
+ Ensure Firebase is configured in .env
+ Register service worker in ```public/firebase-messaging-sw.js```
+ Use ```src/hooks/useFirebaseNotification.js``` for integrating notifications


### 🧩 Component Overview
```src/components/admin/```
+ AdminHeader.jsx – Admin dashboard top navigation.
+ AdminSidebar.jsx – Sidebar with navigational links for admins.

```src/components/shared/```
+ Modal.jsx – Reusable modal component for confirmations or forms.
+ Navbar.jsx – Top-level navigation bar for public views or users.
+ Toast.jsx – Toast notification system for user feedback (success, error, etc.).

### 🧑‍💼 Admin Features
+ View/Create Auctions
+ Custom Sidebar & Header
+ Toast & Modal Integration

### 🚀 Deployment (Vercel)
This project supports zero-config deployment on Vercel.
1. Push to GitHub
2. Connect to vercel.com
3. Set up environment variables under project settings
