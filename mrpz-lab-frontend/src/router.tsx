import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import DashboardRedirect from './components/DashboardRedirect';
import LoginPage from './pages/login-page';
import SignupPage from './pages/signup-page';
import ProfilePage from './pages/profile-page';
import StudentDashboard from './pages/student-dashboard';
import TeacherDashboard from './pages/teacher-dashboard';
import AdminDashboard from './pages/admin-dashboard';
import AdminUsersPage from './pages/admin/admin-users-page';
import AdminUserDetailPage from './pages/admin/admin-user-detail-page';
import AdminCoursesPage from './pages/admin/admin-courses-page';
import AdminCourseDetailPage from './pages/admin/admin-course-detail-page';
import TeacherCourseDetailPage from './pages/teacher/teacher-course-detail-page';
import StudentCourseDetailPage from './pages/student/student-course-detail-page';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />
        <Route
          path='/dashboard/student'
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/student/courses/:id'
          element={
            <ProtectedRoute>
              <StudentCourseDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/dashboard/teacher'
          element={
            <ProtectedRoute>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/dashboard/admin'
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/teacher/courses/:id'
          element={
            <ProtectedRoute>
              <TeacherCourseDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/users'
          element={
            <ProtectedRoute>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/users/:id'
          element={
            <ProtectedRoute>
              <AdminUserDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/courses'
          element={
            <ProtectedRoute>
              <AdminCoursesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/courses/:id'
          element={
            <ProtectedRoute>
              <AdminCourseDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path='/home' element={<Navigate to='/dashboard' replace />} />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path='/auth'>
          <Route path='login' element={<LoginPage />} />
          <Route path='signup' element={<SignupPage />} />
        </Route>
        <Route path='/' element={<Navigate to='/auth/login' replace />} />
        <Route path='*' element={<Navigate to='/auth/login' replace />} />
      </Routes>
    </BrowserRouter>
  );
}
