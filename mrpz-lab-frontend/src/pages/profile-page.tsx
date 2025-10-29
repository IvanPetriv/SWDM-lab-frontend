import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile, useUpdateUser } from '../hooks/user';
import { Loader2, Save, X } from 'lucide-react';

export default function ProfilePage() {
  const { data: user, isLoading, error } = useProfile();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
  });
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleEdit = () => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });
      setIsEditing(true);
      setUpdateError(null);
      setUpdateSuccess(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUpdateError(null);
    setUpdateSuccess(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdateError(null);
    setUpdateSuccess(false);

    updateUser(formData, {
      onSuccess: () => {
        setIsEditing(false);
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
      },
      onError: (error: Error) => {
        setUpdateError(error.message || 'Failed to update profile');
      },
    });
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-[calc(100vh-4rem)]'>
        <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
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
            onClick={() => navigate('/dashboard')}
            className='px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors'
          >
            Back to Dashboard
          </button>
        </div>

        {updateSuccess && (
          <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-800'>
            Profile updated successfully!
          </div>
        )}

        {updateError && (
          <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-800'>
            {updateError}
          </div>
        )}

        <div className='space-y-6'>
          <div className='flex items-center justify-center mb-8'>
            <div className='w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold'>
              {user?.firstName?.[0]?.toUpperCase() ||
                user?.username?.[0]?.toUpperCase() ||
                'U'}
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Username
                  </label>
                  <input
                    type='text'
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    required
                    className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Email
                  </label>
                  <input
                    type='email'
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    First Name
                  </label>
                  <input
                    type='text'
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                    className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Last Name
                  </label>
                  <input
                    type='text'
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                    className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Role
                  </label>
                  <div className='px-4 py-3 bg-gray-100 rounded-md text-gray-600'>
                    {user?.role || 'N/A'}
                  </div>
                </div>
              </div>

              <div className='flex gap-3 justify-end'>
                <button
                  type='button'
                  onClick={handleCancel}
                  disabled={isUpdating}
                  className='flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors'
                >
                  <X className='w-4 h-4' />
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isUpdating}
                  className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors'
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className='w-4 h-4 animate-spin' />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className='w-4 h-4' />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <>
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
                    Role
                  </label>
                  <div className='px-4 py-3 bg-gray-50 rounded-md text-gray-900'>
                    {user?.role || 'N/A'}
                  </div>
                </div>
              </div>

              <div className='flex justify-end mt-6'>
                <button
                  onClick={handleEdit}
                  className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
                >
                  Edit Profile
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
