import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { router } from './routes';
import { Toaster } from 'sonner';

// Create a client instance (outside the component)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // How many times to retry failed requests
      refetchOnWindowFocus: false, // Prevents spamming API when switching tabs
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>

      <ReactQueryDevtools initialIsOpen={false} />
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}
