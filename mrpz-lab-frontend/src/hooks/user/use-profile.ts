import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query';
import { getUserProfile, updateUser } from '../../api/user';
import type { UserGetDto, UpdateUserDto } from '../../types/api-dtos';

export const useProfile = (): UseQueryResult<UserGetDto, Error> => {
  return useQuery<UserGetDto, Error>({
    queryKey: ['user', 'profile'],
    queryFn: getUserProfile,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateUser = (): UseMutationResult<
  UserGetDto,
  Error,
  UpdateUserDto
> => {
  const queryClient = useQueryClient();

  return useMutation<UserGetDto, Error, UpdateUserDto>({
    mutationFn: updateUser,
    onSuccess: (data) => {
      // Update the cache with the new user data
      queryClient.setQueryData(['user', 'profile'], data);
      // Also invalidate to refetch if needed
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
};
