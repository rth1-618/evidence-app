import { useEffect } from 'react';
import { RouterProvider, useNavigate } from 'react-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import { router } from './routes';
import { Toaster } from 'sonner';

function AppContent() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect to role-specific dashboard
      const roleRoutes = {
        'field-officer': '/field-officer/dashboard',
        'custodian': '/custodian/dashboard',
        'investigator': '/investigator/dashboard',
        'evidence-manager': '/evidence-manager/dashboard'
      };
      
      const currentPath = window.location.pathname;
      const expectedPath = roleRoutes[user.role];
      
      // Only redirect if on login page or root
      if (currentPath === '/login' || currentPath === '/') {
        window.location.href = expectedPath;
      }
    }
  }, [user, isLoading]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
