import { useAuth } from '../contexts/auth-context';
import { useMyCourses } from '../hooks/courses/use-my-courses';
import { BookOpen, Loader2 } from 'lucide-react';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { data: courses, isLoading, error } = useMyCourses();

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
        <h3 className='text-xl font-bold text-gray-900 mb-6 flex items-center gap-2'>
          <BookOpen className='w-6 h-6' />
          Courses I Manage
        </h3>

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
              <div
                key={course.id}
                className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'
              >
                <div className='flex items-start justify-between mb-2'>
                  <h4 className='font-semibold text-gray-900'>{course.name}</h4>
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
    </div>
  );
}
