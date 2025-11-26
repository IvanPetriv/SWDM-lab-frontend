import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import { getAuthToken, removeAuthToken } from '../lib/axios';
import { getUserProfile } from '../api/user';
import { queryClient } from '../lib/react-query';
import type { UserGetDto, UserRole } from '../types/api-dtos';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserGetDto | null;
  userRole: UserRole | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserGetDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const controller = new AbortController();
    const token = getAuthToken();
    if (token) {
      setIsAuthenticated(true);
      void fetchUserProfile(controller.signal);
    } else {
      setIsLoading(false);
    }

    return () => {
      controller.abort();
    };
  }, []);

  const fetchUserProfile = async (signal?: AbortSignal): Promise<void> => {
    try {
      const userProfile = await getUserProfile({ signal });
      setUser(userProfile);
    } catch (error: unknown) {
      if (
        (error as any)?.name === 'CanceledError' ||
        (error as any)?.message === 'canceled'
      ) {
        return;
      }
      console.error('Failed to fetch user profile:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (): Promise<void> => {
    setIsAuthenticated(true);
    await fetchUserProfile();
  };

  const logout = (): void => {
    removeAuthToken();
    queryClient.clear();
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      userRole: user?.role || null,
      isLoading,
      login,
      logout,
    }),
    [isAuthenticated, user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
