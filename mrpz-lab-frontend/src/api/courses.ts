import { axiosInstance } from '../lib/axios';
import type { CourseGetDto } from '../types/api-dtos';

export const getMyCourses = async (): Promise<CourseGetDto[]> => {
  const response = await axiosInstance.get<CourseGetDto[]>('/course/my');
  return response.data;
};
