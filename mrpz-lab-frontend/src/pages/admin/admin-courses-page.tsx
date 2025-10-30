import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../../hooks/admin/use-courses';
import { Loader2, BookOpen, ArrowLeft, Search } from 'lucide-react';

export default function AdminCoursesPage() {
  const { data: courses, isLoading, error } = useCourses();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

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
    </div>
  );
}
