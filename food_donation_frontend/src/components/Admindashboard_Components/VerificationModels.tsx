// components/AdminDashboard_Components/verificationModels.ts
export type SubmissionStatus =
  "PENDING"|"VERIFIED"|"REJECTED"
export interface DocumentItem {
  label: string;
  url: string;
}

export interface Submission {
  userId: number;
  name: string;
  role: string;
  status: SubmissionStatus;
  documentUrl: string;
  documentLabel: string;
  submittedAt: string;
  approvedBy?: string;
  approvedOn?: string;
  reason?: string;
}

export interface AuditEntry {
  id: number;
  userName: string;
  status: SubmissionStatus;
  time: string;
  admin: string;
}