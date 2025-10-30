import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query';
import { getAllUsers, getUserCourses, deleteUser } from '../../api/user';
import type { UserGetDto, CourseGetDto } from '../../types/api-dtos';

export const useUsers = (): UseQueryResult<UserGetDto[], Error> => {
  return useQuery<UserGetDto[], Error>({
    queryKey: ['admin', 'users'],
    queryFn: getAllUsers,
  });
};

export const useUserCourses = (
  userId: string
): UseQueryResult<CourseGetDto[], Error> => {
  return useQuery<CourseGetDto[], Error>({
    queryKey: ['admin', 'users', userId, 'courses'],
    queryFn: () => getUserCourses(userId),
    enabled: !!userId,
  });
};

export const useDeleteUser = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteUser,
    onSuccess: () => {
      // Invalidate users list to refetch after deletion
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};
