import { useEffect, useState } from 'react';
import { foodDonationService } from '../../services/foodDonationService';
import type { VolunteerAnalyticsDto } from './volunteerModels';

export default function VolunteerAnalytics() {
  const [data, setData] = useState<VolunteerAnalyticsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    foodDonationService.getVolunteerAnalytics()
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) return <div className="vd-loading">Loading analytics…</div>;

  const bars = [
    { label: 'Delivered',     value: data.delivered,     color: '#2F7D5A', pct: data.totalDeliveries ? (data.delivered / data.totalDeliveries) * 100 : 0 },
    { label: 'Cancelled',     value: data.cancelled,     color: '#C98A1D', pct: data.totalDeliveries ? (data.cancelled / data.totalDeliveries) * 100 : 0 },
    { label: 'Not Delivered', value: data.notDelivered,  color: '#D64545', pct: data.totalDeliveries ? (data.notDelivered / data.totalDeliveries) * 100 : 0 },
    { label: 'In Progress',   value: data.inProgress,    color: '#6B3FA0', pct: data.totalDeliveries ? (data.inProgress / data.totalDeliveries) * 100 : 0 },
  ];

  return (
    <div className="vd-section">
      <div className="vd-analytics-grid">
        {bars.map(b => (
          <div key={b.label} className="vd-analytics-card">
            <div className="vd-analytics-value" style={{ color: b.color }}>{b.value}</div>
            <div className="vd-analytics-label">{b.label}</div>
            <div className="vd-analytics-track">
              <div className="vd-analytics-fill" style={{ width: `${b.pct}%`, background: b.color }} />
            </div>
            <div className="vd-analytics-pct">{b.pct.toFixed(1)}%</div>
          </div>
        ))}
      </div>

      <div className="vd-card" style={{ marginTop: '1.5rem' }}>
        <div className="vd-card-header">
          <span className="vd-card-title">Delivery Breakdown</span>
          <span className="vd-card-sub">Total: {data.totalDeliveries}</span>
        </div>
        {bars.map(b => (
          <div key={b.label} className="vd-bar-row">
            <span className="vd-bar-label">{b.label}</span>
            <div className="vd-bar-track">
              <div className="vd-bar-fill" style={{ width: `${b.pct}%`, background: b.color }} />
            </div>
            <span className="vd-bar-count">{b.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
