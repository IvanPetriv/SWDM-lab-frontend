import type { UserRole } from '../types/api-dtos';

export const getRoleDashboardPath = (role: UserRole): string => {
  switch (role) {
    case 'Student':
      return '/dashboard/student';
    case 'Teacher':
      return '/dashboard/teacher';
    case 'Administrator':
      return '/dashboard/admin';
    default:
      return '/home';
  }
};
