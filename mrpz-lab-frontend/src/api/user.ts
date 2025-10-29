import { axiosInstance } from '../lib/axios';
import type { UserGetDto, UpdateUserDto } from '../types/api-dtos';
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
