import { useAuth } from '../contexts/auth-context';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='bg-white rounded-lg shadow-md p-8'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>
          Administrator Dashboard
        </h2>
        <p className='text-gray-600 mb-4'>
          Welcome, {user?.firstName} {user?.lastName}!
        </p>
        <p className='text-gray-600'>
          This is your administrator dashboard. Here you can manage users,
          courses, and system settings.
        </p>
      </div>
    </div>
  );
}
