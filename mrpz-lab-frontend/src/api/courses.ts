import { axiosInstance } from '../lib/axios';
import type {
  CourseGetDto,
  CourseWithFilesDto,
  UpdateCourseDto,
  StudentGetDto,
  AddStudentToCourseDto,
  AddTeacherToCourseDto,
  CourseFileDto,
} from '../types/api-dtos';

export const getMyCourses = async (): Promise<CourseGetDto[]> => {
  const response = await axiosInstance.get<CourseGetDto[]>('/course/my');
  return response.data;
};

export const getAllCourses = async (): Promise<CourseGetDto[]> => {
  const response = await axiosInstance.get<CourseGetDto[]>('/course');
  return response.data;
};

export const getCourseWithFiles = async (
  courseId: string
): Promise<CourseWithFilesDto> => {
  const response = await axiosInstance.get<CourseWithFilesDto>(
    `/course/${courseId}/files`
  );
  return response.data;
};

export const updateCourse = async (
  courseId: string,
  data: UpdateCourseDto
): Promise<CourseWithFilesDto> => {
  const response = await axiosInstance.put<CourseWithFilesDto>(
    `/course/${courseId}`,
    data
  );
  return response.data;
};

export const deleteCourse = async (courseId: string): Promise<void> => {
  await axiosInstance.delete(`/course/${courseId}`);
};

// Student and Teacher Management
export const addStudentToCourse = async (
  data: AddStudentToCourseDto
): Promise<void> => {
  await axiosInstance.post('/enrollment/student', data);
};

export const getCourseStudents = async (
  courseId: string
): Promise<StudentGetDto[]> => {
  const response = await axiosInstance.get<StudentGetDto[]>(
    `enrollment/course/${courseId}/students`
  );
  return response.data;
};

export const addTeacherToCourse = async (
  data: AddTeacherToCourseDto
): Promise<void> => {
  await axiosInstance.post('/enrollment/teacher', data);
};

export const removeStudentFromCourse = async (
  studentId: string,
  courseId: string
): Promise<void> => {
  await axiosInstance.delete('/enrollment/student', {
    params: { studentId, courseId },
  });
};

// File Management
export const uploadFile = async (
  file: File,
  courseId: string
): Promise<CourseFileDto> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('courseId', courseId);

  const response = await axiosInstance.post<CourseFileDto>(
    '/file/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const downloadFile = async (fileId: string): Promise<Blob> => {
  const response = await axiosInstance.get(`/file/${fileId}`, {
    responseType: 'blob',
  });
  return response.data;
};

export const deleteFile = async (fileId: string): Promise<void> => {
  await axiosInstance.delete(`/file/${fileId}`);
};
