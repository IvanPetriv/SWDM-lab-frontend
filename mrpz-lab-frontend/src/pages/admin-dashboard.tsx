import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { Users, BookOpen } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='bg-white rounded-lg shadow-md p-8 mb-6'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>
          Administrator Dashboard
        </h2>
        <p className='text-gray-600'>
          Welcome, {user?.firstName} {user?.lastName}!
        </p>
      </div>

      <div className='grid md:grid-cols-2 gap-6'>
        <button
          onClick={() => navigate('/admin/users')}
          className='bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow text-left group'
        >
          <div className='flex items-center gap-4 mb-4'>
            <div className='w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors'>
              <Users className='w-8 h-8 text-blue-600' />
            </div>
            <h3 className='text-2xl font-bold text-gray-900'>Manage Users</h3>
          </div>
          <p className='text-gray-600'>
            View, edit, and manage user accounts and permissions.
          </p>
        </button>

        <button
          onClick={() => navigate('/admin/courses')}
          className='bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow text-left group'
        >
          <div className='flex items-center gap-4 mb-4'>
            <div className='w-16 h-16 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors'>
              <BookOpen className='w-8 h-8 text-green-600' />
            </div>
            <h3 className='text-2xl font-bold text-gray-900'>Manage Courses</h3>
          </div>
          <p className='text-gray-600'>
            Create, edit, and manage courses and their content.
          </p>
        </button>
      </div>
    </div>
  );
}
