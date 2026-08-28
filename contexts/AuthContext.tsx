'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/mock-data';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isPhoneVerified: boolean;
  isLineBound: boolean;
  isOrderLinked: boolean;
  isAiAssessed: boolean;
  products: any[];
  login: (phone: string, code: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  setPhoneVerified: (verified: boolean) => void;
  setLineBound: (bound: boolean) => void;
  setOrderLinked: (linked: boolean) => void;
  setAiAssessed: (assessed: boolean) => void;
  updateProducts: (products: any[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isLineBound, setIsLineBound] = useState(false);
  const [isOrderLinked, setIsOrderLinked] = useState(false);
  const [isAiAssessed, setIsAiAssessed] = useState(false);
  const [products, setProducts] = useState([
    {
      id: 'PROD-001',
      name: '957 牛樟芝精華膠囊',
      description: '高純度牛樟芝精華，有效助益體健康',
      image: '',
      status: 'active',
      usage: {
        suggestedTime: '早上飯後、晚上飯後',
        dosage: '1-2 顆',
        interval: '至少120分鐘',
        dailyMax: '不超過 4 顆',
      },
      storage: {
        location: '陰涼乾燥處',
        temperature: '常溫',
        humidity: '避免高濕度',
      },
      warnings: [
        '請用溫開水送服，避免空腹服用',
        '建議飯後 30 分鐘內服用',
        '與其他藥物間隔至少 2 小時',
        '孕期、哺乳期或特殊疾病者請諮詢醫師',
        '避免與咖啡、茶、酒精同時服用',
      ],
    },
  ]);

  // 從 localStorage 加載用戶數據
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedPhoneVerified = localStorage.getItem('phoneVerified');
    const savedLineBound = localStorage.getItem('lineBound');
    const savedOrderLinked = localStorage.getItem('orderLinked');
    const savedAiAssessed = localStorage.getItem('aiAssessed');
    const savedProducts = localStorage.getItem('products');
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('user');
      }
    }
    
    if (savedPhoneVerified) {
      setIsPhoneVerified(savedPhoneVerified === 'true');
    }
    
    if (savedLineBound) {
      setIsLineBound(savedLineBound === 'true');
    }
    
    if (savedOrderLinked) {
      setIsOrderLinked(savedOrderLinked === 'true');
    }
    
    if (savedAiAssessed) {
      setIsAiAssessed(savedAiAssessed === 'true');
    }

    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error('Failed to parse saved products:', error);
        localStorage.removeItem('products');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (phone: string, code: string) => {
    // 在實際應用中，這裡會調用 API
    // 測試版本直接設置用戶
    const mockUser: User = {
      id: 'USER-001',
      name: '測試會員',
      phone,
      email: 'test@example.com',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    // 登入時設置手機已驗證
    setIsPhoneVerified(true);
    localStorage.setItem('phoneVerified', 'true');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // 重定向到登入頁面
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const setPhoneVerified = (verified: boolean) => {
    setIsPhoneVerified(verified);
    localStorage.setItem('phoneVerified', String(verified));
  };

  const setLineBound = (bound: boolean) => {
    setIsLineBound(bound);
    localStorage.setItem('lineBound', String(bound));
  };

  const setOrderLinked = (linked: boolean) => {
    setIsOrderLinked(linked);
    localStorage.setItem('orderLinked', String(linked));
  };

  const setAiAssessed = (assessed: boolean) => {
    setIsAiAssessed(assessed);
    localStorage.setItem('aiAssessed', String(assessed));
  };

  const updateProducts = (newProducts: any[]) => {
    setProducts(newProducts);
    localStorage.setItem('products', JSON.stringify(newProducts));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isPhoneVerified,
        isLineBound,
        isOrderLinked,
        isAiAssessed,
        products,
        login,
        logout,
        updateUser,
        setPhoneVerified,
        setLineBound,
        setOrderLinked,
        setAiAssessed,
        updateProducts,
      }}
    >
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