import { useNavigate } from 'react-router-dom';
import { UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/auth-context';

export default function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleProfileClick = (): void => {
    navigate('/profile');
  };

  const handleLogout = (): void => {
    logout();
    navigate('/auth/login');
  };

  return (
    <header className='bg-white shadow-sm border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center'>
            <h1 className='text-xl font-semibold text-gray-900'>Dashboard</h1>
          </div>
          <div className='flex items-center gap-4'>
            <button
              onClick={handleProfileClick}
              className='flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors'
              aria-label='Profile'
            >
              <UserCircle className='w-6 h-6' />
            </button>
            <button
              onClick={handleLogout}
              className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors'
            >
              <LogOut className='w-4 h-4' />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
