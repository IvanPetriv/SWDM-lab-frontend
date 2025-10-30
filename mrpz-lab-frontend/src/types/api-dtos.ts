export type UserRole = 'Student' | 'Teacher' | 'Administrator';

export interface UserGetDto {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface SignupDto {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}

export interface AuthResponseDto {
  accessToken: string;
}

export interface UserResponseDto {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export interface UpdateUserDto {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

// Course DTOs
export interface CourseGetDto {
  id: string;
  name: string;
  description: string;
  code: number;
}

export interface CourseFileDto {
  id: string;
  courseId: string;
  fileName: string;
  filePath: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface CourseWithFilesDto {
  id: string;
  teacherId?: string;
  name: string;
  description: string;
  code: number;
  files: CourseFileDto[];
}

export interface UpdateCourseDto {
  name: string;
  description: string;
  code: number;
}

export interface CreateCourseDto {
  id: string;
  name: string;
  description: string;
  teacherId?: string;
  code: number;
}

// Student DTOs
export interface StudentGetDto {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AddStudentToCourseDto {
  studentId: string;
  courseId: string;
}

export interface AddTeacherToCourseDto {
  teacherId: string;
  courseId: string;
}
