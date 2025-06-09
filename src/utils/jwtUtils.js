// src/utils/jwtUtils.js
import { jwtDecode } from 'jwt-decode';

export const getUserFromToken = () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    const decoded = jwtDecode(token);
    return decoded;
  } catch (err) {
    console.log(`Error: ${err.message}`);
    return null;
  }
};

export const isTokenExpired = () => {
  const user = getUserFromToken();
  if (!user || !user.exp) return true;
  return Date.now() >= user.exp * 1000;
};


export const getUserRole = () => {
    try {
        const userString = localStorage.getItem('user');
        if (!userString) return null;
        
        const user = JSON.parse(userString);
        
        return user.role;
    } catch (err) {
        console.log(`Error: ${err.message}`);
        return null;
    }
}

export const getCurrentUserId = () => {
    try {
        const userString = localStorage.getItem('user');
        if (!userString) return null;
        
        const user = JSON.parse(userString);

        return user.id;
    } catch (err) {
        console.log(`Error: ${err.message}`);
        return null;
    }
}

export const getUser = () => {
    try {
        const userString = localStorage.getItem('user');
        if (!userString) return null;
        
        return JSON.parse(userString);
    } catch (err) {
        console.log(`Error: ${err.message}`);
        return null;
    }
}