import MockAdapter from 'axios-mock-adapter';
import { axiosInstance } from '../lib/axios';
import type { UserGetDto } from '../types/api-dtos';

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

// Mock /user/me endpoint
mock.onGet('/user/me').reply(200, mockUser);

// Pass through all other requests to the real API
mock.onAny().passThrough();

// Enable mock
export const enableMock = () => {
  console.log('🔧 API Mocking enabled for /user/me');
};

// Disable mock
export const disableMock = () => {
  mock.restore();
  console.log('✅ API Mocking disabled');
};
