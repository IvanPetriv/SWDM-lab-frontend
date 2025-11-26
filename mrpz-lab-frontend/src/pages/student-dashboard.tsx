import { useAuth } from '../contexts/auth-context';
import { useMyCourses } from '../hooks/courses/use-my-courses';
import { BookOpen } from 'lucide-react';
import CourseCard from '../components/CourseCard';
import InlineLoader from '../components/InlineLoader';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data: courses, isLoading, error } = useMyCourses();

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='bg-white rounded-lg shadow-md p-8 mb-6'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>
          Student Dashboard
        </h2>
        <p className='text-gray-600'>
          Welcome, {user?.firstName} {user?.lastName}!
        </p>
      </div>

      <div className='bg-white rounded-lg shadow-md p-8'>
        <h3 className='text-xl font-bold text-gray-900 mb-6 flex items-center gap-2'>
          <BookOpen className='w-6 h-6' />
          My Enrolled Courses
        </h3>

        {isLoading && <InlineLoader />}

        {error && (
          <div className='text-red-600 py-4'>
            Failed to load courses. Please try again later.
          </div>
        )}

        {courses && courses.length === 0 && (
          <p className='text-gray-500 py-4'>
            You are not enrolled in any courses yet.
          </p>
        )}

        {courses && courses.length > 0 && (
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                to={`/student/courses/${course.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
