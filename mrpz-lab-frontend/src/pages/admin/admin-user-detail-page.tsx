import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useUsers,
  useUserCourses,
  useDeleteUser,
} from '../../hooks/admin/use-users';
import { useAuth } from '../../contexts/auth-context';
import { Loader2, ArrowLeft, Trash2, BookOpen } from 'lucide-react';

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: courses, isLoading: coursesLoading } = useUserCourses(id || '');
  const { mutate: deleteUserMutation, isPending: isDeleting } = useDeleteUser();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const user = users?.find((u) => u.id === id);
  const isAdmin = currentUser?.role === 'Administrator';
  const isOwnProfile = currentUser?.id === id;

  const handleDelete = () => {
    if (id) {
      deleteUserMutation(id, {
        onSuccess: () => {
          navigate('/admin/users');
        },
      });
    }
  };

  if (usersLoading) {
    return (
      <div className='flex justify-center items-center h-[calc(100vh-4rem)]'>
        <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
      </div>
    );
  }

  if (!user) {
    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='text-red-600 bg-red-50 border border-red-200 rounded-md p-4'>
          User not found
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <button
        onClick={() => navigate('/admin/users')}
        className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6'
      >
        <ArrowLeft className='w-4 h-4' />
        Back to Users
      </button>

      <div className='bg-white rounded-lg shadow-md p-8 mb-6'>
        <div className='flex items-start justify-between mb-6'>
          <div className='flex items-center gap-4'>
            <div className='w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600'>
              {user.firstName?.[0]?.toUpperCase() ||
                user.username?.[0]?.toUpperCase() ||
                'U'}
            </div>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                {user.firstName} {user.lastName}
              </h1>
              <p className='text-gray-600'>@{user.username}</p>
            </div>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              user.role === 'Administrator'
                ? 'bg-purple-100 text-purple-700'
                : user.role === 'Teacher'
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {user.role}
          </span>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email
            </label>
            <div className='px-4 py-3 bg-gray-50 rounded-md text-gray-900'>
              {user.email}
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              User ID
            </label>
            <div className='px-4 py-3 bg-gray-50 rounded-md text-gray-900 font-mono text-sm'>
              {user.id}
            </div>
          </div>
        </div>

        {!isOwnProfile && (
          <div className='flex justify-end'>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              className='flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors'
            >
              <Trash2 className='w-4 h-4' />
              Delete User
            </button>
          </div>
        )}
      </div>

      {isAdmin && (
        <div className='bg-white rounded-lg shadow-md p-8'>
          <h2 className='text-xl font-bold text-gray-900 mb-6 flex items-center gap-2'>
            <BookOpen className='w-6 h-6' />
            User's Courses
          </h2>

          {coursesLoading && (
            <div className='flex items-center justify-center py-8'>
              <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
            </div>
          )}

          {courses && courses.length === 0 && (
            <p className='text-gray-500 py-4'>
              This user is not enrolled in any courses.
            </p>
          )}

          {courses && courses.length > 0 && (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {courses.map((course) => (
                <div
                  key={course.id}
                  className='border border-gray-200 rounded-lg p-4'
                >
                  <div className='flex items-start justify-between mb-2'>
                    <h4 className='font-semibold text-gray-900'>
                      {course.name}
                    </h4>
                    <span className='text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded'>
                      {course.code}
                    </span>
                  </div>
                  <p className='text-gray-600 text-sm'>{course.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
            <h3 className='text-xl font-bold text-gray-900 mb-4'>
              Confirm Delete
            </h3>
            <p className='text-gray-600 mb-6'>
              Are you sure you want to delete{' '}
              <strong>
                {user.firstName} {user.lastName}
              </strong>
              ? This action cannot be undone.
            </p>
            <div className='flex gap-3 justify-end'>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50'
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className='flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50'
              >
                {isDeleting ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className='w-4 h-4' />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
