import { axiosInstance } from '../lib/axios';
import type {
  TestGetDto,
  CreateTestDto,
  SubmitTestDto,
  TestSubmissionDto,
  StudentNotSubmittedDto,
} from '../types/api-dtos';

// Teacher endpoints
export const createTest = async (data: CreateTestDto): Promise<TestGetDto> => {
  const response = await axiosInstance.post<TestGetDto>('/Test', data);
  return response.data;
};

export const getTestWithAnswers = async (id: string): Promise<TestGetDto> => {
  const response = await axiosInstance.get<TestGetDto>(
    `/Test/${id}/with-answers`
  );
  return response.data;
};

export const getTestSubmissions = async (
  testId: string
): Promise<TestSubmissionDto[]> => {
  const response = await axiosInstance.get<TestSubmissionDto[]>(
    `/Test/${testId}/submissions`
  );
  return response.data;
};

export const getStudentsNotSubmitted = async (
  testId: string
): Promise<StudentNotSubmittedDto[]> => {
  const response = await axiosInstance.get<StudentNotSubmittedDto[]>(
    `/Test/${testId}/not-submitted`
  );
  return response.data;
};

export const deleteTest = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/Test/${id}`);
};

// Student endpoints
export const getTestsByCourse = async (
  courseId: string
): Promise<TestGetDto[]> => {
  const response = await axiosInstance.get<TestGetDto[]>(
    `/Test/course/${courseId}`
  );
  return response.data;
};

export const getTestById = async (id: string): Promise<TestGetDto> => {
  const response = await axiosInstance.get<TestGetDto>(`/Test/${id}`);
  return response.data;
};

export const submitTest = async (
  data: SubmitTestDto
): Promise<TestSubmissionDto> => {
  const response = await axiosInstance.post<TestSubmissionDto>(
    '/Test/submit',
    data
  );
  return response.data;
};

export const getMySubmissions = async (): Promise<TestSubmissionDto[]> => {
  const response = await axiosInstance.get<TestSubmissionDto[]>(
    '/Test/my-submissions'
  );
  return response.data;
};

export const getSubmissionById = async (
  id: string
): Promise<TestSubmissionDto> => {
  const response = await axiosInstance.get<TestSubmissionDto>(
    `/Test/submission/${id}`
  );
  return response.data;
};
