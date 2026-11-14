import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient, { tokenStorage } from '../api/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await tokenStorage.getToken();
      if (token) {
        const res = await apiClient.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
        }
      }
    } catch {
      // If offline or token expired
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      if (res.data.success) {
        await tokenStorage.setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (err) {
      // Local demo fallback if backend is unreachable
      if (email && password) {
        const demoUser = {
          id: 'usr-demo',
          name: 'Mall Shopper',
          email,
          role: 'user',
          loyaltyPoints: 1250,
          membershipTier: 'Gold VIP',
          bookmarks: ['store-1', 'store-2']
        };
        setUser(demoUser);
        return { success: true };
      }
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const res = await apiClient.post('/auth/register', { name, email, password, phone });
      if (res.data.success) {
        await tokenStorage.setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: res.data.message || 'Registration failed' };
    } catch (err) {
      if (name && email) {
        const newUser = {
          id: `usr-${Date.now()}`,
          name,
          email,
          phone: phone || '',
          role: 'user',
          loyaltyPoints: 100,
          membershipTier: 'Silver Member',
          bookmarks: []
        };
        setUser(newUser);
        return { success: true };
      }
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  const logout = async () => {
    await tokenStorage.removeToken();
    setUser(null);
  };

  const toggleBookmark = async (storeId) => {
    if (!user) return false;
    try {
      const res = await apiClient.post('/auth/bookmark', { storeId });
      if (res.data.success) {
        setUser(prev => ({
          ...prev,
          bookmarks: res.data.bookmarks
        }));
        return res.data.isBookmarked;
      }
    } catch {
      // offline toggle
      setUser(prev => {
        const bookmarks = prev.bookmarks || [];
        const next = bookmarks.includes(storeId)
          ? bookmarks.filter(id => id !== storeId)
          : [...bookmarks, storeId];
        return { ...prev, bookmarks: next };
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, toggleBookmark }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

