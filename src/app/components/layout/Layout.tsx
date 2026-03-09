import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  title: string;
  breadcrumbs?: string[];
}

export function Layout({ title, breadcrumbs }: LayoutProps) {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!user) return null;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole={user.role} isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[1099] lg:hidden"
          onClick={closeSidebar}
        />
      )}
      
      <div className="lg:ml-64">
        <Header title={title} breadcrumbs={breadcrumbs} onMenuClick={toggleSidebar} />
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}