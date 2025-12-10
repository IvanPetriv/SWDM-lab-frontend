import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
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
import { usePostsByCourse, useCreatePost } from '../../hooks/posts';
import { useTestsByCourse } from '../../hooks/tests';
import { useGeneratePostImage } from '../../hooks/ai/use-ai';
import { getPostImage } from '../../api/posts';
import { streamPostContent } from '../../api/ai';
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
  MessageSquare,
  Plus,
  Image as ImageIcon,
  Sparkles,
  ClipboardList,
} from 'lucide-react';
import Modal from '../../components/Modal';
import AIGenerationModal from '../../components/AIGenerationModal';
import { saveBlob } from '../../lib/file-utils';

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
  const { data: posts } = usePostsByCourse(id || '');
  const { data: tests } = useTestsByCourse(id || '');

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
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState<File | null>(null);
  const [postError, setPostError] = useState('');
  const [postImagePreviews, setPostImagePreviews] = useState<
    Map<string, string>
  >(new Map());

  const addStudentMutation = useAddStudentToCourse();
  const removeStudentMutation = useRemoveStudentFromCourse();
  const uploadFileMutation = useUploadFile(id || '');
  const deleteFileMutation = useDeleteFile(id || '');
  const updateCourseMutation = useUpdateCourse(id || '');
  const deleteCourseMutation = useDeleteCourse();
  const createPostMutation = useCreatePost(id || '');
  const generateImageMutation = useGeneratePostImage();

  const [showAIModal, setShowAIModal] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  // Load post image thumbnails
  useEffect(() => {
    if (posts) {
      const previews = new Map<string, string>();
      Promise.all(
        posts
          .filter((post) => post.hasImage)
          .map(async (post) => {
            try {
              const blob = await getPostImage(post.id);
              const url = URL.createObjectURL(blob);
              previews.set(post.id, url);
            } catch {
              // Ignore errors for individual images
            }
          })
      ).then(() => {
        setPostImagePreviews(previews);
      });
    }

    return () => {
      // Cleanup URLs
      postImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);

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
    } catch {
      setStudentError('Failed to add student. Please try again.');
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!id) return;
    try {
      setStudentError('');
      await removeStudentMutation.mutateAsync({ studentId, courseId: id });
    } catch {
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
    } catch {
      setUploadError('Failed to upload file. Please try again.');
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      await deleteFileMutation.mutateAsync(fileId);
    } catch {
      alert('Failed to delete file. Please try again.');
    }
  };

  const handleDownloadFile = async (fileId: string, fileName: string) => {
    try {
      const blob = await downloadFile(fileId);
      saveBlob(blob, fileName);
    } catch {
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
    } catch {
      setUpdateError('Failed to update course. Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCourseMutation.mutateAsync(id || '');
      navigate('/dashboard/teacher');
    } catch {
      setUpdateError('Failed to delete course. Please try again.');
      setShowDeleteConfirm(false);
    }
  };

  const handleCreatePost = async () => {
    if (!postTitle.trim()) {
      setPostError('Post title cannot be empty');
      return;
    }
    if (!postContent.trim()) {
      setPostError('Post content cannot be empty');
      return;
    }

    try {
      setPostError('');
      await createPostMutation.mutateAsync({
        title: postTitle,
        textContent: postContent,
        image: postImage || undefined,
      });
      setShowCreatePost(false);
      setPostTitle('');
      setPostContent('');
      setPostImage(null);
    } catch {
      setPostError('Failed to create post. Please try again.');
    }
  };

  const handlePostImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPostImage(file);
    }
  };

  const handleGenerateContent = async (prompt: string) => {
    try {
      setPostError('');
      setShowAIModal(false);
      setPostContent('');
      setIsStreaming(true);

      const stream = await streamPostContent(prompt);

      for await (const chunk of stream) {
        setPostContent((prev) => prev + chunk);
      }
    } catch {
      setPostError('Failed to generate content. Please try again.');
    } finally {
      setIsStreaming(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!postTitle || !postContent) return;
    try {
      setPostError('');
      const blob = await generateImageMutation.mutateAsync({
        title: postTitle,
        content: postContent,
      });
      const file = new File([blob], 'generated-image.png', {
        type: 'image/png',
      });
      setPostImage(file);
    } catch {
      setPostError('Failed to generate image. Please try again.');
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

      {/* Posts Section */}
      <div className='bg-white rounded-lg shadow-md p-8 mb-6'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-bold text-gray-900 flex items-center gap-2'>
            <MessageSquare className='w-6 h-6' />
            Course Posts
          </h2>
          <button
            onClick={() => setShowCreatePost(true)}
            className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
          >
            <Plus className='w-4 h-4' />
            Create Post
          </button>
        </div>

        {!posts || posts.length === 0 ? (
          <p className='text-gray-500 py-4'>
            No posts created for this course.
          </p>
        ) : (
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => navigate(`/teacher/posts/${post.id}`)}
                className='border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer'
              >
                {post.hasImage && postImagePreviews.get(post.id) && (
                  <div className='w-full h-32 bg-gray-100'>
                    <img
                      src={postImagePreviews.get(post.id)}
                      alt='Post thumbnail'
                      className='w-full h-full object-cover'
                    />
                  </div>
                )}
                <div className='p-4'>
                  <h3 className='font-bold text-gray-900 mb-2 line-clamp-1'>
                    {post.title}
                  </h3>
                  <p className='text-gray-600 line-clamp-3 mb-3 text-sm'>
                    {post.textContent}
                  </p>
                  <div className='flex items-center gap-2 text-xs text-gray-500'>
                    <Calendar className='w-3 h-3' />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tests Section */}
      <div className='bg-white rounded-lg shadow-md p-8 mb-6'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-bold text-gray-900 flex items-center gap-2'>
            <ClipboardList className='w-6 h-6' />
            Course Tests
          </h2>
          <button
            onClick={() => navigate(`/teacher/courses/${id}/create-test`)}
            className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700'
          >
            <Plus className='w-4 h-4' />
            Create Test
          </button>
        </div>

        {!tests || tests.length === 0 ? (
          <p className='text-gray-500 py-4'>
            No tests created for this course.
          </p>
        ) : (
          <div className='space-y-3'>
            {tests.map((test) => (
              <div
                key={test.id}
                onClick={() => navigate(`/teacher/tests/${test.id}`)}
                className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer'
              >
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <h3 className='font-bold text-gray-900 mb-1'>
                      {test.title}
                    </h3>
                    <p className='text-gray-600 text-sm mb-2'>
                      {test.description}
                    </p>
                    <div className='flex items-center gap-4 text-xs text-gray-500'>
                      <div className='flex items-center gap-1'>
                        <FileText className='w-3 h-3' />
                        {test.questions.length} questions
                      </div>
                      <div className='flex items-center gap-1'>
                        <Calendar className='w-3 h-3' />
                        Due: {new Date(test.dueDate).toLocaleDateString()}
                      </div>
                    </div>
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
        <Modal
          title='Confirm Deletion'
          onClose={() => setShowDeleteConfirm(false)}
        >
          <p className='text-gray-600 mb-6'>
            Are you sure you want to delete the course "{course?.name}"? This
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
        </Modal>
      )}

      {/* Add Student Modal */}
      {showAddStudent && (
        <Modal
          title='Add Student to Course'
          onClose={() => setShowAddStudent(false)}
        >
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
            {availableStudents.length > 0 && filteredStudents.length === 0 && (
              <p className='text-sm text-gray-500 mt-2'>
                No students found matching your search.
              </p>
            )}
            {filteredStudents.length > 0 && (
              <p className='text-sm text-gray-500 mt-2'>
                Showing {filteredStudents.length} of {availableStudents.length}{' '}
                available students
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
        </Modal>
      )}

      {/* Upload File Modal */}
      {showUploadFile && (
        <Modal
          title='Upload Course File'
          onClose={() => setShowUploadFile(false)}
        >
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
        </Modal>
      )}

      {/* Create Post Modal */}
      {showCreatePost && (
        <Modal title='Create New Post' onClose={() => setShowCreatePost(false)}>
          {postError && (
            <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm'>
              {postError}
            </div>
          )}
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Post Title
            </label>
            <input
              type='text'
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              maxLength={200}
              disabled={isStreaming || generateImageMutation.isPending}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500'
              placeholder='Enter post title...'
            />
          </div>
          <div className='mb-6'>
            <div className='flex justify-between items-center mb-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Post Content
              </label>
              <button
                onClick={() => setShowAIModal(true)}
                disabled={isStreaming || generateImageMutation.isPending}
                className='flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 disabled:text-gray-400 disabled:cursor-not-allowed'
              >
                {isStreaming ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className='w-4 h-4' />
                    Generate with AI
                  </>
                )}
              </button>
            </div>
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              rows={8}
              maxLength={10000}
              disabled={isStreaming || generateImageMutation.isPending}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-100 disabled:text-gray-500'
              placeholder='Write your post content here...'
            />
            <p className='text-sm text-gray-500 mt-1'>
              {postContent.length} / 10000 characters
            </p>
          </div>
          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Post Image (Optional)
            </label>
            <div className='flex items-center gap-3'>
              <label
                className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 ${
                  isStreaming || generateImageMutation.isPending
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                <ImageIcon className='w-4 h-4' />
                {postImage ? 'Change Image' : 'Add Image'}
                <input
                  type='file'
                  accept='image/*'
                  onChange={handlePostImageChange}
                  className='hidden'
                  disabled={isStreaming || generateImageMutation.isPending}
                />
              </label>
              <button
                onClick={handleGenerateImage}
                disabled={
                  !postTitle.trim() ||
                  !postContent.trim() ||
                  generateImageMutation.isPending ||
                  isStreaming
                }
                className='flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-md hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed'
                title={
                  !postTitle.trim() || !postContent.trim()
                    ? 'Fill in title and content to generate image'
                    : 'Generate image based on post content'
                }
              >
                {generateImageMutation.isPending ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    Generating Image...
                  </>
                ) : (
                  <>
                    <Sparkles className='w-4 h-4' />
                    Generate Image
                  </>
                )}
              </button>
              {postImage && (
                <span className='text-sm text-gray-600'>{postImage.name}</span>
              )}
            </div>
          </div>
          <div className='flex gap-3 justify-end'>
            <button
              onClick={() => {
                setShowCreatePost(false);
                setPostTitle('');
                setPostContent('');
                setPostImage(null);
                setPostError('');
              }}
              disabled={
                createPostMutation.isPending ||
                isStreaming ||
                generateImageMutation.isPending
              }
              className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Cancel
            </button>
            <button
              onClick={handleCreatePost}
              disabled={
                !postTitle.trim() ||
                !postContent.trim() ||
                createPostMutation.isPending ||
                isStreaming ||
                generateImageMutation.isPending
              }
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
            >
              {createPostMutation.isPending ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin inline mr-2' />
                  Creating...
                </>
              ) : (
                'Create Post'
              )}
            </button>
          </div>
        </Modal>
      )}

      {/* AI Generation Modal */}
      {showAIModal && (
        <AIGenerationModal
          onClose={() => setShowAIModal(false)}
          onGenerate={handleGenerateContent}
          isGenerating={false}
        />
      )}
    </div>
  );
}
