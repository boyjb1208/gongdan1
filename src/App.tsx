import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';

import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';

import { Home } from './pages/Home';
import { Dashboard } from './pages/admin/Dashboard';
import { Inquiries } from './pages/admin/Inquiries';
import { Posts } from './pages/admin/Posts';
import { Settings } from './pages/admin/Settings';

function MetaTags() {
  const { settings } = useSettings();
  return (
    <Helmet>
      <title>{settings.metaTitle}</title>
      <meta name="description" content={settings.metaDescription} />
    </Helmet>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <SettingsProvider>
          <MetaTags />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="inquiries" element={<Inquiries />} />
                <Route path="posts" element={<Posts />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </SettingsProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
