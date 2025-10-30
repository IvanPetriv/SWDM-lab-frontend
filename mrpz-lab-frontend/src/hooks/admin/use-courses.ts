import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query';
import {
  getAllCourses,
  getCourseWithFiles,
  updateCourse,
  deleteCourse,
  addStudentToCourse,
  getCourseStudents,
  addTeacherToCourse,
  removeStudentFromCourse,
  uploadFile,
  deleteFile,
} from '../../api/courses';
import { getUserById } from '../../api/user';
import type {
  CourseGetDto,
  CourseWithFilesDto,
  UserGetDto,
  UpdateCourseDto,
  StudentGetDto,
  AddStudentToCourseDto,
  AddTeacherToCourseDto,
  CourseFileDto,
} from '../../types/api-dtos';

export const useCourses = (): UseQueryResult<CourseGetDto[], Error> => {
  return useQuery<CourseGetDto[], Error>({
    queryKey: ['admin', 'courses'],
    queryFn: getAllCourses,
  });
};

export const useCourseWithFiles = (
  courseId: string
): UseQueryResult<CourseWithFilesDto, Error> => {
  return useQuery<CourseWithFilesDto, Error>({
    queryKey: ['admin', 'courses', courseId, 'files'],
    queryFn: () => getCourseWithFiles(courseId),
    enabled: !!courseId,
  });
};

export const useUserById = (
  userId: string | undefined
): UseQueryResult<UserGetDto, Error> => {
  return useQuery<UserGetDto, Error>({
    queryKey: ['users', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  });
};

export const useUpdateCourse = (
  courseId: string
): UseMutationResult<CourseWithFilesDto, Error, UpdateCourseDto> => {
  const queryClient = useQueryClient();

  return useMutation<CourseWithFilesDto, Error, UpdateCourseDto>({
    mutationFn: (data) => updateCourse(courseId, data),
    onSuccess: (data) => {
      // Update the cache with the new course data
      queryClient.setQueryData(['admin', 'courses', courseId, 'files'], data);
      // Invalidate courses list to refetch
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
    },
  });
};

export const useDeleteCourse = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteCourse,
    onSuccess: () => {
      // Invalidate courses list to refetch after deletion
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
    },
  });
};

// Student Management Hooks
export const useCourseStudents = (
  courseId: string
): UseQueryResult<StudentGetDto[], Error> => {
  return useQuery<StudentGetDto[], Error>({
    queryKey: ['admin', 'courses', courseId, 'students'],
    queryFn: () => getCourseStudents(courseId),
    enabled: !!courseId,
  });
};

export const useAddStudentToCourse = (): UseMutationResult<
  void,
  Error,
  AddStudentToCourseDto
> => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, AddStudentToCourseDto>({
    mutationFn: addStudentToCourse,
    onSuccess: (_, variables) => {
      // Invalidate students list for this course
      queryClient.invalidateQueries({
        queryKey: ['admin', 'courses', variables.courseId, 'students'],
      });
    },
  });
};

export const useRemoveStudentFromCourse = (): UseMutationResult<
  void,
  Error,
  { studentId: string; courseId: string }
> => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { studentId: string; courseId: string }>({
    mutationFn: ({ studentId, courseId }) =>
      removeStudentFromCourse(studentId, courseId),
    onSuccess: (_, variables) => {
      // Invalidate students list for this course
      queryClient.invalidateQueries({
        queryKey: ['admin', 'courses', variables.courseId, 'students'],
      });
    },
  });
};

// Teacher Management Hook
export const useAddTeacherToCourse = (): UseMutationResult<
  void,
  Error,
  AddTeacherToCourseDto
> => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, AddTeacherToCourseDto>({
    mutationFn: addTeacherToCourse,
    onSuccess: (_, variables) => {
      // Invalidate course details to refetch with new teacher
      queryClient.invalidateQueries({
        queryKey: ['admin', 'courses', variables.courseId, 'files'],
      });
      queryClient.invalidateQueries({
        queryKey: ['admin', 'courses'],
      });
    },
  });
};

// File Management Hooks
export const useUploadFile = (
  courseId: string
): UseMutationResult<CourseFileDto, Error, File> => {
  const queryClient = useQueryClient();

  return useMutation<CourseFileDto, Error, File>({
    mutationFn: (file) => uploadFile(file, courseId),
    onSuccess: () => {
      // Invalidate course details to refetch with new file
      queryClient.invalidateQueries({
        queryKey: ['admin', 'courses', courseId, 'files'],
      });
    },
  });
};

export const useDeleteFile = (
  courseId: string
): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteFile,
    onSuccess: () => {
      // Invalidate course details to refetch without deleted file
      queryClient.invalidateQueries({
        queryKey: ['admin', 'courses', courseId, 'files'],
      });
    },
  });
};
