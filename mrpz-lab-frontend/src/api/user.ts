import { axiosInstance } from '../lib/axios';
import type {
  UserGetDto,
  UpdateUserDto,
  CourseGetDto,
} from '../types/api-dtos';
import type { AxiosResponse } from 'axios';

export const getUserProfile = async (): Promise<UserGetDto> => {
  const response: AxiosResponse<UserGetDto> =
    await axiosInstance.get<UserGetDto>('/user/me');
  return response.data;
};

export const updateUser = async (data: UpdateUserDto): Promise<UserGetDto> => {
  const response: AxiosResponse<UserGetDto> =
    await axiosInstance.put<UserGetDto>('/user/me', data);
  return response.data;
};

// Admin endpoints
export const getAllUsers = async (): Promise<UserGetDto[]> => {
  const response: AxiosResponse<UserGetDto[]> = await axiosInstance.get<
    UserGetDto[]
  >('/user');
  return response.data;
};

export const getUserCourses = async (
  userId: string
): Promise<CourseGetDto[]> => {
  const response: AxiosResponse<CourseGetDto[]> = await axiosInstance.get<
    CourseGetDto[]
  >(`administrator/users/${userId}/courses`);
  return response.data;
};

export const deleteUser = async (userId: string): Promise<void> => {
  await axiosInstance.delete(`/user/${userId}`);
};

export const getUserById = async (userId: string): Promise<UserGetDto> => {
  const response: AxiosResponse<UserGetDto> =
    await axiosInstance.get<UserGetDto>(`/user/${userId}`);
  return response.data;
};
