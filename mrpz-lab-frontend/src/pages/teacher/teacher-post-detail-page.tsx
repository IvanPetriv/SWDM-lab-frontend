import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { usePostById, useUpdatePost, useDeletePost } from '../../hooks/posts';
import { getPostImage } from '../../api/posts';
import {
  Loader2,
  ArrowLeft,
  FileText,
  Calendar,
  Edit2,
  Save,
  X,
  Trash2,
  Image as ImageIcon,
  XCircle,
} from 'lucide-react';
import Modal from '../../components/Modal';

export default function TeacherPostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: post, isLoading, error } = usePostById(id || '');
  const updatePostMutation = useUpdatePost(id || '');
  const deletePostMutation = useDeletePost();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setTextContent(post.textContent);
      if (post.hasImage) {
        getPostImage(post.id)
          .then((blob) => {
            const url = URL.createObjectURL(blob);
            setImagePreview(url);
          })
          .catch(() => {
            setImagePreview(null);
          });
      }
    }
  }, [post]);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImagePreview(url);
      setRemoveImage(false);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const handleStartEdit = () => {
    setIsEditing(true);
    setUpdateError('');
    setUpdateSuccess('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTitle(post?.title || '');
    setTextContent(post?.textContent || '');
    setImageFile(null);
    setRemoveImage(false);
    setUpdateError('');
    setUpdateSuccess('');
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setUpdateError('Post title cannot be empty');
      return;
    }
    if (!textContent.trim()) {
      setUpdateError('Post content cannot be empty');
      return;
    }

    try {
      setUpdateError('');
      setUpdateSuccess('');
      await updatePostMutation.mutateAsync({
        title,
        textContent,
        image: imageFile || undefined,
        removeImage,
      });
      setIsEditing(false);
      setImageFile(null);
      setRemoveImage(false);
      setUpdateSuccess('Post updated successfully!');
      setTimeout(() => setUpdateSuccess(''), 3000);
    } catch {
      setUpdateError('Failed to update post. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deletePostMutation.mutateAsync(id);
      navigate(-1);
    } catch {
      setUpdateError('Failed to delete post. Please try again.');
      setShowDeleteConfirm(false);
    }
  };

  const handleRemoveImage = () => {
    setRemoveImage(true);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-[calc(100vh-4rem)]'>
        <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='text-red-600 bg-red-50 border border-red-200 rounded-md p-4'>
          Post not found
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <button
        onClick={() => navigate(-1)}
        className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6'
      >
        <ArrowLeft className='w-4 h-4' />
        Back
      </button>

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

      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        {/* Post Image Banner */}
        {imagePreview && !removeImage && (
          <div className='relative w-full h-64 bg-gray-100'>
            <img
              src={imagePreview}
              alt='Post banner'
              className='w-full h-full object-cover'
            />
            {isEditing && (
              <button
                onClick={handleRemoveImage}
                className='absolute top-4 right-4 p-2 bg-red-600 text-white rounded-full hover:bg-red-700'
                title='Remove image'
              >
                <XCircle className='w-5 h-5' />
              </button>
            )}
          </div>
        )}

        <div className='p-8'>
          {/* Header */}
          <div className='flex items-start justify-between mb-6 pb-6 border-b border-gray-200'>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center'>
                <FileText className='w-6 h-6 text-blue-600' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>
                  {post.title}
                </h1>
                <div className='flex items-center gap-2 text-sm text-gray-500 mt-1'>
                  <Calendar className='w-4 h-4' />
                  <span>
                    Posted on {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  {post.updatedAt && (
                    <span className='text-gray-400'>
                      · Updated {new Date(post.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          {isEditing ? (
            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Post Title
                </label>
                <input
                  type='text'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={200}
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Enter post title...'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Post Content
                </label>
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  rows={10}
                  maxLength={10000}
                  className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                  placeholder='Write your post content here...'
                />
                <p className='text-sm text-gray-500 mt-1'>
                  {textContent.length} / 10000 characters
                </p>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Post Image
                </label>
                <div className='flex items-center gap-3'>
                  <label className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50'>
                    <ImageIcon className='w-4 h-4' />
                    {imageFile ? 'Change Image' : 'Add Image'}
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleFileChange}
                      className='hidden'
                    />
                  </label>
                  {imageFile && (
                    <span className='text-sm text-gray-600'>
                      {imageFile.name}
                    </span>
                  )}
                </div>
              </div>

              <div className='flex gap-3 pt-6 border-t border-gray-200'>
                <button
                  onClick={handleSave}
                  disabled={updatePostMutation.isPending}
                  className='flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400'
                >
                  {updatePostMutation.isPending ? (
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
                  disabled={updatePostMutation.isPending}
                  className='flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50'
                >
                  <X className='w-4 h-4' />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className='prose max-w-none mb-8'>
                <p className='text-gray-800 whitespace-pre-wrap'>
                  {post.textContent}
                </p>
              </div>

              <div className='flex gap-3 pt-6 border-t border-gray-200'>
                <button
                  onClick={handleStartEdit}
                  className='flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50'
                >
                  <Edit2 className='w-4 h-4' />
                  Edit Post
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className='flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
                >
                  <Trash2 className='w-4 h-4' />
                  Delete Post
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <Modal
          title='Confirm Deletion'
          onClose={() => setShowDeleteConfirm(false)}
        >
          <p className='text-gray-600 mb-6'>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </p>
          <div className='flex gap-3 justify-end'>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deletePostMutation.isPending}
              className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50'
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deletePostMutation.isPending}
              className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400'
            >
              {deletePostMutation.isPending ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin inline mr-2' />
                  Deleting...
                </>
              ) : (
                'Delete Post'
              )}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
