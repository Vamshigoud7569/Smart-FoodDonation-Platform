 // components/AdminDashboard_Components/DashboardHome.tsx
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import type { Submission } from './VerificationModels';
import { SubmissionRow } from './Shared';

interface Props {
  submissions: Submission[];
  onOpen: (s: Submission) => void;
  onNavigate: (key: string) => void;
}

export default function DashboardHome({  submissions,onOpen, onNavigate }: Props) 
{



  const pending  = submissions.filter((s) => s.status === "PENDING");
  const approved = submissions.filter((s) => s.status === "VERIFIED").length;
  const rejected = submissions.filter((s) => s.status === "REJECTED").length;

 

  return (

    <div className="av-section page-enter">
      <div className="av-stat-grid">
        <div className="av-stat-card av-stat-amber">
          <div className="av-stat-icon-wrap"><Clock size={19} /></div>
          <div>
            <p className="av-stat-value">{pending.length}</p>
            <p className="av-stat-label">Pending verifications</p>
          </div>
        </div>
        <div className="av-stat-card av-stat-green">
          <div className="av-stat-icon-wrap"><CheckCircle2 size={19} /></div>
          <div>
            <p className="av-stat-value">{approved}</p>
            <p className="av-stat-label">Approved documents</p>
          </div>
        </div>
        <div className="av-stat-card av-stat-red">
          <div className="av-stat-icon-wrap"><XCircle size={19} /></div>
          <div>
            <p className="av-stat-value">{rejected}</p>
            <p className="av-stat-label">Rejected documents</p>
          </div>
        </div>
      </div>

      <div className="av-block">
        <div className="av-block-header">
          <h2 className="page-title">Pending review</h2>
          <button className="av-link-btn" onClick={() => onNavigate('verification')}>
            View verification queue →
          </button>
        </div>

        <div className="av-row-list">
          {pending.length === 0 && (
            <div className="av-empty">Nothing waiting on review right now.</div>
          )}

          {pending.map((s) => (
            <SubmissionRow key={s.userId} s={s} onOpen={onOpen} />
          ))}

        </div>
      </div>
    </div>
  );
}