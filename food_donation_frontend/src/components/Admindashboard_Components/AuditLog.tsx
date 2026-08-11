// components/AdminDashboard_Components/AuditLog.tsx
import type { Submission } from './VerificationModels';
import { StatusBadge } from './Shared';

// interface Props {
//   submissions: Submission[];
//   onOpen: (s: Submission) => void;
//   onNavigate: (key: string) => void;
// }
export default function AuditLog({ submissions }: { submissions: Submission[] }) {
  const log = submissions
    .filter((s) => s.status !== "PENDING")
    .map((s) => ({
      id: s.userId,
      userName: s.name,
      status: s.status,
      time: new Date(
          s.approvedOn
        ).toLocaleDateString(),
      admin: s.approvedBy,
    }));
  return (
    <div className="av-section page-enter">
      <div className="av-table-card">
        <table className="av-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Status</th>
              <th>Date &amp; time</th>
              <th>Admin</th>
            </tr>
          </thead>
          <tbody>
            {log.length === 0 && (
              <tr><td colSpan={4} className="av-empty-cell">No verification decisions recorded yet.</td></tr>
            )}
            {log.map((entry) => (
              <tr key={entry.id} className="av-audit-row">
                <td>{entry.userName}</td>
                <td><StatusBadge status={entry.status} /></td>
                <td className="av-mono">{entry.time}</td>
                <td>{entry.admin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}