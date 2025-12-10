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

// Post DTOs
export interface PostGetDto {
  id: string;
  courseId: string;
  authorId: string;
  title: string;
  textContent: string;
  hasImage: boolean;
  imageContentType?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePostDto {
  courseId: string;
  title: string;
  textContent: string;
  image?: File;
}

export interface UpdatePostDto {
  title?: string;
  textContent?: string;
  image?: File;
  removeImage?: boolean;
}

// Test DTOs
export interface QuestionOptionDto {
  id: string;
  optionText: string;
  isCorrect?: boolean;
  orderIndex: number;
}

export interface QuestionDto {
  id: string;
  questionText: string;
  orderIndex: number;
  options: QuestionOptionDto[];
}

export interface TestGetDto {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  questions: QuestionDto[];
}

export interface CreateQuestionOptionDto {
  optionText: string;
  isCorrect: boolean;
}

export interface CreateQuestionDto {
  questionText: string;
  options: CreateQuestionOptionDto[];
}

export interface CreateTestDto {
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  questions: CreateQuestionDto[];
}

export interface SubmissionAnswerDto {
  questionId: string;
  questionText: string;
  selectedOptionId: string;
  selectedOptionText: string;
  isCorrect: boolean;
}

export interface TestSubmissionDto {
  id: string;
  testId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  grade: number;
  answers: SubmissionAnswerDto[];
}

export interface SubmitTestAnswerDto {
  questionId: string;
  selectedOptionId: string;
}

export interface SubmitTestDto {
  testId: string;
  answers: SubmitTestAnswerDto[];
}

export interface StudentNotSubmittedDto {
  studentId: string;
  studentName: string;
  studentEmail: string;
}
