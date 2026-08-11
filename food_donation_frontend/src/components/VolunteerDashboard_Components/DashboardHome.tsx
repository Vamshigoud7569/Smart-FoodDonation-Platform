import { Truck, CheckCircle2, XCircle, Package, AlertTriangle, MapPin, User } from 'lucide-react';
import type { VolunteerDashboardDto } from './volunteerModels';

const DELIVERY_STEPS = ['PICKED_UP', 'IN_TRANSIT', 'DELIVERED'];
const stepLabel: Record<string, string> = {
  PICKED_UP: 'Picked Up', IN_TRANSIT: 'In Transit', DELIVERED: 'Delivered',
};

function ActiveDeliveryCard({ delivery, onUpdateStatus }: {
  delivery: NonNullable<VolunteerDashboardDto['activeDelivery']>;
  onUpdateStatus: (deliveryId: number, status: string) => void;
}) {
  const currentIndex = DELIVERY_STEPS.indexOf(delivery.deliveryStatus);

  return (
    <div className="vd-active-card">
      <div className="vd-active-header">
        <Truck size={20} className="vd-icon-purple" />
        <span className="vd-active-title">Active Delivery</span>
        <span className={`vd-pill vd-pill-${delivery.deliveryStatus === 'IN_TRANSIT' ? 'purple' : 'amber'}`}>
          {delivery.deliveryStatus.replace('_', ' ')}
        </span>
      </div>

      <div className="vd-active-info">
        <p className="vd-food-name">{delivery.foodDescription}</p>
        <p className="vd-meta"><MapPin size={13} /> {delivery.pickupAddress}</p>
        <p className="vd-meta"><User size={13} /> Donor: {delivery.donorName} · {delivery.donorPhone}</p>
        <p className="vd-meta"><User size={13} /> Recipient: {delivery.recipientName} · {delivery.recipientPhone}</p>
      </div>

      {/* Step tracker */}
      <div className="vd-tracker">
        {DELIVERY_STEPS.map((step, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <div key={step} className="vd-tracker-step">
              <div className={`vd-tracker-circle ${done ? 'done' : active ? 'active' : ''}`}>
                {done ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span className={`vd-tracker-label ${active ? 'active' : done ? 'done' : ''}`}>{stepLabel[step]}</span>
              {i < DELIVERY_STEPS.length - 1 && <div className={`vd-tracker-line ${done ? 'done' : ''}`} />}
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="vd-action-row">
        {delivery.deliveryStatus === 'PICKED_UP' && (
          <button className="vd-btn vd-btn-purple" onClick={() => onUpdateStatus(delivery.deliveryId, 'IN_TRANSIT')}>
            <Truck size={15} /> Start Journey
          </button>
        )}
        {delivery.deliveryStatus === 'IN_TRANSIT' && (
          <button className="vd-btn vd-btn-green" onClick={() => onUpdateStatus(delivery.deliveryId, 'DELIVERED')}>
            <CheckCircle2 size={15} /> Mark Delivered
          </button>
        )}
        {['PICKED_UP', 'IN_TRANSIT'].includes(delivery.deliveryStatus) && (
          <>
            <button className="vd-btn vd-btn-red" onClick={() => onUpdateStatus(delivery.deliveryId, 'CANCELLED')}>
              <XCircle size={15} /> Cancel
            </button>
            <button className="vd-btn vd-btn-outline" onClick={() => onUpdateStatus(delivery.deliveryId, 'NOT_DELIVERED')}>
              <AlertTriangle size={15} /> Not Delivered
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function DashboardHome({ data, onNavigate, onUpdateStatus }: {
  data: VolunteerDashboardDto;
  onNavigate: (key: string) => void;
  onUpdateStatus: (deliveryId: number, status: string) => void;
}) {
  const stats = [
    { label: 'Total Deliveries', value: data.totalDeliveries,    icon: '📦', cls: 'green'  },
    { label: 'Delivered',        value: data.deliveredCount,      icon: '✅', cls: 'blue'   },
    { label: 'Cancelled',        value: data.cancelledCount,      icon: '❌', cls: 'orange' },
    { label: 'Not Delivered',    value: data.notDeliveredCount,   icon: '⚠️', cls: 'purple' },
  ];

  return (
    <>
      <div className="vd-stats">
        {stats.map(s => (
          <div key={s.label} className="vd-stat-card">
            <div className="vd-stat-top">
              <div className={`vd-stat-icon ${s.cls}`}>{s.icon}</div>
            </div>
            <div className="vd-stat-num">{s.value}</div>
            <div className="vd-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="vd-bottom-grid">
        {data.activeDelivery ? (
          <ActiveDeliveryCard delivery={data.activeDelivery} onUpdateStatus={onUpdateStatus} />
        ) : (
          <div className="vd-card vd-empty-card">
            <Package size={32} className="vd-empty-icon" />
            <p className="vd-empty-title">No active delivery</p>
            <p className="vd-empty-sub">Pick up an available request to get started</p>
            <button className="vd-btn vd-btn-green" onClick={() => onNavigate('pickups')}>
              Browse Pickups
            </button>
          </div>
        )}

        <div className="vd-card">
          <div className="vd-card-header">
            <span className="vd-card-title">Available Pickups</span>
            <button className="vd-card-link" onClick={() => onNavigate('pickups')}>View All</button>
          </div>
          {data.availablePickups.length === 0 ? (
            <div className="vd-empty-inline">No pickups available right now</div>
          ) : (
            data.availablePickups.slice(0, 4).map(p => (
              <div key={p.requestId} className="vd-pickup-row">
                <div>
                  <p className="vd-pickup-food">{p.foodDescription}</p>
                  <p className="vd-pickup-meta"><MapPin size={12} /> {p.pickupAddress}</p>
                </div>
                <span className="vd-pill vd-pill-green">Available</span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
