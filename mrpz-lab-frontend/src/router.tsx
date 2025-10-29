import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import HomePage from './pages/home-page';
import LoginPage from './pages/login-page';
import SignupPage from './pages/signup-page';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/home'
          element={
            <ProtectedRoute>
              <HomePage />
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
