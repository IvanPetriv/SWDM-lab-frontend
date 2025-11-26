import { Link } from 'react-router-dom';
import type { CourseGetDto } from '../types/api-dtos';

interface CourseCardProps {
  course: CourseGetDto;
  to: string;
}

export default function CourseCard({ course, to }: CourseCardProps) {
  return (
    <Link
      to={to}
      className='block border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-purple-300 transition-all text-left'
    >
      <div className='flex items-start justify-between mb-2'>
        <h4 className='font-semibold text-gray-900'>{course.name}</h4>
        <span className='text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded'>
          {course.code}
        </span>
      </div>
      <p className='text-gray-600 text-sm'>{course.description}</p>
    </Link>
  );
}
