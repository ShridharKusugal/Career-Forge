import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Layout from './components/Layout';
import Login from './views/Login';
import Register from './views/Register';
import Dashboard from './views/Dashboard';
import Companies from './views/Companies';
import LinkedInProfiler from './views/LinkedInProfiler';
import Learning from './views/Learning';
import MockTests from './views/MockTests';
import CodingArena from './views/CodingArena';
import ResumeBuilder from './views/ResumeBuilder';
import MockInterview from './views/MockInterview';
import AdminConsole from './views/AdminConsole';
import AdminLogin from './views/AdminLogin';
import Profile from './views/Profile';
import ExternalApply from './views/ExternalApply';

// Protect routes — redirect to /login if not authenticated
const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 animate-pulse" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/" replace />;
  return children;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 animate-pulse" />
    </div>
  );

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />

      {/* Admin login — standalone, no layout */}
      <Route path="/admin-login" element={
        user && user.role === 'ADMIN' ? <Navigate to="/admin" replace /> : <AdminLogin />
      } />

      {/* Protected routes — wrapped in Layout */}
      <Route path="/" element={
        <PrivateRoute>
          <Layout><Dashboard /></Layout>
        </PrivateRoute>
      } />
      <Route path="/companies" element={
        <PrivateRoute>
          <Layout><Companies /></Layout>
        </PrivateRoute>
      } />
      <Route path="/linkedin" element={
        <PrivateRoute>
          <Layout><LinkedInProfiler /></Layout>
        </PrivateRoute>
      } />
      <Route path="/learning" element={
        <PrivateRoute>
          <Layout><Learning /></Layout>
        </PrivateRoute>
      } />
      <Route path="/tests" element={
        <PrivateRoute>
          <Layout><MockTests /></Layout>
        </PrivateRoute>
      } />
      <Route path="/coding" element={
        <PrivateRoute>
          <Layout containerClassName="max-w-[96%] xl:max-w-[96rem] mx-auto space-y-8"><CodingArena /></Layout>
        </PrivateRoute>
      } />
      <Route path="/resume" element={
        <PrivateRoute>
          <Layout><ResumeBuilder /></Layout>
        </PrivateRoute>
      } />
      <Route path="/interview" element={
        <PrivateRoute>
          <Layout><MockInterview /></Layout>
        </PrivateRoute>
      } />
      <Route path="/profile" element={
        <PrivateRoute>
          <Layout><Profile /></Layout>
        </PrivateRoute>
      } />

      <Route path="/apply/:companyId" element={
        <PrivateRoute>
          <ExternalApply />
        </PrivateRoute>
      } />

      {/* Admin console — full-page layout (no shared Layout wrapper) */}
      <Route path="/admin" element={
        <PrivateRoute adminOnly>
          <AdminConsole />
        </PrivateRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

import { MotionConfig } from 'framer-motion';

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <MotionConfig reducedMotion="always">
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </MotionConfig>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
