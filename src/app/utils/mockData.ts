export interface Case {
  id: string;
  title: string;
  type: string;
  status: 'open' | 'closed';
  assignedOfficers: string[];
  createdDate: string;
  lastModified: string;
}

export interface Evidence {
  id: string;
  title: string;
  type: string;
  caseId: string;
  status: 'active' | 'pending' | 'in-lab' | 'disposed';
  location: { lat: number; lng: number; address: string };
  submittedBy: string;
  submittedDate: string;
  description: string;
  qrCode?: string;
  storedAt?: string;
  markedForCourt?: boolean;
}

export interface PersonOfInterest {
  id: string;
  caseId: string;
  name: string;
  dob: string;
  role: string;
  photo?: string;
  lastKnownLocation?: { lat: number; lng: number; address: string };
  addedDate: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  assignedTo: string;
  status: 'pending' | 'completed';
  createdDate: string;
  response?: string;
}

export interface Transfer {
  id: string;
  evidenceId: string;
  fromLocation: string;
  toLocation: string;
  status: 'pending' | 'approved' | 'in-transit' | 'completed';
  requestedBy: string;
  requestedDate: string;
  approvedBy?: string;
  approvedDate?: string;
}

export interface CustodyEvent {
  id: string;
  evidenceId: string;
  action: string;
  performedBy: string;
  timestamp: string;
  location: string;
  notes?: string;
}

export interface LabRequest {
  id: string;
  evidenceId: string;
  caseId: string;
  requestType: string;
  status: 'pending' | 'in-lab' | 'returned';
  requestedBy: string;
  requestedDate: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  timestamp: string;
  details: string;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: string;
  badge: string;
  status: 'active' | 'inactive';
  createdDate: string;
}

export const mockCases: Case[] = [
  {
    id: 'CASE-001',
    title: 'Burglary - 42 High Street',
    type: 'Burglary',
    status: 'open',
    assignedOfficers: ['John Mitchell', 'Emma Roberts'],
    createdDate: '2026-02-10',
    lastModified: '2026-02-19'
  },
  {
    id: 'CASE-002',
    title: 'Vehicle Theft - M1 Junction 15',
    type: 'Theft',
    status: 'open',
    assignedOfficers: ['John Mitchell'],
    createdDate: '2026-02-15',
    lastModified: '2026-02-20'
  },
  {
    id: 'CASE-003',
    title: 'Fraud Investigation - Tech Corp Ltd',
    type: 'Fraud',
    status: 'closed',
    assignedOfficers: ['Michael Brown'],
    createdDate: '2026-01-20',
    lastModified: '2026-02-05'
  }
];

export const mockEvidence: Evidence[] = [
  {
    id: 'EV-001',
    title: 'CCTV Footage - Front Entrance',
    type: 'Video',
    caseId: 'CASE-001',
    status: 'active',
    location: { lat: 51.5074, lng: -0.1278, address: '42 High Street, London' },
    submittedBy: 'John Mitchell',
    submittedDate: '2026-02-10',
    description: 'CCTV footage showing suspect entering premises at 02:15 AM',
    storedAt: 'Shelf A-12',
    markedForCourt: true
  },
  {
    id: 'EV-002',
    title: 'Fingerprints - Door Handle',
    type: 'Physical',
    caseId: 'CASE-001',
    status: 'in-lab',
    location: { lat: 51.5074, lng: -0.1278, address: '42 High Street, London' },
    submittedBy: 'John Mitchell',
    submittedDate: '2026-02-10',
    description: 'Lifted fingerprints from rear door handle'
  },
  {
    id: 'EV-003',
    title: 'Vehicle Registration Plate',
    type: 'Physical',
    caseId: 'CASE-002',
    status: 'active',
    location: { lat: 52.0406, lng: -0.7594, address: 'M1 Junction 15, Northamptonshire' },
    submittedBy: 'John Mitchell',
    submittedDate: '2026-02-15',
    description: 'Damaged registration plate found at scene',
    storedAt: 'Shelf B-05'
  }
];

export const mockPersonsOfInterest: PersonOfInterest[] = [
  {
    id: 'POI-001',
    caseId: 'CASE-001',
    name: 'Marcus Reed',
    dob: '1985-06-12',
    role: 'Suspect',
    lastKnownLocation: { lat: 51.5074, lng: -0.1278, address: '15 Oak Avenue, London' },
    addedDate: '2026-02-11'
  },
  {
    id: 'POI-002',
    caseId: 'CASE-001',
    name: 'Alice Morrison',
    dob: '1978-03-22',
    role: 'Witness',
    lastKnownLocation: { lat: 51.5074, lng: -0.1278, address: '44 High Street, London' },
    addedDate: '2026-02-10'
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 'ALT-001',
    title: 'Follow-up Interview Required',
    message: 'Schedule follow-up interview with witness Alice Morrison regarding CASE-001',
    assignedTo: 'John Mitchell',
    status: 'pending',
    createdDate: '2026-02-18'
  },
  {
    id: 'ALT-002',
    title: 'Additional Evidence Collection',
    message: 'Collect additional CCTV footage from neighboring properties for CASE-001',
    assignedTo: 'John Mitchell',
    status: 'pending',
    createdDate: '2026-02-17'
  },
  {
    id: 'ALT-003',
    title: 'Scene Revisit',
    message: 'Return to M1 Junction 15 for additional evidence collection',
    assignedTo: 'John Mitchell',
    status: 'completed',
    createdDate: '2026-02-16',
    response: 'Revisited scene on 2026-02-17, no additional evidence found'
  }
];

