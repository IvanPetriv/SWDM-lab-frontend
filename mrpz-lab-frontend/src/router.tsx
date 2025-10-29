import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import DashboardRedirect from './components/DashboardRedirect';
import LoginPage from './pages/login-page';
import SignupPage from './pages/signup-page';
import ProfilePage from './pages/profile-page';
import StudentDashboard from './pages/student-dashboard';
import TeacherDashboard from './pages/teacher-dashboard';
import AdminDashboard from './pages/admin-dashboard';

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
