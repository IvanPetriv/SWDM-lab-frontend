import { axiosInstance } from '../lib/axios';
import type { PostGetDto } from '../types/api-dtos';

export const getPostsByCourse = async (
  courseId: string
): Promise<PostGetDto[]> => {
  const response = await axiosInstance.get<PostGetDto[]>(
    `/Post/course/${courseId}`
  );
  return response.data;
};

export const getPostById = async (postId: string): Promise<PostGetDto> => {
  const response = await axiosInstance.get<PostGetDto>(`/Post/${postId}`);
  return response.data;
};

export const getPostImage = async (postId: string): Promise<Blob> => {
  const response = await axiosInstance.get(`/Post/${postId}/image`, {
    responseType: 'blob',
  });
  return response.data;
};

export const createPost = async (
  courseId: string,
  title: string,
  textContent: string,
  image?: File
): Promise<PostGetDto> => {
  const formData = new FormData();
  formData.append('courseId', courseId);
  formData.append('title', title);
  formData.append('textContent', textContent);
  if (image) {
    formData.append('image', image);
  }

  const response = await axiosInstance.post<PostGetDto>('/Post', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updatePost = async (
  postId: string,
  title?: string,
  textContent?: string,
  image?: File,
  removeImage?: boolean
): Promise<void> => {
  const formData = new FormData();
  if (title !== undefined) {
    formData.append('title', title);
  }
  if (textContent !== undefined) {
    formData.append('textContent', textContent);
  }
  if (image) {
    formData.append('image', image);
  }
  if (removeImage) {
    formData.append('removeImage', 'true');
  }

  await axiosInstance.put(`/Post/${postId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deletePost = async (postId: string): Promise<void> => {
  await axiosInstance.delete(`/Post/${postId}`);
};

export const getMyPosts = async (): Promise<PostGetDto[]> => {
  const response = await axiosInstance.get<PostGetDto[]>('/Post/my-posts');
  return response.data;
};
