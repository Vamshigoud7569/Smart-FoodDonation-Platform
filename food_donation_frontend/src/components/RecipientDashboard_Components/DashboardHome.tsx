// components/RecipientDashboard_Components/DashboardHome.tsx
import { Clock, CheckCircle2, XCircle, ShieldAlert, ArrowRight } from 'lucide-react';
import type { DonationListing, FoodRequest, RecipientVerification } from './recipientModels';
import { StatusPill } from './Shared';

interface Props {
  verification: RecipientVerification;
  donations: DonationListing[];
  requests: FoodRequest[];
  onNavigate: (key: string) => void;
}

export default function DashboardHome({ verification, donations, requests, onNavigate }: Props) {
  const activeRequests = requests.filter((r) => r.status === 'PENDING' || r.status === 'APPROVED').length;
  console.log(localStorage.getItem('token'));

  const banner = (() => {
    if (verification.status === 'VERIFIED') {
      return {
        tone: 'green' as const,
        icon: <CheckCircle2 size={18} />,
        title: "You're verified",
        text: 'You can request any available donation.',
        cta: null,
      };
    }
    if (verification.status === 'PENDING') {
      return {
        tone: 'amber' as const,
        icon: <Clock size={18} />,
        title: 'Verification under review',
        text: "You can browse donations now — requesting opens once you're approved.",
        cta: null,
      };
    }
    if (verification.status === 'REJECTED') {
      return {
        tone: 'red' as const,
        icon: <XCircle size={18} />,
        title: 'Verification needs another look',
        text: verification.rejectionReason || 'Please resubmit your documents.',
        cta: 'Resubmit documents',
      };
    }
    return {
      tone: 'blue' as const,
      icon: <ShieldAlert size={18} />,
      title: 'Verify your account to start requesting',
      text: 'Browsing is open now — submit your documents to unlock requests.',
      cta: 'Start verification',
    };
    
  })();

  return (
    <div className="rd-section page-enter">
      <div className={`rd-banner rd-banner-${banner.tone}`}>
        <div className="rd-banner-icon">{banner.icon}</div>
        <div className="rd-banner-text">
          <p className="rd-banner-title">{banner.title}</p>
          <p className="rd-banner-body">{banner.text}</p>
        </div>
        {banner.cta && (
          <button className="rd-banner-cta" onClick={() => onNavigate('verification')}>
            {banner.cta} <ArrowRight size={14} />
          </button>
        )}
      </div>

      <div className="rd-stat-grid">
        <div className="rd-stat-card rd-stat-coral">
          <p className="rd-stat-value">{donations.length}</p>
          <p className="rd-stat-label">Donations available near you</p>
        </div>
        <div className="rd-stat-card rd-stat-green">
          <p className="rd-stat-value">{activeRequests}</p>
          <p className="rd-stat-label">Active requests</p>
        </div>
        <div className="rd-stat-card rd-stat-blue">
          <StatusPill
            label={verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
            tone={verification.status === 'VERIFIED' ? 'green' : verification.status === 'REJECTED' ? 'red' : verification.status === 'PENDING' ? 'amber' : 'neutral'}
          />
          <p className="rd-stat-label" style={{ marginTop: 10 }}>Verification status</p>
        </div>
      </div>

      <div className="rd-block">
        <div className="rd-block-header">
          <h2 className="page-title">Available donations</h2>
          <button className="rd-link-btn" onClick={() => onNavigate('browse')}>
            Browse all <ArrowRight size={14} />
          </button>
        </div>
        <div className="rd-row-list">
          {donations.slice(0, 3).map((d) => (
            <div key={d.id} className="rd-preview-row">
              <div className="rd-preview-main">
                <p className="rd-preview-title">{d.foodDescription}</p>
                <p className="rd-preview-meta">{d.name} · {d.pickupAddress}</p>
              </div>
              <span className="rd-tag">{d.foodType}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}