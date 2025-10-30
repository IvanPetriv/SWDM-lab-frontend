import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses, useCreateCourse } from '../../hooks/admin/use-courses';
import { useUsers } from '../../hooks/admin/use-users';
import { Loader2, BookOpen, ArrowLeft, Search, Plus } from 'lucide-react';

export default function AdminCoursesPage() {
  const { data: courses, isLoading, error } = useCourses();
  const { data: allUsers } = useUsers();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: 0,
    teacherId: '',
  });
  const [teacherSearchQuery, setTeacherSearchQuery] = useState('');
  const [createError, setCreateError] = useState('');

  const createCourseMutation = useCreateCourse();

  // Filter available teachers
  const availableTeachers = useMemo(() => {
    if (!allUsers) return [];
    return allUsers.filter((user) => user.role === 'Teacher');
  }, [allUsers]);

  // Filter teachers by search query
  const filteredTeachers = useMemo(() => {
    if (!teacherSearchQuery.trim()) return availableTeachers;
    const query = teacherSearchQuery.toLowerCase();
    return availableTeachers.filter(
      (teacher) =>
        teacher.firstName.toLowerCase().includes(query) ||
        teacher.lastName.toLowerCase().includes(query) ||
        teacher.email.toLowerCase().includes(query) ||
        teacher.username.toLowerCase().includes(query)
    );
  }, [availableTeachers, teacherSearchQuery]);

  // Filter courses based on search query
  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return courses.filter(
        (course) =>
          course.name.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.code.toString().includes(query)
      );
    }

    return courses;
  }, [courses, searchQuery]);

  const handleCreateCourse = async () => {
    if (!formData.name || !formData.description || !formData.code) {
      setCreateError('Please fill in all fields');
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
        teacherId: formData.teacherId || undefined,
      });
      setShowCreateModal(false);
      setFormData({ name: '', description: '', code: 0, teacherId: '' });
      setTeacherSearchQuery('');
    } catch (err) {
      setCreateError('Failed to create course. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setFormData({ name: '', description: '', code: 0, teacherId: '' });
    setTeacherSearchQuery('');
    setCreateError('');
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
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='text-red-600 bg-red-50 border border-red-200 rounded-md p-4'>
          Failed to load courses: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='mb-6'>
        <button
          onClick={() => navigate('/dashboard/admin')}
          className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to Dashboard
        </button>
        <div className='flex items-center gap-3 mb-4'>
          <BookOpen className='w-8 h-8 text-green-600' />
          <h1 className='text-3xl font-bold text-gray-900'>
            Course Management
          </h1>
        </div>

        {/* Search Bar */}
        <div className='flex items-center gap-4 mb-4'>
          <div className='relative flex-1 max-w-md'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
            <input
              type='text'
              placeholder='Search by name, code, or description...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors'
          >
            <Plus className='w-5 h-5' />
            Create Course
          </button>
        </div>

        <p className='text-gray-600'>
          {searchQuery ? (
            <>
              Showing {filteredCourses.length} of {courses?.length || 0} courses
            </>
          ) : (
            <>Total courses: {courses?.length || 0}</>
          )}
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {filteredCourses.map((course) => (
          <button
            key={course.id}
            onClick={() => navigate(`/admin/courses/${course.id}`)}
            className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left'
          >
            <div className='flex items-start justify-between mb-3'>
              <div className='w-12 h-12 rounded-full bg-green-100 flex items-center justify-center'>
                <BookOpen className='w-6 h-6 text-green-600' />
              </div>
              <span className='text-sm font-mono text-gray-500 bg-gray-100 px-3 py-1 rounded'>
                {course.code}
              </span>
            </div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              {course.name}
            </h3>
            <p className='text-sm text-gray-600 line-clamp-2'>
              {course.description}
            </p>
          </button>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className='text-center py-12 text-gray-500'>
          {searchQuery ? (
            <>No courses found matching your search</>
          ) : (
            <>No courses found.</>
          )}
        </div>
      )}

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
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
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
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
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
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
                  placeholder='Enter course code'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Search Teachers (Optional)
                </label>
                <input
                  type='text'
                  value={teacherSearchQuery}
                  onChange={(e) => setTeacherSearchQuery(e.target.value)}
                  placeholder='Search by name, email, or username...'
                  className='w-full px-3 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
                />
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Assign Teacher (Optional)
                </label>
                <select
                  value={formData.teacherId}
                  onChange={(e) =>
                    setFormData({ ...formData, teacherId: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
                  size={Math.min(filteredTeachers.length + 1, 8)}
                >
                  <option value=''>-- No teacher assigned --</option>
                  {filteredTeachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.firstName} {teacher.lastName} ({teacher.email})
                    </option>
                  ))}
                </select>
                {availableTeachers.length === 0 && (
                  <p className='text-sm text-gray-500 mt-2'>
                    No teachers available.
                  </p>
                )}
                {availableTeachers.length > 0 &&
                  filteredTeachers.length === 0 && (
                    <p className='text-sm text-gray-500 mt-2'>
                      No teachers found matching your search.
                    </p>
                  )}
                {filteredTeachers.length > 0 && (
                  <p className='text-sm text-gray-500 mt-2'>
                    Showing {filteredTeachers.length} of{' '}
                    {availableTeachers.length} available teachers
                  </p>
                )}
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
                className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400'
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
