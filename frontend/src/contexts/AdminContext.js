import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { adminApi } from '../services/api';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const checkTokenExpiry = () => {
    const tokenExpiry = localStorage.getItem('adminTokenExpiry');
    if (!tokenExpiry) return false;

    const expiryTime = parseInt(tokenExpiry, 10);
    const now = Date.now();

    if (now >= expiryTime) {
      // Token has expired
      handleLogout();
      return false;
    }
    return true;
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // Check token expiry first
      if (!checkTokenExpiry()) {
        setLoading(false);
        return;
      }

      try {
        await adminApi.verifyToken(token);
        setIsAuthenticated(true);
        // If we're on the login page and already authenticated, redirect to admin
        if (location.pathname === '/admin/login') {
          navigate('/admin');
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token, navigate, location.pathname]);

  const handleLogin = async (username, password) => {
    try {
      const { token, expiresIn } = await adminApi.login(username, password);
      
      if (token) {
        // Store token and expiry time
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminTokenExpiry', String(Date.now() + expiresIn));
        setToken(token);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminTokenExpiry');
    setToken(null);
    setIsAuthenticated(false);
    navigate('/admin/login');
  };

  // Add a method to check auth status that can be called manually
  const checkAuthStatus = async () => {
    if (!token || !checkTokenExpiry()) {
      handleLogout();
      return false;
    }

    try {
      await adminApi.verifyToken(token);
      return true;
    } catch (error) {
      handleLogout();
      return false;
    }
  };

  const value = {
    isAuthenticated,
    token,
    loading,
    login: handleLogin,
    logout: handleLogout,
    checkAuthStatus
  };

  return (
    <AdminContext.Provider value={value}>
      {!loading && <Outlet />}
    </AdminContext.Provider>
  );
};

export default AdminContext; 
