import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import api from '../services/api';

// Define the shape of the user object and auth context
interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'merchant' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the provider
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provides authentication state to its children components.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUserFromToken = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          // Verify token with backend and get user data
          const response = await api.get('/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data.user); // Assuming backend returns { user: User }
        } catch (error) {
          console.error('Failed to load user from token:', error);
          localStorage.removeItem('accessToken'); // Clear invalid token
          setUser(null);
        }
      }
    };

    loadUserFromToken();
  }, []); // Run only once on component mount

  const login = async (email: string, password: string) => { // Changed signature
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, user } = response.data; // Destructure accessToken and user
      localStorage.setItem('accessToken', accessToken);
      setUser(user); // Set the user object
    } catch (error: any) {
      console.error('AuthContext: Login failed:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    // TODO: Call a /api/auth/logout endpoint to invalidate refresh token on the server
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the authentication context.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
