import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, Truck, PackageCheck, MapPin, User, Phone } from 'lucide-react';
import { foodDonationService } from '../../services/foodDonationService';

interface IncomingRequest {
  requestId: number;
  donationId: number;
  foodDescription: string;
  foodQuantity: string;
  pickupAddress: string;
  recipientName: string;
  recipientPhone: string;
  status: string;
  requestedAt: string;
  volunteerName: string | null;
}

const STEPS = ['PENDING', 'ACCEPTED', 'IN_TRANSIT', 'COMPLETED'];
const stepLabel: Record<string, string> = {
  PENDING: 'Requested',
  ACCEPTED: 'Approved',
  IN_TRANSIT: 'On the Way',
  COMPLETED: 'Delivered',
};

function TrackingBar({ status }: { status: string }) {
  const currentIndex = STEPS.indexOf(status);
  if (currentIndex === -1) return null;
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
            {i < STEPS.length - 1 && <div className={`rd-tracker-line ${done ? 'done' : ''}`} />}
          </div>
        );
      })}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    PENDING:    { label: 'Awaiting Approval', cls: 'amber',  icon: <Clock size={12} /> },
    ACCEPTED:   { label: 'Approved',          cls: 'blue',   icon: <CheckCircle2 size={12} /> },
    IN_TRANSIT: { label: 'On the Way',        cls: 'purple', icon: <Truck size={12} /> },
    COMPLETED:  { label: 'Delivered',         cls: 'green',  icon: <PackageCheck size={12} /> },
    REJECTED:   { label: 'Rejected',          cls: 'red',    icon: <XCircle size={12} /> },
    CANCELLED:  { label: 'Cancelled',         cls: 'red',    icon: <XCircle size={12} /> },
  };
  const s = map[status] ?? { label: status, cls: 'amber', icon: null };
  return <span className={`rd-pill rd-pill-${s.cls}`}>{s.icon} {s.label}</span>;
}

export default function IncomingRequests() {
  const [requests, setRequests] = useState<IncomingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const { data } = await foodDonationService.getDonorIncomingRequests();
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch incoming requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (requestId: number) => {
    try {
      setActionError(null);
      await foodDonationService.approveDonorRequest(requestId);
      await fetchRequests();
    } catch (err: any) {
      setActionError(err?.response?.data?.message || 'Failed to approve');
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      setActionError(null);
      await foodDonationService.rejectDonorRequest(requestId);
      await fetchRequests();
    } catch (err: any) {
      setActionError(err?.response?.data?.message || 'Failed to reject');
    }
  };

  const tabs = ['All', 'PENDING', 'ACCEPTED', 'IN_TRANSIT', 'COMPLETED', 'REJECTED'];
  const filtered = activeTab === 'All' ? requests : requests.filter(r => r.status === activeTab);
  const pendingCount = requests.filter(r => r.status === 'PENDING').length;

  if (loading) return <div className="dd-loading">Loading requests...</div>;

  return (
    <div className="dashboard-layout">
      <main className="dashboard-content">
        <div className="card-container">

          {actionError && (
            <div className="rd-banner rd-banner-red" style={{ marginBottom: '1rem' }}>
              <XCircle size={16} /> {actionError}
            </div>
          )}

          <div className="tabs-row">
            {tabs.map(tab => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'All' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
                {tab === 'PENDING' && pendingCount > 0 && (
                  <span className="tab-badge">{pendingCount}</span>
                )}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="dd-empty" style={{ marginTop: '2rem' }}>
              <span className="dd-empty-icon">📋</span>
              <span className="dd-empty-text">No requests found</span>
            </div>
          ) : (
            <div className="rd-request-cards" style={{ marginTop: '1rem' }}>
              {filtered.map(r => (
                <div key={r.requestId} className="rd-request-card">
                  <div className="rd-request-card-top">
                    <div className="rd-request-info">
                      <p className="rd-request-food">{r.foodDescription}</p>
                      <p className="rd-request-meta" style={{ fontWeight: 600, color: 'var(--text)' }}>
                        Qty: {r.foodQuantity}
                      </p>
                      <p className="rd-request-meta"><MapPin size={13} /> {r.pickupAddress}</p>
                      <p className="rd-request-meta"><User size={13} /> {r.recipientName}</p>
                      <p className="rd-request-meta"><Phone size={13} /> {r.recipientPhone}</p>
                      {r.volunteerName && (
                        <p className="rd-request-meta"><Truck size={13} /> Volunteer: {r.volunteerName}</p>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      <StatusBadge status={r.status} />
                      {r.status === 'PENDING' && (
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <button
                            className="rd-btn rd-btn-primary"
                            style={{ padding: '0.35rem 0.9rem', fontSize: '0.8rem' }}
                            onClick={() => handleApprove(r.requestId)}
                          >
                            <CheckCircle2 size={14} /> Approve
                          </button>
                          <button
                            className="rd-btn"
                            style={{ padding: '0.35rem 0.9rem', fontSize: '0.8rem', background: 'var(--red-soft)', color: 'var(--red)' }}
                            onClick={() => handleReject(r.requestId)}
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {!['REJECTED', 'CANCELLED'].includes(r.status) && (
                    <TrackingBar status={r.status} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
