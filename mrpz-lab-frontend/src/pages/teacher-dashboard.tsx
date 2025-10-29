import { useAuth } from '../contexts/auth-context';

export default function TeacherDashboard() {
  const { user } = useAuth();

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='bg-white rounded-lg shadow-md p-8'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>
          Teacher Dashboard
        </h2>
        <p className='text-gray-600 mb-4'>
          Welcome, {user?.firstName} {user?.lastName}!
        </p>
        <p className='text-gray-600'>
          This is your teacher dashboard. Here you can manage your courses,
          create assignments, and grade student work.
        </p>
      </div>
    </div>
  );
}
