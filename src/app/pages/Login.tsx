import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login(email, password);

    if (result.success) {

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      const user = JSON.parse(localStorage.getItem('user') || '{}');

      // Redirect logic based on role
      const dashboardMap: Record<string, string> = {
        'FIELD_OFFICER': '/field-officer/dashboard',
        'EVIDENCE_MANAGER': '/evidence-manager/dashboard',
        'CUSTODIAN': '/custodian/dashboard',
        'INVESTIGATOR': '/investigator/dashboard'
      };

      navigate(dashboardMap[user.role] || '/login');
    } else {
      setIsLoading(false);
      setError(result.message || 'Login failed. Please try again.');
      toast.error(result.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#0B1F3A] to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">OmniCase</h1>
          <p className="text-sm sm:text-base text-blue-200"> Evidence Custody Management System</p>
          <p className="text-blue-300 text-xs sm:text-sm mt-2">UK Police Department</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your.email@police.uk"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-3 font-medium">Demo Credentials:</p>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span>Field Officer:</span>
                <span className="font-mono text-[10px] sm:text-xs">parth@police.uk / parth</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span>Custodian:</span>
                <span className="font-mono text-[10px] sm:text-xs">chein@police.uk / chein</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span>Investigator:</span>
                <span className="font-mono text-[10px] sm:text-xs">xavier@police.uk / xavier</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span>Manager:</span>
                <span className="font-mono text-[10px] sm:text-xs">admin@test.com / admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs sm:text-sm text-blue-200">
            Authorized personnel only. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}