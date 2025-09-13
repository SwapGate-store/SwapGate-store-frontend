'use client'

import { useState, useEffect } from 'react';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on component mount
  useEffect(() => {
    const checkAuth = () => {
      const adminSession = localStorage.getItem('adminSession');
      if (adminSession) {
        try {
          const session = JSON.parse(adminSession);
          const now = new Date().getTime();
          
          // Check if session is still valid (24 hours)
          if (session.expiry && now < session.expiry) {
            setIsAuthenticated(true);
          } else {
            // Session expired, remove it
            localStorage.removeItem('adminSession');
          }
        } catch (error) {
          // Invalid session data, remove it
          localStorage.removeItem('adminSession');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    // Create session that expires in 24 hours
    const session = {
      timestamp: new Date().getTime(),
      expiry: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours
    };
    
    localStorage.setItem('adminSession', JSON.stringify(session));
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}