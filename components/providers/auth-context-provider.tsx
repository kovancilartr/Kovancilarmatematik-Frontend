"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiClient, LoginRequest, LoginResponse } from '../../lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'kovancilar_access_token';
const REFRESH_TOKEN_KEY = 'kovancilar_refresh_token';
const USER_KEY = 'kovancilar_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!accessToken;

  // Synchronize apiClient with the accessToken from state
  useEffect(() => {
    apiClient.setAccessToken(accessToken);
  }, [accessToken]);

  const clearAuthState = useCallback(() => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      
      // Clear cookie
      document.cookie = 'kovancilar_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      
      setAccessToken(null);
      setUser(null);
    } catch (error) {
      console.error('Failed to clear auth state:', error);
    }
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      
      if (!storedRefreshToken) {
        clearAuthState();
        return false;
      }

      const response = await apiClient.refreshToken(storedRefreshToken);

      if (response.success && response.data) {
        const newTokens = response.data.tokens;
        
        // Update tokens
        localStorage.setItem(TOKEN_KEY, newTokens.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, newTokens.refreshToken);
        setAccessToken(newTokens.accessToken);
        
        return true;
      } else {
        clearAuthState();
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      clearAuthState();
      return false;
    }
  }, [clearAuthState]);

  // Set the auth failure handler on the api client
  useEffect(() => {
    apiClient.setAuthFailureHandler(refreshToken);
  }, [refreshToken]);


  // Load auth state from localStorage on mount
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          setAccessToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Also set cookie for middleware
          document.cookie = `kovancilar_access_token=${storedToken}; path=/; max-age=${15 * 60}`; // 15 minutes
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
        clearAuthState();
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, [clearAuthState]);

  const saveAuthState = (loginResponse: LoginResponse) => {
    try {
      localStorage.setItem(TOKEN_KEY, loginResponse.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, loginResponse.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(loginResponse.user));
      
      // Set cookie for middleware
      document.cookie = `kovancilar_access_token=${loginResponse.accessToken}; path=/; max-age=${15 * 60}`; // 15 minutes
      
      setAccessToken(loginResponse.accessToken);
      setUser(loginResponse.user);
    } catch (error) {
      console.error('Failed to save auth state:', error);
    }
  };

  const login = async (credentials: LoginRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const response = await apiClient.login(credentials);

      if (response.success && response.data) {
        saveAuthState(response.data);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error?.message || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Network error occurred' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      
      if (storedRefreshToken) {
        // Try to logout from backend, but don't wait for it
        apiClient.logout(storedRefreshToken).catch(console.error);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthState();
    }
  };

  const value: AuthContextType = {
    user,
    accessToken,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}