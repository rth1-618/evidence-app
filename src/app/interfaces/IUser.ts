export interface IUser {
  id?: string;
  evidenceId?: string;
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  badge?: string;
  status?: string;
  createdAt?: string;
}

export type UserRole = 'FIELD_OFFICER' | 'CUSTODIAN' | 'INVESTIGATOR' | 'EVIDENCE_MANAGER' | 'INVALID';

