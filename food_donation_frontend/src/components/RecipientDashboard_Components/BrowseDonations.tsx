// components/RecipientDashboard_Components/BrowseDonations.tsx
import { useMemo, useState } from 'react';
import { Search, Lock, CheckCircle2, MapPin, Clock3 } from 'lucide-react';
import type { DonationListing, RecipientVerification } from './recipientModels';
import { EmptyState } from './Shared';

interface Props {
  donations: DonationListing[];
  verification: RecipientVerification;
  requestedIds: Number[];
  onRequest: (donation: DonationListing) => void;
  onNavigate: (key: string) => void;
}

function DonationCard({
  donation, isVerified, isRequested, onRequest, onLockedClick,
}: {
  donation: DonationListing;
  isVerified: boolean;
  isRequested: boolean;
  onRequest: () => void;
  onLockedClick: () => void;
}) {
  const [shake, setShake] = useState(false);

  function handleClick() {
    if (!isVerified) {
      setShake(true);
      onLockedClick();
      setTimeout(() => setShake(false), 400);
      return;
    }
    onRequest();
  }
  

  return (
    <div className="rd-donation-card">
      <div className="rd-donation-top">
        <span className="rd-tag">{donation.foodDescription}</span>
        <span className="rd-donation-qty">{donation.foodQuantity}</span>
      </div>
      <p className="rd-donation-title">{donation.foodDescription}</p>
      <p className="rd-donation-donor">{donation.name}</p>
      <p className="rd-donation-meta"><MapPin size={13} /> {donation.pickupAddress}</p>
      <p className="rd-donation-meta"><Clock3 size={13} /> {donation.expiresAt}</p>

      <button
        className={`rd-btn rd-request-btn ${isRequested ? 'is-requested' : ''} ${!isVerified ? 'is-locked' : ''} ${shake ? 'rd-shake' : ''}`}
        onClick={handleClick}
        disabled={isRequested}
        title={!isVerified ? 'Complete verification to request donations' : undefined}
      >
        {isRequested ? <><CheckCircle2 size={15} /> Requested</> : !isVerified ? <><Lock size={14} /> Verify to request</> : 'Request donation'}
      </button>
    </div>
  );
}

export default function BrowseDonations({ donations, verification, requestedIds, onRequest, onNavigate }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const categories = useMemo(() => ['All', ...Array.from(new Set(donations.map((d) => d.foodType)))], [donations]);

  const filtered = useMemo(
    () =>
      donations.filter((d) => {
        const matchesCategory = category === 'All' || d.foodType === category;
        const q = query.toLowerCase();
        const matchesQuery = d.foodDescription.toLowerCase().includes(q) || d.foodType.toLowerCase().includes(q);
        return matchesCategory && matchesQuery;
      }),
    [donations, query, category]
  );

  const isVerified = verification.status === 'VERIFIED';

  return (
    <div className="rd-section page-enter">
      {!isVerified && (
        <div className="rd-banner rd-banner-blue">
          <div className="rd-banner-text" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lock size={15} /> You can browse freely — verify your account to start requesting donations.
          </div>
          <button className="rd-banner-cta" onClick={() => onNavigate('verification')}>Verify now</button>
        </div>
      )}

      <div className="rd-toolbar">
        <div className="rd-filter-group">
          {categories.map((c) => (
            <button key={c} className={`rd-filter-chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>
        <div className="rd-search-box">
          <Search size={15} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search donations…" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No donations match" hint="Try a different search or category." />
      ) : (
        <div className="rd-donation-grid">
          {filtered.map((d) => (
            <DonationCard
              key={d.id}
              donation={d}
              isVerified={isVerified}
              isRequested={requestedIds.includes(d.id)}
              onRequest={() => onRequest(d)}
              onLockedClick={() => onNavigate('verification')}
            />
          ))}
        </div>
      )}
    </div>
  );
}
