import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import sampleData from '../assets/sample_data.json';

interface User {
  id: number;
  role: string;
  username: string;
  name: string;
  location: string;
  points: number;
  status: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('recircle_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('recircle_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string, role: string) => {
    try {
      // Mock authentication using sample data
      const user = sampleData.users.find(
        u => u.username === username && u.password === password && u.role === role
      );
      
      if (user) {
        const userData = {
          id: user.id,
          role: user.role,
          username: user.username,
          name: user.name,
          location: user.location,
          points: user.points,
          status: user.status,
          token: `mock_token_${user.id}`,
        };
        setUser(userData);
        localStorage.setItem('recircle_user', JSON.stringify(userData));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('recircle_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};