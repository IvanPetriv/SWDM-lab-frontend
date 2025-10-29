import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getUserProfile } from '../../api/user';
import type { UserGetDto } from '../../types/api-dtos';

export const useProfile = (): UseQueryResult<UserGetDto, Error> => {
  return useQuery<UserGetDto, Error>({
    queryKey: ['user', 'profile'],
    queryFn: getUserProfile,
    staleTime: 1000 * 60 * 5,
  });
};
