import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query';
import {
  getPostsByCourse,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
} from '../../api/posts';
import type { PostGetDto } from '../../types/api-dtos';

export const usePostsByCourse = (
  courseId: string
): UseQueryResult<PostGetDto[], Error> => {
  return useQuery<PostGetDto[], Error>({
    queryKey: ['posts', 'course', courseId],
    queryFn: () => getPostsByCourse(courseId),
    enabled: !!courseId,
  });
};

export const usePostById = (
  postId: string
): UseQueryResult<PostGetDto, Error> => {
  return useQuery<PostGetDto, Error>({
    queryKey: ['posts', postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};

export const useMyPosts = (): UseQueryResult<PostGetDto[], Error> => {
  return useQuery<PostGetDto[], Error>({
    queryKey: ['posts', 'my-posts'],
    queryFn: getMyPosts,
  });
};

export const useCreatePost = (
  courseId: string
): UseMutationResult<
  PostGetDto,
  Error,
  { title: string; textContent: string; image?: File }
> => {
  const queryClient = useQueryClient();

  return useMutation<
    PostGetDto,
    Error,
    { title: string; textContent: string; image?: File }
  >({
    mutationFn: ({ title, textContent, image }) =>
      createPost(courseId, title, textContent, image),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['posts', 'course', courseId],
      });
      queryClient.invalidateQueries({ queryKey: ['posts', 'my-posts'] });
    },
  });
};

export const useUpdatePost = (
  postId: string
): UseMutationResult<
  void,
  Error,
  { title?: string; textContent?: string; image?: File; removeImage?: boolean }
> => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    {
      title?: string;
      textContent?: string;
      image?: File;
      removeImage?: boolean;
    }
  >({
    mutationFn: ({ title, textContent, image, removeImage }) =>
      updatePost(postId, title, textContent, image, removeImage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'course'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'my-posts'] });
    },
  });
};

export const useDeletePost = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
