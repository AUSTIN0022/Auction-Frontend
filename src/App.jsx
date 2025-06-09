// App.jsx
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import useFirebaseNotification from './hooks/useFirebaseNotification';
import { Toaster } from 'react-hot-toast';
import { getUser } from './utils/jwtUtils';
import { useEffect, useState } from 'react';
// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import CreateAuction from './pages/admin/CreateAuction';
import AdminDashboard from './pages/admin/Dashboard';
import EditAuction from './pages/admin/EditAuction';
import UserDetails from './pages/admin/UserDetails';
import UserVerification from './pages/admin/UserVerification';
import ViewAuctions from './pages/admin/ViewAuctions';

// User Pages
import AuctionDetail from './pages/user/AuctionDetail';
import BrowseAuctions from './pages/user/BrowseAuctions';
import Checkout from './pages/user/Checkout';
import PaymentStatus from './pages/user/PaymentStatus';
import UserDashboard from './pages/user/UserDashboard';

import LandingPage from './pages/LandingPage';
// Layouts

// Routes
import ProtectedRoute from './routes/ProtectedRoute';

// Error Pages
import ErrorPage from './pages/ErrorPage';
import Auction from './pages/admin/Auction';

function App() {
    
    const [user, setUser] = useState({ userId: null, role: null });
    const [isUserLoaded, setIsUserLoaded] = useState(false);

    useEffect(() => {
        const loadUser = () => {
            try {
                const userDetails = getUser();
                if (userDetails && userDetails.id) {
                    setUser({ 
                        userId: userDetails.id, 
                        role: userDetails.role 
                    });
                } else {
                    setUser({ userId: null, role: null });
                }
            } catch (error) {
                console.error('Error loading user:', error);
                setUser({ userId: null, role: null });
            } finally {
                setIsUserLoaded(true);
            }
        };

        loadUser();

        // Optional: Listen for storage changes (when user logs in/out)
        const handleStorageChange = (e) => {
            if (e.key === 'token' || e.key === 'user') {
                loadUser();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Only initialize Firebase notifications after user is loaded
    useFirebaseNotification(isUserLoaded ? user : { userId: null, role: null });


  return (
    <>
    <Toaster position="top-right"/>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Shared Routes - Accessible by both admin and user
          <Route element={<ProtectedRoute />}>
            <Route path="/auctions" element={<BrowseAuctions />} />
            <Route path="/auctions/:id" element={<AuctionDetail />} />
          </Route> */}

          {/* User-Only Protected Routes */}
          <Route element={<ProtectedRoute role="user" />}>
            <Route path="/dashboard" element={<UserDashboard />} />
             <Route path="/auctions" element={<BrowseAuctions />} />
            <Route path="/auctions/:id" element={<AuctionDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentStatus status="success" />} />
            <Route path="/payment-failure" element={<PaymentStatus status="failure" />} />
          </Route>

          {/* Admin-Only Protected Routes */}
          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/view-auctions" element={<ViewAuctions />} />
             <Route path="/auction/:id" element={<Auction />} />
            <Route path="/create-auction" element={<CreateAuction />} />
            <Route path="/auctions/edit/:id" element={<EditAuction />} />
            <Route path="/user-verification" element={<UserVerification />} />
            <Route path="/user-detail/:id" element={<UserDetails />} />
          </Route>

          {/* Error Pages */}
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;