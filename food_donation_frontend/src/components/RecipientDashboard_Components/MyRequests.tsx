// components/RecipientDashboard_Components/MyRequests.tsx
import { CheckCircle2, Clock, XCircle, PackageCheck, Truck, MapPin, User } from 'lucide-react';
import type { FoodRequest, RequestStatus } from './recipientModels';
import { EmptyState } from './Shared';

const STEPS: RequestStatus[] = ['PENDING', 'ACCEPTED', 'IN_TRANSIT', 'COMPLETED'];

const stepLabel: Record<string, string> = {
  PENDING: 'Requested',
  ACCEPTED: 'Approved',
  IN_TRANSIT: 'On the Way',
  COMPLETED: 'Delivered',
};

function TrackingBar({ status }: { status: RequestStatus }) {
  const currentIndex = STEPS.indexOf(status);
  if (currentIndex === -1) return null; // REJECTED / CANCELLED handled separately

  return (
    <div className="rd-tracker">
      {STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={step} className="rd-tracker-step">
            <div className={`rd-tracker-circle ${done ? 'done' : active ? 'active' : ''}`}>
              {done ? <CheckCircle2 size={14} /> : i + 1}
            </div>
            <span className={`rd-tracker-label ${active ? 'active' : done ? 'done' : ''}`}>
              {stepLabel[step]}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`rd-tracker-line ${done ? 'done' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StatusBadge({ status }: { status: RequestStatus }) {
  const map: Record<RequestStatus, { label: string; cls: string; icon: React.ReactNode }> = {
    PENDING:    { label: 'Pending Approval', cls: 'amber',  icon: <Clock size={12} /> },
    ACCEPTED:   { label: 'Approved',         cls: 'blue',   icon: <CheckCircle2 size={12} /> },
    IN_TRANSIT: { label: 'On the Way',       cls: 'purple', icon: <Truck size={12} /> },
    COMPLETED:  { label: 'Delivered',        cls: 'green',  icon: <PackageCheck size={12} /> },
    REJECTED:   { label: 'Rejected',         cls: 'red',    icon: <XCircle size={12} /> },
    CANCELLED:  { label: 'Cancelled',        cls: 'red',    icon: <XCircle size={12} /> },
  };
  const s = map[status];
  return (
    <span className={`rd-pill rd-pill-${s.cls}`}>
      {s.icon} {s.label}
    </span>
  );
}

export default function MyRequests({ requests }: { requests: FoodRequest[] }) {
  if (requests.length === 0) {
    return (
      <div className="rd-section page-enter">
        <EmptyState title="No requests yet" hint="Browse available donations and request one to see it here." />
      </div>
    );
  }

  const active = requests.filter(r => !['COMPLETED', 'REJECTED', 'CANCELLED'].includes(r.status));
  const past   = requests.filter(r =>  ['COMPLETED', 'REJECTED', 'CANCELLED'].includes(r.status));

  return (
    <div className="rd-section page-enter">

      {active.length > 0 && (
        <>
          <h3 className="rd-subsection-title">Active Requests</h3>
          <div className="rd-request-cards">
            {active.map(r => (
              <div key={r.id} className="rd-request-card">
                <div className="rd-request-card-top">
                  <div className="rd-request-info">
                    <p className="rd-request-food">{r.foodDescription}</p>
                    <p className="rd-request-meta"><MapPin size={13} /> {r.pickupAddress}</p>
                    <p className="rd-request-meta"><User size={13} /> Donor: {r.donorName}</p>
                    {r.volunteerName && (
                      <p className="rd-request-meta"><Truck size={13} /> Volunteer: {r.volunteerName}</p>
                    )}
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <TrackingBar status={r.status} />
              </div>
            ))}
          </div>
        </>
      )}

      {past.length > 0 && (
        <>
          <h3 className="rd-subsection-title" style={{ marginTop: '1.5rem' }}>Past Requests</h3>
          <div className="rd-request-cards">
            {past.map(r => (
              <div key={r.id} className={`rd-request-card rd-request-card-past`}>
                <div className="rd-request-card-top">
                  <div className="rd-request-info">
                    <p className="rd-request-food">{r.foodDescription}</p>
                    <p className="rd-request-meta"><MapPin size={13} /> {r.pickupAddress}</p>
                    <p className="rd-request-meta"><User size={13} /> Donor: {r.donorName}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
