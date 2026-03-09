import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const HomeRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();

  // Wait for AuthContext to finish checking localStorage
  if (isLoading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Define where each role lands by default
  const dashboardMap: Record<string, string> = {
    'INVALID': '/login',
    'FIELD_OFFICER': '/field-officer/dashboard',
    'CUSTODIAN': '/custodian/dashboard',
    'INVESTIGATOR': '/investigator/dashboard',
    'EVIDENCE_MANAGER': '/evidence-manager/dashboard',
  };

  const targetPath = dashboardMap[user.role] || '/login';

  return <Navigate to={targetPath} replace />;
};
