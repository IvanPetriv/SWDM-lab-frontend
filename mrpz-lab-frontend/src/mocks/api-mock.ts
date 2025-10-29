import MockAdapter from 'axios-mock-adapter';
import { axiosInstance } from '../lib/axios';
import type { UserGetDto, CourseGetDto } from '../types/api-dtos';

// Create mock adapter instance
export const mock = new MockAdapter(axiosInstance, { delayResponse: 500 });

// Mock user data
const mockUser: UserGetDto = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  username: 'johndoe',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'Student',
};

// Mock courses data
const studentCourses: CourseGetDto[] = [
  {
    id: '650e8400-e29b-41d4-a716-446655440001',
    name: 'Introduction to Computer Science',
    description: 'Learn the fundamentals of programming and computer science',
    code: 101,
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440002',
    name: 'Data Structures and Algorithms',
    description: 'Study essential data structures and algorithmic techniques',
    code: 201,
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440003',
    name: 'Web Development',
    description: 'Build modern web applications with React and Node.js',
    code: 301,
  },
];

const teacherCourses: CourseGetDto[] = [
  {
    id: '650e8400-e29b-41d4-a716-446655440004',
    name: 'Advanced Software Engineering',
    description: 'Design patterns, architecture, and best practices',
    code: 401,
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440005',
    name: 'Database Systems',
    description: 'Database design, SQL, and NoSQL technologies',
    code: 402,
  },
];

// Mock /user/me endpoint
// mock.onGet('/user/me').reply(200, mockUser);

// // Mock /course/my endpoint
// mock.onGet('/course/my').reply((config) => {
//   if (mockUser.role === 'Teacher') {
//     return [200, teacherCourses];
//   }

//   return [200, studentCourses];
// });

// Pass through all other requests to the real API
mock.onAny().passThrough();

// Enable mock
export const enableMock = () => {
  console.log('🔧 API Mocking enabled for /user/me and /course/my');
};

// Disable mock
export const disableMock = () => {
  mock.restore();
  console.log('✅ API Mocking disabled');
};