export const mockTransfers: Transfer[] = [
  {
    id: 'TR-001',
    evidenceId: 'EV-002',
    fromLocation: 'Evidence Storage',
    toLocation: 'Forensics Lab',
    status: 'in-transit',
    requestedBy: 'David Thompson',
    requestedDate: '2026-02-19'
  },
  {
    id: 'TR-002',
    evidenceId: 'EV-001',
    fromLocation: 'Temporary Storage',
    toLocation: 'Evidence Storage',
    status: 'pending',
    requestedBy: 'John Mitchell',
    requestedDate: '2026-02-20'
  }
];

export const mockCustodyEvents: CustodyEvent[] = [
  {
    id: 'CE-001',
    evidenceId: 'EV-001',
    action: 'Evidence Submitted',
    performedBy: 'John Mitchell',
    timestamp: '2026-02-10T10:30:00',
    location: 'Field Collection'
  },
  {
    id: 'CE-002',
    evidenceId: 'EV-001',
    action: 'Scanned and Stored',
    performedBy: 'Sarah Williams',
    timestamp: '2026-02-10T14:15:00',
    location: 'Evidence Storage - Shelf A-12'
  },
  {
    id: 'CE-003',
    evidenceId: 'EV-001',
    action: 'Marked for Court',
    performedBy: 'David Thompson',
    timestamp: '2026-02-12T09:20:00',
    location: 'Evidence Storage'
  },
  {
    id: 'CE-004',
    evidenceId: 'EV-002',
    action: 'Evidence Submitted',
    performedBy: 'John Mitchell',
    timestamp: '2026-02-10T10:35:00',
    location: 'Field Collection'
  },
  {
    id: 'CE-005',
    evidenceId: 'EV-002',
    action: 'Transfer to Lab Approved',
    performedBy: 'Sarah Williams',
    timestamp: '2026-02-19T11:00:00',
    location: 'Evidence Storage'
  }
];

export const mockLabRequests: LabRequest[] = [
  {
    id: 'LAB-001',
    evidenceId: 'EV-002',
    caseId: 'CASE-001',
    requestType: 'Fingerprint Analysis',
    status: 'in-lab',
    requestedBy: 'David Thompson',
    requestedDate: '2026-02-19',
    dueDate: '2026-02-26',
    priority: 'high'
  },
  {
    id: 'LAB-002',
    evidenceId: 'EV-003',
    caseId: 'CASE-002',
    requestType: 'Trace Evidence Analysis',
    status: 'pending',
    requestedBy: 'David Thompson',
    requestedDate: '2026-02-20',
    dueDate: '2026-02-27',
    priority: 'medium'
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'LOG-001',
    userId: '1',
    userName: 'John Mitchell',
    action: 'Evidence Submitted',
    resource: 'EV-003',
    timestamp: '2026-02-15T11:22:00',
    details: 'Submitted vehicle registration plate evidence for CASE-002'
  },
  {
    id: 'LOG-002',
    userId: '2',
    userName: 'Sarah Williams',
    action: 'Evidence Stored',
    resource: 'EV-003',
    timestamp: '2026-02-15T14:05:00',
    details: 'Scanned and stored at Shelf B-05'
  },
  {
    id: 'LOG-003',
    userId: '3',
    userName: 'David Thompson',
    action: 'Lab Request Created',
    resource: 'LAB-002',
    timestamp: '2026-02-20T09:15:00',
    details: 'Created trace evidence analysis request for EV-003'
  },
  {
    id: 'LOG-004',
    userId: '4',
    userName: 'Elizabeth Carter',
    action: 'User Created',
    resource: 'USER-105',
    timestamp: '2026-02-18T16:30:00',
    details: 'Created new custodian user account'
  }
];

export const mockSystemUsers: SystemUser[] = [
  {
    id: '1',
    name: 'John Mitchell',
    email: 'officer@police.uk',
    role: 'Field Officer',
    badge: 'FO-2451',
    status: 'active',
    createdDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Sarah Williams',
    email: 'custodian@police.uk',
    role: 'Custodian',
    badge: 'CS-1892',
    status: 'active',
    createdDate: '2024-02-20'
  },
  {
    id: '3',
    name: 'David Thompson',
    email: 'investigator@police.uk',
    role: 'Investigator',
    badge: 'INV-3241',
    status: 'active',
    createdDate: '2023-11-10'
  },
  {
    id: '4',
    name: 'Elizabeth Carter',
    email: 'admin@test.com',
    role: 'Evidence Manager',
    badge: 'MGR-5012',
    status: 'active',
    createdDate: '2023-05-01'
  },
  {
    id: '5',
    name: 'Michael Brown',
    email: 'm.brown@police.uk',
    role: 'Field Officer',
    badge: 'FO-2389',
    status: 'active',
    createdDate: '2024-03-12'
  },
  {
    id: '6',
    name: 'Emma Roberts',
    email: 'e.roberts@police.uk',
    role: 'Field Officer',
    badge: 'FO-2512',
    status: 'inactive',
    createdDate: '2023-09-18'
  }
];
