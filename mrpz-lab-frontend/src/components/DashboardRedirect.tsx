import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { getRoleDashboardPath } from '../utils/routing';

export default function DashboardRedirect() {
  const { userRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='text-gray-600'>Loading...</div>
      </div>
    );
  }

  if (!userRole) {
    return <Navigate to='/home' replace />;
  }

  const dashboardPath = getRoleDashboardPath(userRole);
  return <Navigate to={dashboardPath} replace />;
}
