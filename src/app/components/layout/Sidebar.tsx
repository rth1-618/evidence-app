import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Upload, 
  Bell, 
  QrCode, 
  ArrowLeftRight, 
  Archive, 
  Folder, 
  Map, 
  FlaskConical, 
  Users, 
  BarChart3, 
  FileText, 
  Database, 
  Clock, 
  Trash2,
  Shield,
  X
} from 'lucide-react';
import { UserRole } from '../../interfaces/IUser';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  // Field Officer
  { path: '/field-officer/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['FIELD_OFFICER'] },
  { path: '/field-officer/cases', label: 'My Cases', icon: <Briefcase className="w-5 h-5" />, roles: ['FIELD_OFFICER'] },
  { path: '/field-officer/submit', label: 'Submit Evidence', icon: <Upload className="w-5 h-5" />, roles: ['FIELD_OFFICER'] },
  { path: '/field-officer/alerts', label: 'My Alerts', icon: <Bell className="w-5 h-5" />, roles: ['FIELD_OFFICER'] },
  
  // Custodian
  { path: '/custodian/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['CUSTODIAN'] },
  { path: '/custodian/scan-store', label: 'Scan & Store', icon: <QrCode className="w-5 h-5" />, roles: ['CUSTODIAN'] },
  { path: '/custodian/transfers', label: 'Transfers', icon: <ArrowLeftRight className="w-5 h-5" />, roles: ['CUSTODIAN'] },
  { path: '/custodian/custody-records', label: 'Custody Records', icon: <Archive className="w-5 h-5" />, roles: ['CUSTODIAN'] },
  
  // Investigator
  { path: '/investigator/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['INVESTIGATOR'] },
  { path: '/investigator/cases', label: 'Cases', icon: <Folder className="w-5 h-5" />, roles: ['INVESTIGATOR'] },
  { path: '/investigator/evidence-map', label: 'Evidence Map', icon: <Map className="w-5 h-5" />, roles: ['INVESTIGATOR'] },
  { path: '/investigator/lab-requests', label: 'Lab Requests', icon: <FlaskConical className="w-5 h-5" />, roles: ['INVESTIGATOR'] },
  
  // Evidence Manager
  { path: '/evidence-manager/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['EVIDENCE_MANAGER'] },
  { path: '/evidence-manager/users', label: 'Users', icon: <Users className="w-5 h-5" />, roles: ['EVIDENCE_MANAGER'] },
  { path: '/evidence-manager/analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, roles: ['EVIDENCE_MANAGER'] },
  { path: '/evidence-manager/audit-logs', label: 'Audit Logs', icon: <FileText className="w-5 h-5" />, roles: ['EVIDENCE_MANAGER'] },
  { path: '/evidence-manager/storage', label: 'Storage Config', icon: <Database className="w-5 h-5" />, roles: ['EVIDENCE_MANAGER'] },
  { path: '/evidence-manager/retention', label: 'Retention Rules', icon: <Clock className="w-5 h-5" />, roles: ['EVIDENCE_MANAGER'] },
  { path: '/evidence-manager/disposal', label: 'Disposal Review', icon: <Trash2 className="w-5 h-5" />, roles: ['EVIDENCE_MANAGER'] },
];

interface SidebarProps {
  userRole: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ userRole, isOpen, onClose }: SidebarProps) {
  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <div className={`w-64 bg-[#0B1F3A] h-screen fixed left-0 top-0 flex flex-col z-[1100] transition-transform duration-300 lg:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Logo/Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg">OmniCase</h1>
            <p className="text-blue-200 text-xs">Evidence Management</p>
          </div>
        </div>
        
        {/* Close button - only visible on mobile */}
        <button
          onClick={onClose}
          className="lg:hidden text-white hover:bg-white/10 p-1 rounded transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-100 hover:bg-white/5'
                }`
              }
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="text-xs text-blue-200 text-center">
          © 2026 UK Police Department
        </div>
      </div>
    </div>
  );
}