import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';

import { WorkspaceView } from "./pages/WorkspaceView"
import { AccommodationView } from "./pages/AccommodationView"
import { LoginView } from "./pages/LoginView"

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // oder ein echter Loader
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginView />} />

          {/* Geschützte Routen */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<WorkspaceView />} />
            <Route path="/ws/:wsid" element={<AccommodationView />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
