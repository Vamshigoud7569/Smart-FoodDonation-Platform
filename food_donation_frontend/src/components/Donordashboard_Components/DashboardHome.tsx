import { useState, useEffect } from 'react';
import { foodDonationService } from '../../services/foodDonationService';

interface Donation {
  id: number; foodDescription: string;
  foodQuantity: string; status: string; createdAt: string;
}
//interface Stats { active: number; completed: number; peopleFed: number; impactScore: number; }

const quickActions = [
  { icon: '➕', iconCls: 'green',  title: 'Add New Donation',  sub: 'Post surplus food available',  key: 'add'       },
  { icon: '📍', iconCls: 'orange', title: 'Track Donations',   sub: 'View real-time status',         key: 'donations' },
  { icon: '📊', iconCls: 'blue',   title: 'View Analytics',    sub: 'Check your impact',             key: 'analytics' },
  
];

export default function DashboardHome({ onNavigate }: { onNavigate: (key: string) => void }) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [AllDonations, setAllDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      
      foodDonationService.getActiveDonations(),
      foodDonationService.getMyDonations(),
      
    ])
      .then(([d, s]) => { 
        
        setDonations(d.data); 
        setAllDonations(s.data); 
      
console.log("Active Donations", d.data);
  console.log("My Donations", s.data);
})
      
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const active = AllDonations.filter(s => s.status.toLowerCase() === 'active');
  const completed = AllDonations.filter(s => s.status.toLowerCase() === 'completed');
  const peopleFed = completed.reduce((sum, s) => sum + parseInt(s.foodQuantity), 0);
  const impactScore = Math.floor(peopleFed / 10) * 100;

  const statCards = [
    { label: 'Active Donations',    value: active.length,      iconCls: 'green',  icon: '🕐' },
    { label: 'Completed Donations', value: completed.length,   iconCls: 'orange', icon: '✅' },
    { label: 'People Fed',          value: peopleFed,   iconCls: 'blue',   icon: '👥' },
    { label: 'Impact Score',        value: impactScore, iconCls: 'purple', icon: '⭐' },
  ];

  return (
    <>
      {/* 4 Stat Cards */}
      <div className="dd-stats">
        {statCards.map(s => (
          <div className="dd-stat-card" key={s.label}>
            <div className="dd-stat-card-top">
              <div className={`dd-stat-icon-wrap ${s.iconCls}`}>{s.icon}</div>
              <span className="dd-stat-dots">···</span>
            </div>
            <div className="dd-stat-num">{loading ? '—' : (s.value ?? '—')}</div>
            <div className="dd-stat-label">{s.label}</div>
            <div className="dd-stat-live">↗ Live from database</div>
          </div>
        ))}
      </div>

      {/* Quick Actions + Active Donations */}
      <div className="dd-bottom-grid">

        {/* Quick Actions */}
        <div className="dd-card">
          <div className="dd-card-header">
            <span className="dd-card-title">Quick Actions</span>
          </div>
          {quickActions.map(a => (
            <div className="dd-action-item" key={a.key} onClick={() => onNavigate(a.key)}>
              <div className={`dd-action-icon ${a.iconCls}`}>{a.icon}</div>
              <div className="dd-action-text">
                <div className="dd-action-title">{a.title}</div>
                <div className="dd-action-sub">{a.sub}</div>
              </div>
              <span className="dd-action-arrow">›</span>
            </div>
          ))}
        </div>

        {/* Active Donations */}
        <div className="dd-card">
          <div className="dd-card-header">
            <span className="dd-card-title">Active Donations</span>
            <button className="dd-card-link" onClick={() => onNavigate('donations')}>View All</button>
          </div>

          {loading ? (
            <p className="dd-loading">Loading...</p>
          ) : donations.filter(d => d.status.toLowerCase() !== 'completed').length === 0 ? (
            <div className="dd-empty">
              <span className="dd-empty-icon">🍱</span>
              <span className="dd-empty-text">No active donations</span>
              <span className="dd-empty-sub">Post a donation to get started</span>
            </div>
          ) : (
            donations
              .filter(d => d.status.toLowerCase() !== 'completed')
              .slice(0, 6)
              .map(d => (
                <div className="dd-modern-donation-card" key={d.id}>
                  <div className="dd-modern-top">
                    <div className="dd-donation-avatar">
                      🍱
                    </div>
                    <div className="dd-modern-info">
                      <div className="dd-modern-title">
                        {d.foodDescription}
                      </div>
                      <div className="dd-modern-subtitle">Quantity: {d.foodQuantity}
                      </div>
                    </div>
                    <span
                      className={`dd-modern-badge ${d.status.toLowerCase()}`}>
                      {d.status}
                    </span>
                  </div>
                  <div className="dd-modern-middle">
                    <div className="dd-meta-chip">
                      📅 {
                        new Date(d.createdAt).toLocaleDateString(
                          'en-IN',
                          {
                            day: 'numeric',
                            month: 'short'
                          }
                        )
                      }
                    </div>

                    <div className="dd-meta-chip">
                      🆔 #{d.id}
                    </div>
                  </div>
                  <div className="dd-modern-bottom">
                    <div className="dd-progress-track">
                      <div
                        className={`dd-progress-fill ${d.status.toLowerCase()}`}
                      />
                    </div>
                    <div className="dd-progress-label">
                      {d.status === 'ACTIVE'
                        ? 'Waiting for NGO Request'
                        : d.status}
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>

      </div>
    </>
  );
}
