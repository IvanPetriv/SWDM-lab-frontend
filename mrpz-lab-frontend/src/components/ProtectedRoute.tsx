import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import Layout from './Layout';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen w-screen bg-gray-100'>
        <div className='text-gray-600'>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/auth/login' replace />;
  }

  return <Layout>{children}</Layout>;
};
