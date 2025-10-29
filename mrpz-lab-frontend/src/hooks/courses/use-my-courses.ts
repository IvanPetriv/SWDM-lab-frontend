import { useQuery } from '@tanstack/react-query';
import { getMyCourses } from '../../api/courses';

export const useMyCourses = () => {
  return useQuery({
    queryKey: ['courses', 'my'],
    queryFn: getMyCourses,
  });
};
