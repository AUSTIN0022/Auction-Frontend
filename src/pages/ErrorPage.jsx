// src/pages/ErrorPage.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ErrorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [errorType, setErrorType] = useState('forbidden');
  const [message, setMessage] = useState(
    "You don't have permission to access this page. Please log in with appropriate credentials."
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setErrorType(params.get('type') || 'forbidden');
    setMessage(
      params.get('message') ||
        "You don't have permission to access this page. Please log in with appropriate credentials."
    );
  }, [location.search]);

  const config = {
    unauthorized: {
      icon: 'fa-user-lock',
      title: 'Authentication Required',
      className: 'bg-yellow-500',
    },
    forbidden: {
      icon: 'fa-ban',
      title: 'Access Denied',
      className: 'bg-red-500',
    },
    'not-found': {
      icon: 'fa-search',
      title: 'Page Not Found',
      className: 'bg-blue-500',
    },
    'server-error': {
      icon: 'fa-exclamation-triangle',
      title: 'Server Error',
      className: 'bg-gray-800',
    },
  };

  const { icon, title, className } = config[errorType] || config['forbidden'];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full overflow-hidden">
        <div className={`p-6 text-white text-center ${className}`}>
          <i className={`fas ${icon} text-4xl mb-2`}></i>
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        <div className="p-6 text-center">
          <p className="text-gray-600 mb-4">{message}</p>
          <div className="flex flex-col gap-3 items-center">
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow"
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-full"
            >
              Back to Home
            </button>
          </div>
        </div>
        <footer className="text-center text-sm text-gray-400 py-3">
          &copy; 2025 BidBazaar. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default ErrorPage;
