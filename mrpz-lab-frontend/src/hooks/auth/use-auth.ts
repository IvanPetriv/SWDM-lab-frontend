import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { login, signup } from '../../api/auth';
import { setAuthToken } from '../../lib/axios';
import type {
  LoginDto,
  SignupDto,
  AuthResponseDto,
  UserResponseDto,
} from '../../types/api-dtos';

export const useLogin = (): UseMutationResult<
  AuthResponseDto,
  Error,
  LoginDto
> => {
  return useMutation<AuthResponseDto, Error, LoginDto>({
    mutationFn: login,
    onSuccess: (data) => {
      setAuthToken(data.accessToken);
    },
  });
};

export const useSignup = (): UseMutationResult<
  UserResponseDto,
  Error,
  SignupDto
> => {
  return useMutation<UserResponseDto, Error, SignupDto>({
    mutationFn: signup,
  });
};
