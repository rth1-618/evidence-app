import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'field-officer' | 'custodian' | 'investigator' | 'evidence-manager';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  badge?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS: Record<string, User & { password: string }> = {
  'officer@police.uk': {
    id: '1',
    email: 'officer@police.uk',
    password: 'officer123',
    name: 'John Mitchell',
    role: 'field-officer',
    badge: 'FO-2451'
  },
  'custodian@police.uk': {
    id: '2',
    email: 'custodian@police.uk',
    password: 'custodian123',
    name: 'Sarah Williams',
    role: 'custodian',
    badge: 'CS-1892'
  },
  'investigator@police.uk': {
    id: '3',
    email: 'investigator@police.uk',
    password: 'investigator123',
    name: 'David Thompson',
    role: 'investigator',
    badge: 'INV-3241'
  },
  'manager@police.uk': {
    id: '4',
    email: 'manager@police.uk',
    password: 'manager123',
    name: 'Elizabeth Carter',
    role: 'evidence-manager',
    badge: 'MGR-5012'
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('decms_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockUser = MOCK_USERS[email.toLowerCase()];
    if (mockUser && mockUser.password === password) {
      const { password: _, ...userWithoutPassword } = mockUser;
      setUser(userWithoutPassword);
      localStorage.setItem('decms_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('decms_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
