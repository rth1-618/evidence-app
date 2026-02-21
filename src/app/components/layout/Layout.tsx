import React from 'react';
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole={user.role} />
      <div className="ml-64">
        <Header title={title} breadcrumbs={breadcrumbs} />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
