import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/user';

export default function ProfilePage() {
  const { data: user, isLoading, error } = useProfile();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-[calc(100vh-4rem)]'>
        <div className='text-gray-600'>Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center h-[calc(100vh-4rem)]'>
        <div className='text-red-600'>
          Failed to load profile: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='bg-white rounded-lg shadow-md p-8'>
        <div className='flex items-center justify-between mb-6'>
          <h1 className='text-3xl font-bold text-gray-900'>Profile</h1>
          <button
            onClick={() => navigate('/home')}
            className='px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors'
          >
            Back to Home
          </button>
        </div>

        <div className='space-y-6'>
          <div className='flex items-center justify-center mb-8'>
            <div className='w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold'>
              {user?.firstName?.[0]?.toUpperCase() ||
                user?.username?.[0]?.toUpperCase() ||
                'U'}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Username
              </label>
              <div className='px-4 py-3 bg-gray-50 rounded-md text-gray-900'>
                {user?.username || 'N/A'}
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email
              </label>
              <div className='px-4 py-3 bg-gray-50 rounded-md text-gray-900'>
                {user?.email || 'N/A'}
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                First Name
              </label>
              <div className='px-4 py-3 bg-gray-50 rounded-md text-gray-900'>
                {user?.firstName || 'N/A'}
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Last Name
              </label>
              <div className='px-4 py-3 bg-gray-50 rounded-md text-gray-900'>
                {user?.lastName || 'N/A'}
              </div>
            </div>

            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                User ID
              </label>
              <div className='px-4 py-3 bg-gray-50 rounded-md text-gray-900 font-mono text-sm'>
                {user?.id || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
