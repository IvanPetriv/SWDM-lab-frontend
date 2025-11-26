import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { getRoleDashboardPath } from '../utils/routing';
import LoadingFallback from './LoadingFallback';

export default function DashboardRedirect() {
  const { userRole, isLoading } = useAuth();

  if (isLoading) return <LoadingFallback />;

  if (!userRole) return <Navigate to='/home' replace />;

  const dashboardPath = getRoleDashboardPath(userRole);
  return <Navigate to={dashboardPath} replace />;
}
