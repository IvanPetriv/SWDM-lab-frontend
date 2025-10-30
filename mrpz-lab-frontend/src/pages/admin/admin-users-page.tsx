import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../../hooks/admin/use-users';
import {
  Loader2,
  Users as UsersIcon,
  ArrowLeft,
  Search,
  Filter,
} from 'lucide-react';
import type { UserRole } from '../../types/api-dtos';

export default function AdminUsersPage() {
  const { data: users, isLoading, error } = useUsers();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'All'>('All');

  // Filter users based on search query and role
  const filteredUsers = useMemo(() => {
    if (!users) return [];

    let filtered = users;

    // Apply role filter
    if (roleFilter !== 'All') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(query) ||
          user.lastName.toLowerCase().includes(query) ||
          user.username.toLowerCase().includes(query) ||
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [users, searchQuery, roleFilter]);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-[calc(100vh-4rem)]'>
        <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='text-red-600 bg-red-50 border border-red-200 rounded-md p-4'>
          Failed to load users: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='mb-6'>
        <button
          onClick={() => navigate('/dashboard/admin')}
          className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to Dashboard
        </button>
        <div className='flex items-center gap-3 mb-4'>
          <UsersIcon className='w-8 h-8 text-blue-600' />
          <h1 className='text-3xl font-bold text-gray-900'>User Management</h1>
        </div>

        {/* Search Bar */}
        <div className='flex items-center gap-4 mb-4'>
          <div className='relative flex-1 max-w-md'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
            <input
              type='text'
              placeholder='Search by name or username...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {/* Role Filter */}
          <div className='flex items-center gap-2'>
            <Filter className='w-5 h-5 text-gray-400' />
            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value as UserRole | 'All')
              }
              className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='All'>All Roles</option>
              <option value='Student'>Student</option>
              <option value='Teacher'>Teacher</option>
              <option value='Administrator'>Administrator</option>
            </select>
          </div>
        </div>

        <p className='text-gray-600'>
          {searchQuery || roleFilter !== 'All' ? (
            <>
              Showing {filteredUsers.length} of {users?.length || 0} users
            </>
          ) : (
            <>Total users: {users?.length || 0}</>
          )}
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {filteredUsers.map((user) => (
          <button
            key={user.id}
            onClick={() => navigate(`/admin/users/${user.id}`)}
            className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left'
          >
            <div className='flex items-start justify-between mb-3'>
              <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-600'>
                {user.firstName?.[0]?.toUpperCase() ||
                  user.username?.[0]?.toUpperCase() ||
                  'U'}
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.role === 'Administrator'
                    ? 'bg-purple-100 text-purple-700'
                    : user.role === 'Teacher'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {user.role}
              </span>
            </div>
            <h3 className='text-lg font-semibold text-gray-900 mb-1'>
              {user.firstName} {user.lastName}
            </h3>
            <p className='text-sm text-gray-600 mb-1'>@{user.username}</p>
            <p className='text-sm text-gray-500'>{user.email}</p>
          </button>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className='text-center py-12 text-gray-500'>
          {searchQuery || roleFilter !== 'All' ? (
            <>No users found matching your filters</>
          ) : (
            <>No users found.</>
          )}
        </div>
      )}
    </div>
  );
}
