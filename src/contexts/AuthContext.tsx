import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { api, type User, type AuthResponse } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  username: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading] = useState(false); // Start as false, no auto-loading

  const isAuthenticated = !!user;

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email });
      const authResponse: AuthResponse = await api.login(email, password);
      console.log('Login successful:', authResponse);
      
      // Set token and user
      api.setToken(authResponse.access_token);
      setUser(authResponse.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      console.log('Attempting registration with:', { ...data, password: '[HIDDEN]' });
      const authResponse: AuthResponse = await api.register(data);
      console.log('Registration successful:', authResponse);
      
      // Set token and user
      api.setToken(authResponse.access_token);
      setUser(authResponse.user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out user');
    api.clearToken();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};