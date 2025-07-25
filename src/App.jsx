import React from 'react';

import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ToastProvider } from './context/ToastContext';

import { LoginView } from "./pages/LoginView"
import { WorkspaceView } from "./pages/WorkspaceView"
import { AccommodationView } from "./pages/AccommodationView"

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginView />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<WorkspaceView />} />
              <Route path="/ws/:wsid" element={<AccommodationView />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
