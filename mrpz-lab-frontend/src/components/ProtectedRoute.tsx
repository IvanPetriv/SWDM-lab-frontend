import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import Layout from './Layout';
import LoadingFallback from './LoadingFallback';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingFallback />;

  if (!isAuthenticated) return <Navigate to='/auth/login' replace />;

  return <Layout>{children}</Layout>;
};
