import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { usePostById } from '../../hooks/posts';
import { getPostImage } from '../../api/posts';
import { Loader2, ArrowLeft, FileText, Calendar } from 'lucide-react';

export default function StudentPostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: post, isLoading, error } = usePostById(id || '');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (post && post.hasImage) {
      getPostImage(post.id)
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          setImagePreview(url);
        })
        .catch(() => {
          setImagePreview(null);
        });
    }
  }, [post]);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-[calc(100vh-4rem)]'>
        <Loader2 className='w-8 h-8 animate-spin text-purple-600' />
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

      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        {/* Post Image Banner */}
        {imagePreview && (
          <div className='relative w-full h-64 bg-gray-100'>
            <img
              src={imagePreview}
              alt='Post banner'
              className='w-full h-full object-cover'
            />
          </div>
        )}

        <div className='p-8'>
          {/* Header */}
          <div className='flex items-start justify-between mb-6 pb-6 border-b border-gray-200'>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center'>
                <FileText className='w-6 h-6 text-purple-600' />
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
          <div className='prose max-w-none'>
            <p className='text-gray-800 whitespace-pre-wrap'>
              {post.textContent}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
