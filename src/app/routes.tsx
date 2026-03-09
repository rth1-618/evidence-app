import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/layout/Layout';
import Login from './pages/Login';

// Field Officer
import FieldOfficerDashboard from './pages/field-officer/Dashboard';
import MyCases from './pages/field-officer/MyCases';
import SubmitEvidence from './pages/field-officer/SubmitEvidence';
import MyAlerts from './pages/field-officer/MyAlerts';

// Custodian
import CustodianDashboard from './pages/custodian/Dashboard';
import ScanAndStore from './pages/custodian/ScanAndStore';
import Transfers from './pages/custodian/Transfers';
import CustodyRecords from './pages/custodian/CustodyRecords';

// Investigator
import InvestigatorDashboard from './pages/investigator/Dashboard';
import Cases from './pages/investigator/Cases';
import CaseDetail from './pages/investigator/CaseDetail';
import EvidenceMap from './pages/investigator/EvidenceMap';
import LabRequests from './pages/investigator/LabRequests';

// Evidence Manager
import EvidenceManagerDashboard from './pages/evidence-manager/Dashboard';
import Users from './pages/evidence-manager/Users';
import Analytics from './pages/evidence-manager/Analytics';
import AuditLogs from './pages/evidence-manager/AuditLogs';
import StorageConfiguration from './pages/evidence-manager/StorageConfiguration';
import RetentionRules from './pages/evidence-manager/RetentionRules';
import DisposalReview from './pages/evidence-manager/DisposalReview';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  // Field Officer Routes
  {
    path: '/field-officer',
    element: <Layout title="Field Officer Dashboard" />,
    children: [
      {
        path: 'dashboard',
        element: <FieldOfficerDashboard />
      },
      {
        path: 'cases',
        element: <MyCases />
      },
      {
        path: 'submit',
        element: <SubmitEvidence />
      },
      {
        path: 'alerts',
        element: <MyAlerts />
      }
    ]
  },
  // Custodian Routes
  {
    path: '/custodian',
    element: <Layout title="Custodian Dashboard" />,
    children: [
      {
        path: 'dashboard',
        element: <CustodianDashboard />
      },
      {
        path: 'scan-store',
        element: <ScanAndStore />
      },
      {
        path: 'transfers',
        element: <Transfers />
      },
      {
        path: 'custody-records',
        element: <CustodyRecords />
      }
    ]
  },
  // Investigator Routes
  {
    path: '/investigator',
    element: <Layout title="Investigator Dashboard" />,
    children: [
      {
        path: 'dashboard',
        element: <InvestigatorDashboard />
      },
      {
        path: 'cases',
        element: <Cases />
      },
      {
        path: 'cases/:caseId',
        element: <CaseDetail />
      },
      {
        path: 'evidence-map',
        element: <EvidenceMap />
      },
      {
        path: 'lab-requests',
        element: <LabRequests />
      }
    ]
  },
  // Evidence Manager Routes
  {
    path: '/evidence-manager',
    element: <Layout title="Evidence Manager Dashboard" />,
    children: [
      {
        path: 'dashboard',
        element: <EvidenceManagerDashboard />
      },
      {
        path: 'users',
        element: <Users />
      },
      {
        path: 'analytics',
        element: <Analytics />
      },
      {
        path: 'audit-logs',
        element: <AuditLogs />
      },
      {
        path: 'storage',
        element: <StorageConfiguration />
      },
      {
        path: 'retention',
        element: <RetentionRules />
      },
      {
        path: 'disposal',
        element: <DisposalReview />
      }
    ]
  }
]);