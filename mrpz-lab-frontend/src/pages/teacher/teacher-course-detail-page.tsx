import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import {
  useCourseWithFiles,
  useUserById,
  useCourseStudents,
  useAddStudentToCourse,
  useRemoveStudentFromCourse,
  useUploadFile,
  useDeleteFile,
  useUpdateCourse,
  useDeleteCourse,
} from '../../hooks/admin/use-courses';
import { useUsers } from '../../hooks/admin/use-users';
import { downloadFile } from '../../api/courses';
import {
  Loader2,
  ArrowLeft,
  BookOpen,
  User,
  FileText,
  Calendar,
  UserPlus,
  Users,
  Upload,
  Trash2,
  Download,
  Edit2,
  Save,
  X,
} from 'lucide-react';

export default function TeacherCourseDetailPage() {
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
  const { data: allUsers } = useUsers();

  const [showAddStudent, setShowAddStudent] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentError, setStudentError] = useState('');
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [showUploadFile, setShowUploadFile] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: 0,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  const addStudentMutation = useAddStudentToCourse();
  const removeStudentMutation = useRemoveStudentFromCourse();
  const uploadFileMutation = useUploadFile(id || '');
  const deleteFileMutation = useDeleteFile(id || '');
  const updateCourseMutation = useUpdateCourse(id || '');
  const deleteCourseMutation = useDeleteCourse();

  // Filter available students (not already enrolled)
  const availableStudents = useMemo(() => {
    if (!allUsers || !students) return [];
    const enrolledIds = new Set(students.map((s) => s.id));
    return allUsers.filter(
      (user) => user.role === 'Student' && !enrolledIds.has(user.id)
    );
  }, [allUsers, students]);

  // Filter students by search query
  const filteredStudents = useMemo(() => {
    if (!studentSearchQuery.trim()) return availableStudents;
    const query = studentSearchQuery.toLowerCase();
    return availableStudents.filter(
      (student) =>
        student.firstName.toLowerCase().includes(query) ||
        student.lastName.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.username.toLowerCase().includes(query)
    );
  }, [availableStudents, studentSearchQuery]);

  const handleAddStudent = async () => {
    if (!selectedStudentId || !id) return;
    try {
      setStudentError('');
      await addStudentMutation.mutateAsync({
        studentId: selectedStudentId,
        courseId: id,
      });
      setShowAddStudent(false);
      setSelectedStudentId('');
      setStudentSearchQuery('');
    } catch (err) {
      setStudentError('Failed to add student. Please try again.');
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!id) return;
    try {
      setStudentError('');
      await removeStudentMutation.mutateAsync({ studentId, courseId: id });
    } catch (err) {
      setStudentError('Failed to remove student. Please try again.');
    }
  };

  const handleUploadFile = async () => {
    if (!fileToUpload) return;
    try {
      setUploadError('');
      await uploadFileMutation.mutateAsync(fileToUpload);
      setShowUploadFile(false);
      setFileToUpload(null);
    } catch (err) {
      setUploadError('Failed to upload file. Please try again.');
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      await deleteFileMutation.mutateAsync(fileId);
    } catch (err) {
      alert('Failed to delete file. Please try again.');
    }
  };

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

  const handleStartEdit = () => {
    if (course) {
      setFormData({
        name: course.name,
        description: course.description,
        code: course.code,
      });
      setUpdateError('');
      setUpdateSuccess('');
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdateError('');
    setUpdateSuccess('');
  };

  const handleSave = async () => {
    try {
      setUpdateError('');
      setUpdateSuccess('');
      await updateCourseMutation.mutateAsync(formData);
      setIsEditing(false);
      setUpdateSuccess('Course updated successfully!');
      setTimeout(() => setUpdateSuccess(''), 3000);
    } catch (err) {
      setUpdateError('Failed to update course. Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCourseMutation.mutateAsync(id || '');
      navigate('/dashboard/teacher');
    } catch (err) {
      setUpdateError('Failed to delete course. Please try again.');
      setShowDeleteConfirm(false);
    }
  };

  if (courseLoading) {
    return (
      <div className='flex justify-center items-center h-[calc(100vh-4rem)]'>
        <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
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
        onClick={() => navigate('/dashboard/teacher')}
        className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6'
      >
        <ArrowLeft className='w-4 h-4' />
        Back to My Courses
      </button>

      {/* Course Info Card */}
      <div className='bg-white rounded-lg shadow-md p-8 mb-6'>
        {updateSuccess && (
          <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-700'>
            {updateSuccess}
          </div>
        )}
        {updateError && (
          <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700'>
            {updateError}
          </div>
        )}

        <div className='flex items-start justify-between mb-6'>
          <div className='flex items-center gap-4 flex-1'>
            <div className='w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center'>
              <BookOpen className='w-8 h-8 text-blue-600' />
            </div>
            {isEditing ? (
              <div className='flex-1 space-y-4'>
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
                  />
                </div>
              </div>
            ) : (
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>
                  {course.name}
                </h1>
                <p className='text-gray-600 mt-1'>{course.description}</p>
              </div>
            )}
          </div>
          {isEditing ? (
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Code
              </label>
              <input
                type='number'
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: parseInt(e.target.value) || 0,
                  })
                }
                className='w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono'
              />
            </div>
          ) : (
            <span className='text-lg font-mono text-gray-500 bg-gray-100 px-4 py-2 rounded'>
              {course.code}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className='flex gap-3 mb-6 border-t border-gray-200 pt-6'>
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={updateCourseMutation.isPending}
                className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400'
              >
                {updateCourseMutation.isPending ? (
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
              <button
                onClick={handleCancelEdit}
                disabled={updateCourseMutation.isPending}
                className='flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50'
              >
                <X className='w-4 h-4' />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleStartEdit}
              className='flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50'
            >
              <Edit2 className='w-4 h-4' />
              Edit Course
            </button>
          )}
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
          <button
            onClick={() => setShowAddStudent(true)}
            className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
          >
            <UserPlus className='w-4 h-4' />
            Add Student
          </button>
        </div>

        {studentError && (
          <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700'>
            {studentError}
          </div>
        )}

        {!students || students.length === 0 ? (
          <p className='text-gray-500 py-4'>
            No students enrolled in this course.
          </p>
        ) : (
          <div className='space-y-3'>
            {students.map((student) => (
              <div
                key={student.id}
                className='border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors'
              >
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-600'>
                    {student.firstName?.[0]?.toUpperCase() ||
                      student.username?.[0]?.toUpperCase() ||
                      'S'}
                  </div>
                  <div>
                    <p className='font-semibold text-gray-900'>
                      {student.firstName} {student.lastName}
                    </p>
                    <p className='text-sm text-gray-600'>{student.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveStudent(student.id)}
                  disabled={removeStudentMutation.isPending}
                  className='px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md border border-red-200 hover:border-red-300 disabled:opacity-50'
                >
                  Remove
                </button>
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
            Course Files
          </h2>
          <button
            onClick={() => setShowUploadFile(true)}
            className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
          >
            <Upload className='w-4 h-4' />
            Upload File
          </button>
        </div>

        {course.files.length === 0 ? (
          <p className='text-gray-500 py-4'>
            No files uploaded for this course.
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
                    </div>
                  </div>
                  <div className='flex items-center gap-4 ml-4'>
                    <div className='flex items-center gap-2 text-sm text-gray-500'>
                      <Calendar className='w-4 h-4' />
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </div>
                    <button
                      onClick={() => handleDownloadFile(file.id, file.fileName)}
                      className='p-2 text-blue-600 hover:bg-blue-50 rounded-md'
                      title='Download file'
                    >
                      <Download className='w-4 h-4' />
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      disabled={deleteFileMutation.isPending}
                      className='p-2 text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50'
                      title='Delete file'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Button */}
      <div className='mt-6 flex justify-end'>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          disabled={deleteCourseMutation.isPending}
          className='flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400'
        >
          <Trash2 className='w-4 h-4' />
          Delete Course
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
            <h3 className='text-xl font-bold text-gray-900 mb-4'>
              Confirm Deletion
            </h3>
            <p className='text-gray-600 mb-6'>
              Are you sure you want to delete the course "{course.name}"? This
              action cannot be undone.
            </p>
            <div className='flex gap-3 justify-end'>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteCourseMutation.isPending}
                className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteCourseMutation.isPending}
                className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400'
              >
                {deleteCourseMutation.isPending ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin inline mr-2' />
                    Deleting...
                  </>
                ) : (
                  'Delete Course'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudent && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
            <h3 className='text-xl font-bold text-gray-900 mb-4'>
              Add Student to Course
            </h3>
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Search Students
              </label>
              <input
                type='text'
                value={studentSearchQuery}
                onChange={(e) => setStudentSearchQuery(e.target.value)}
                placeholder='Search by name, email, or username...'
                className='w-full px-3 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Select Student
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                size={Math.min(filteredStudents.length + 1, 8)}
              >
                <option value=''>-- Select a student --</option>
                {filteredStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.firstName} {student.lastName} ({student.email})
                  </option>
                ))}
              </select>
              {availableStudents.length === 0 && (
                <p className='text-sm text-gray-500 mt-2'>
                  All students are already enrolled in this course.
                </p>
              )}
              {availableStudents.length > 0 &&
                filteredStudents.length === 0 && (
                  <p className='text-sm text-gray-500 mt-2'>
                    No students found matching your search.
                  </p>
                )}
              {filteredStudents.length > 0 && (
                <p className='text-sm text-gray-500 mt-2'>
                  Showing {filteredStudents.length} of{' '}
                  {availableStudents.length} available students
                </p>
              )}
            </div>
            <div className='flex gap-3 justify-end'>
              <button
                onClick={() => {
                  setShowAddStudent(false);
                  setSelectedStudentId('');
                  setStudentError('');
                  setStudentSearchQuery('');
                }}
                disabled={addStudentMutation.isPending}
                className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                onClick={handleAddStudent}
                disabled={!selectedStudentId || addStudentMutation.isPending}
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400'
              >
                {addStudentMutation.isPending ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin inline mr-2' />
                    Adding...
                  </>
                ) : (
                  'Add Student'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload File Modal */}
      {showUploadFile && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
            <h3 className='text-xl font-bold text-gray-900 mb-4'>
              Upload Course File
            </h3>
            {uploadError && (
              <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm'>
                {uploadError}
              </div>
            )}
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Select File
              </label>
              <input
                type='file'
                onChange={(e) => setFileToUpload(e.target.files?.[0] || null)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              {fileToUpload && (
                <p className='text-sm text-gray-600 mt-2'>
                  Selected: {fileToUpload.name} (
                  {(fileToUpload.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>
            <div className='flex gap-3 justify-end'>
              <button
                onClick={() => {
                  setShowUploadFile(false);
                  setFileToUpload(null);
                  setUploadError('');
                }}
                disabled={uploadFileMutation.isPending}
                className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                onClick={handleUploadFile}
                disabled={!fileToUpload || uploadFileMutation.isPending}
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400'
              >
                {uploadFileMutation.isPending ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin inline mr-2' />
                    Uploading...
                  </>
                ) : (
                  'Upload'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
