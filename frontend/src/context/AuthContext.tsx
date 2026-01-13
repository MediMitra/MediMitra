import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, RegisterData, LoginCredentials } from '../api/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  storeId?: number;
}

interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  login: (emailOrCredentials: string | LoginCredentials, passwordParam?: string) => Promise<LoginResponse>;
  register: (userData: RegisterData) => Promise<LoginResponse>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (userData && token) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (emailOrCredentials: string | LoginCredentials, passwordParam?: string): Promise<LoginResponse> => {
    try {
      // Support both login(email, password) and login({ email, password }) formats
      let email: string, password: string;
      
      if (typeof emailOrCredentials === 'object') {
        email = emailOrCredentials.email;
        password = emailOrCredentials.password;
      } else {
        email = emailOrCredentials;
        password = passwordParam || '';
      }

      // Call backend API
      const response = await authAPI.login({ email, password });
      const { token, id, name, email: userEmail, role, storeId } = response.data;
      
      const userData: User = {
        id,
        name,
        email: userEmail,
        role,
        storeId
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Invalid email or password' 
      };
    }
  };

  const register = async (userData: RegisterData): Promise<LoginResponse> => {
    try {
      const response = await authAPI.register(userData);
      const { token, id, name, email, role, storeId } = response.data;
      
      const newUser: User = {
        id,
        name,
        email,
        role,
        storeId
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      return { success: true, user: newUser };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
