import { useAuth } from '../contexts/auth-context';
import { useMyCourses } from '../hooks/courses/use-my-courses';
import { useCreateCourse } from '../hooks/admin/use-courses';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Loader2, Plus } from 'lucide-react';
import { useState } from 'react';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { data: courses, isLoading, error } = useMyCourses();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: 0,
  });
  const [createError, setCreateError] = useState('');

  const createCourseMutation = useCreateCourse();

  const handleCreateCourse = async () => {
    if (!formData.name || !formData.description || !formData.code) {
      setCreateError('Please fill in all fields');
      return;
    }

    if (!user?.id) {
      setCreateError('User not authenticated');
      return;
    }

    try {
      setCreateError('');
      // Generate a random GUID for the course ID
      const courseId = crypto.randomUUID();
      await createCourseMutation.mutateAsync({
        id: courseId,
        name: formData.name,
        description: formData.description,
        code: formData.code,
        teacherId: user.id, // Automatically set to current user
      });
      setShowCreateModal(false);
      setFormData({ name: '', description: '', code: 0 });
    } catch (err) {
      setCreateError('Failed to create course. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setFormData({ name: '', description: '', code: 0 });
    setCreateError('');
  };

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='bg-white rounded-lg shadow-md p-8 mb-6'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>
          Teacher Dashboard
        </h2>
        <p className='text-gray-600'>
          Welcome, {user?.firstName} {user?.lastName}!
        </p>
      </div>

      <div className='bg-white rounded-lg shadow-md p-8'>
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-xl font-bold text-gray-900 flex items-center gap-2'>
            <BookOpen className='w-6 h-6' />
            Courses I Manage
          </h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
          >
            <Plus className='w-5 h-5' />
            Create Course
          </button>
        </div>

        {isLoading && (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
          </div>
        )}

        {error && (
          <div className='text-red-600 py-4'>
            Failed to load courses. Please try again later.
          </div>
        )}

        {courses && courses.length === 0 && (
          <p className='text-gray-500 py-4'>
            You are not managing any courses yet.
          </p>
        )}

        {courses && courses.length > 0 && (
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => navigate(`/teacher/courses/${course.id}`)}
                className='border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all text-left'
              >
                <div className='flex items-start justify-between mb-2'>
                  <h4 className='font-semibold text-gray-900'>{course.name}</h4>
                  <span className='text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded'>
                    {course.code}
                  </span>
                </div>
                <p className='text-gray-600 text-sm'>{course.description}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
            <h3 className='text-xl font-bold text-gray-900 mb-4'>
              Create New Course
            </h3>

            {createError && (
              <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm'>
                {createError}
              </div>
            )}

            <div className='space-y-4 mb-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Course Name
                </label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Enter course name'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Description
                </label>
                <input
                  type='text'
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Enter course description'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Course Code
                </label>
                <input
                  type='number'
                  value={formData.code || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: parseInt(e.target.value) || 0,
                    })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Enter course code'
                />
              </div>

              <div className='p-3 bg-blue-50 border border-blue-200 rounded-md'>
                <p className='text-sm text-blue-700'>
                  You will be automatically assigned as the teacher for this
                  course.
                </p>
              </div>
            </div>

            <div className='flex gap-3 justify-end'>
              <button
                onClick={handleCloseModal}
                disabled={createCourseMutation.isPending}
                className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCourse}
                disabled={createCourseMutation.isPending}
                className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400'
              >
                {createCourseMutation.isPending ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    Creating...
                  </>
                ) : (
                  'Create Course'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
