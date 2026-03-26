import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IUser } from '../interfaces/IUser';

interface Props {
  allowedRoles: IUser['role'][];
}

export const ProtectedRoute: React.FC<Props> = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;

  return <Outlet />; // This renders the Layout and Children
};
