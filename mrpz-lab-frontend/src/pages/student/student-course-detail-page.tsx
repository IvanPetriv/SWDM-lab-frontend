import { useParams, useNavigate } from 'react-router-dom';
import {
  useCourseWithFiles,
  useUserById,
  useCourseStudents,
} from '../../hooks/admin/use-courses';
import { downloadFile } from '../../api/courses';
import {
  Loader2,
  ArrowLeft,
  BookOpen,
  User,
  FileText,
  Calendar,
  Users,
  Download,
} from 'lucide-react';

export default function StudentCourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useCourseWithFiles(id || '');
  const { data: teacher, isLoading: teacherLoading } = useUserById(
    course?.teacherId
  );
  const { data: students } = useCourseStudents(id || '');

  const handleDownloadFile = async (fileId: string, fileName: string) => {
    try {
      const blob = await downloadFile(fileId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Failed to download file. Please try again.');
    }
  };

  if (courseLoading) {
    return (
      <div className='flex justify-center items-center h-[calc(100vh-4rem)]'>
        <Loader2 className='w-8 h-8 animate-spin text-purple-600' />
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='text-red-600 bg-red-50 border border-red-200 rounded-md p-4'>
          Course not found
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <button
        onClick={() => navigate('/dashboard/student')}
        className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6'
      >
        <ArrowLeft className='w-4 h-4' />
        Back to My Courses
      </button>

      {/* Course Info Card */}
      <div className='bg-white rounded-lg shadow-md p-8 mb-6'>
        <div className='flex items-start justify-between mb-6'>
          <div className='flex items-center gap-4'>
            <div className='w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center'>
              <BookOpen className='w-8 h-8 text-purple-600' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                {course.name}
              </h1>
              <p className='text-gray-600 mt-1'>{course.description}</p>
            </div>
          </div>
          <span className='text-lg font-mono text-gray-500 bg-gray-100 px-4 py-2 rounded'>
            {course.code}
          </span>
        </div>

        {/* Teacher Info */}
        <div className='border-t border-gray-200 pt-6'>
          <h3 className='text-sm font-medium text-gray-700 mb-3 flex items-center gap-2'>
            <User className='w-4 h-4' />
            Course Teacher
          </h3>
          {teacherLoading ? (
            <div className='flex items-center gap-2 text-gray-500'>
              <Loader2 className='w-4 h-4 animate-spin' />
              Loading teacher info...
            </div>
          ) : teacher ? (
            <div className='bg-gray-50 rounded-md p-4'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600'>
                  {teacher.firstName?.[0]?.toUpperCase() ||
                    teacher.username?.[0]?.toUpperCase() ||
                    'T'}
                </div>
                <div>
                  <p className='font-semibold text-gray-900'>
                    {teacher.firstName} {teacher.lastName}
                  </p>
                  <p className='text-sm text-gray-600'>{teacher.email}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className='text-gray-500'>Teacher information unavailable</p>
          )}
        </div>
      </div>

      {/* Students Section */}
      <div className='bg-white rounded-lg shadow-md p-8 mb-6'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-bold text-gray-900 flex items-center gap-2'>
            <Users className='w-6 h-6' />
            Enrolled Students
          </h2>
          <span className='text-sm text-gray-500'>
            {students?.length || 0} student{students?.length !== 1 ? 's' : ''}
          </span>
        </div>

        {!students || students.length === 0 ? (
          <p className='text-gray-500 py-4'>
            No students enrolled in this course.
          </p>
        ) : (
          <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
            {students.map((student) => (
              <div
                key={student.id}
                className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors'
              >
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-600'>
                    {student.firstName?.[0]?.toUpperCase() ||
                      student.username?.[0]?.toUpperCase() ||
                      'S'}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='font-semibold text-gray-900 truncate'>
                      {student.firstName} {student.lastName}
                    </p>
                    <p className='text-sm text-gray-600 truncate'>
                      {student.email}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Course Files Card */}
      <div className='bg-white rounded-lg shadow-md p-8'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-bold text-gray-900 flex items-center gap-2'>
            <FileText className='w-6 h-6' />
            Course Materials
          </h2>
          <span className='text-sm text-gray-500'>
            {course.files.length} file{course.files.length !== 1 ? 's' : ''}
          </span>
        </div>

        {course.files.length === 0 ? (
          <p className='text-gray-500 py-4'>
            No files uploaded for this course yet.
          </p>
        ) : (
          <div className='space-y-3'>
            {course.files.map((file) => (
              <div
                key={file.id}
                className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors'
              >
                <div className='flex items-start justify-between'>
                  <div className='flex items-center gap-3 flex-1'>
                    <FileText className='w-5 h-5 text-gray-400 shrink-0' />
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium text-gray-900 truncate'>
                        {file.fileName}
                      </p>
                      <p className='text-sm text-gray-500 truncate'>
                        {file.filePath}
                      </p>
                      {file.type && (
                        <span className='inline-block mt-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded'>
                          {file.type}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className='flex items-center gap-4 ml-4'>
                    <div className='flex items-center gap-2 text-sm text-gray-500'>
                      <Calendar className='w-4 h-4' />
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </div>
                    <button
                      onClick={() => handleDownloadFile(file.id, file.fileName)}
                      className='p-2 text-purple-600 hover:bg-purple-50 rounded-md'
                      title='Download file'
                    >
                      <Download className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
