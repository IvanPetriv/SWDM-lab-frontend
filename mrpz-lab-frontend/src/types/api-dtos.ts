export interface UserGetDto {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
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
  role?: 'Student' | 'Teacher' | 'Administrator';
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
}
