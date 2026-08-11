import { MapPin, User, Package, CheckCircle2 } from 'lucide-react';
import type { AvailablePickup, VolunteerDelivery } from './volunteerModels';

interface Props {
  pickups: AvailablePickup[];
  activeDelivery: VolunteerDelivery | null;
  onClaim: (requestId: number) => void;
  claiming: number | null;
}

export default function ActivePickups({ pickups, activeDelivery, onClaim, claiming }: Props) {
  const hasActive = activeDelivery !== null;

  return (
    <div className="vd-section">
      {hasActive && (
        <div className="vd-banner vd-banner-amber">
          <CheckCircle2 size={16} />
          You have an active delivery in progress. Complete it before claiming a new one.
        </div>
      )}

      {pickups.length === 0 ? (
        <div className="vd-empty-card" style={{ marginTop: 0 }}>
          <Package size={32} className="vd-empty-icon" />
          <p className="vd-empty-title">No pickups available</p>
          <p className="vd-empty-sub">Check back soon — new requests appear when donors approve them.</p>
        </div>
      ) : (
        <div className="vd-pickup-grid">
          {pickups.map(p => (
            <div key={p.requestId} className="vd-pickup-card">
              <div className="vd-pickup-card-top">
                <span className="vd-food-tag">{p.foodType}</span>
                <span className="vd-qty">{p.foodQuantity}</span>
              </div>
              <p className="vd-pickup-food-name">{p.foodDescription}</p>
              <p className="vd-meta"><MapPin size={13} /> {p.pickupAddress}</p>
              <p className="vd-meta"><User size={13} /> Donor: {p.donorName}</p>
              <p className="vd-meta"><User size={13} /> Recipient: {p.recipientName}</p>
              <button
                className="vd-btn vd-btn-green vd-btn-full"
                disabled={hasActive || claiming === p.requestId}
                onClick={() => onClaim(p.requestId)}
              >
                {claiming === p.requestId ? 'Claiming…' : hasActive ? 'Finish current delivery first' : '🚴 Claim Pickup'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
