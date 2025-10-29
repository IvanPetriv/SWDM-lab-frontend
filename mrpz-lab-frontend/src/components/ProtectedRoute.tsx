import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({
  children,
}: ProtectedRouteProps): React.JSX.Element => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to='/auth/login' replace />;
  }

  return <>{children}</>;
};
