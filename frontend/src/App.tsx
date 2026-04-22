import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components';
import {
  LoginPage,
  RegisterPage,
  FamilyListPage,
  FamilyCreatePage,
  FamilyDetailPage,
  MemberCreatePage,
  MemberDetailPage,
  ProfilePage,
} from './pages';
import { useAuthStore } from './stores';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/families" replace /> : <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/families"
            element={
              <ProtectedRoute>
                <FamilyListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/families/new"
            element={
              <ProtectedRoute>
                <FamilyCreatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/families/:id"
            element={
              <ProtectedRoute>
                <FamilyDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/families/:familyId/members/new"
            element={
              <ProtectedRoute>
                <MemberCreatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/members/:id"
            element={
              <ProtectedRoute>
                <MemberDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/families" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
