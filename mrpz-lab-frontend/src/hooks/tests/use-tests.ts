import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query';
import {
  createTest,
  getTestWithAnswers,
  getTestSubmissions,
  getStudentsNotSubmitted,
  deleteTest,
  getTestsByCourse,
  getTestById,
  submitTest,
  getMySubmissions,
  getSubmissionById,
} from '../../api/tests';
import type {
  TestGetDto,
  CreateTestDto,
  SubmitTestDto,
  TestSubmissionDto,
  StudentNotSubmittedDto,
} from '../../types/api-dtos';

// Teacher hooks
export const useCreateTest = (): UseMutationResult<
  TestGetDto,
  Error,
  CreateTestDto
> => {
  const queryClient = useQueryClient();

  return useMutation<TestGetDto, Error, CreateTestDto>({
    mutationFn: createTest,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['tests', 'course', data.courseId],
      });
    },
  });
};

export const useTestWithAnswers = (
  testId: string
): UseQueryResult<TestGetDto, Error> => {
  return useQuery<TestGetDto, Error>({
    queryKey: ['tests', testId, 'with-answers'],
    queryFn: () => getTestWithAnswers(testId),
    enabled: !!testId,
  });
};

export const useTestSubmissions = (
  testId: string
): UseQueryResult<TestSubmissionDto[], Error> => {
  return useQuery<TestSubmissionDto[], Error>({
    queryKey: ['tests', testId, 'submissions'],
    queryFn: () => getTestSubmissions(testId),
    enabled: !!testId,
  });
};

export const useStudentsNotSubmitted = (
  testId: string
): UseQueryResult<StudentNotSubmittedDto[], Error> => {
  return useQuery<StudentNotSubmittedDto[], Error>({
    queryKey: ['tests', testId, 'not-submitted'],
    queryFn: () => getStudentsNotSubmitted(testId),
    enabled: !!testId,
  });
};

export const useDeleteTest = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
    },
  });
};

// Student hooks
export const useTestsByCourse = (
  courseId: string
): UseQueryResult<TestGetDto[], Error> => {
  return useQuery<TestGetDto[], Error>({
    queryKey: ['tests', 'course', courseId],
    queryFn: () => getTestsByCourse(courseId),
    enabled: !!courseId,
  });
};

export const useTestById = (
  testId: string
): UseQueryResult<TestGetDto, Error> => {
  return useQuery<TestGetDto, Error>({
    queryKey: ['tests', testId],
    queryFn: () => getTestById(testId),
    enabled: !!testId,
  });
};

export const useSubmitTest = (): UseMutationResult<
  TestSubmissionDto,
  Error,
  SubmitTestDto
> => {
  const queryClient = useQueryClient();

  return useMutation<TestSubmissionDto, Error, SubmitTestDto>({
    mutationFn: submitTest,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['tests', data.testId],
      });
      queryClient.invalidateQueries({
        queryKey: ['submissions', 'my-submissions'],
      });
      queryClient.invalidateQueries({
        queryKey: ['tests', data.testId, 'submissions'],
      });
    },
  });
};

export const useMySubmissions = (): UseQueryResult<
  TestSubmissionDto[],
  Error
> => {
  return useQuery<TestSubmissionDto[], Error>({
    queryKey: ['submissions', 'my-submissions'],
    queryFn: getMySubmissions,
  });
};

export const useSubmissionById = (
  submissionId: string
): UseQueryResult<TestSubmissionDto, Error> => {
  return useQuery<TestSubmissionDto, Error>({
    queryKey: ['submissions', submissionId],
    queryFn: () => getSubmissionById(submissionId),
    enabled: !!submissionId,
  });
};
