import { axiosInstance } from '../lib/axios';
import type {
  LoginDto,
  SignupDto,
  AuthResponseDto,
  UserResponseDto,
} from '../types/api-dtos';
import type { AxiosResponse } from 'axios';

export const login = async (
  credentials: LoginDto
): Promise<AuthResponseDto> => {
  const response: AxiosResponse<AuthResponseDto> =
    await axiosInstance.post<AuthResponseDto>('/auth/login', credentials);
  return response.data;
};

export const signup = async (userData: SignupDto): Promise<UserResponseDto> => {
  const response: AxiosResponse<UserResponseDto> =
    await axiosInstance.post<UserResponseDto>('/auth/signup', userData);
  return response.data;
};
