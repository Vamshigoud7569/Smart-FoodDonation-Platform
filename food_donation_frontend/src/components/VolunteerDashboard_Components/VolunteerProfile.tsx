import { useEffect, useState, useRef } from 'react';
import { Trophy, Target, CheckCircle2, Lock, Star, Truck, Shield, MapPin, Calendar, Phone, Edit2 } from 'lucide-react';
import { foodDonationService } from '../../services/foodDonationService';
import type { VolunteerProfileDto } from './volunteerModels';
import '../../styles/DonorProfile.css';

const CircularProgress = ({ progress, level, xp, target }: { progress: number; level: number; xp: number; target: number }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  return (
    <div className="circular-progress-container">
      <svg className="progress-ring" width="120" height="120">
        <circle className="progress-ring-track" strokeWidth="8" fill="transparent" r={radius} cx="60" cy="60" />
        <circle className="progress-ring-fill" strokeWidth="8" fill="transparent" r={radius} cx="60" cy="60"
          style={{ strokeDasharray: circumference, strokeDashoffset }} />
      </svg>
      <div className="progress-content">
        <span className="level-label">Level</span>
        <span className="level-number">{level}</span>
      </div>
      <div className="xp-text">{xp.toLocaleString()} / {target.toLocaleString()} XP</div>
    </div>
  );
};

export default function VolunteerProfile() {
  const [data, setData] = useState<VolunteerProfileDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('https://tse2.mm.bing.net/th/id/OIP.sS6g9O5pe5mlQK1NF-hQTAHaFe?r=0&rs=1&pid=ImgDetMain&o=7&rm=3');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    foodDonationService.getVolunteerProfile()
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) return <div className="fs-dashboard"><p>Loading profile…</p></div>;

  const { profileResponse: p, level, currentXp, xpTargetForNextLevel,
    achievementsCompleted, achievementsTotal, badgesEarned, badgesTotal,
    totalDeliveries, deliveredCount, nextMilestone, achievements, badges } = data;

  const xpProgress = Math.min(100, (currentXp / xpTargetForNextLevel) * 100);
  const milestoneProgress = Math.min(100, (nextMilestone.currentValue / nextMilestone.targetValue) * 100);

  return (
    <div className="fs-dashboard">
      <div className="profile-header-card">
        <div className="profile-banner" />
        <div className="profile-header-content">
          <div className="profile-avatar-wrapper">
            <div className="avatar-trigger-area">
              <img src={avatarUrl} alt="Profile" className="profile-avatar" />
              <button className="avatar-edit-icon" onClick={() => setShowPhotoModal(true)}><Edit2 size={14} /></button>
              {showPhotoModal && (
                <div className="photo-modal-overlay" onClick={() => setShowPhotoModal(false)}>
                  <div className="photo-modal" onClick={e => e.stopPropagation()}>
                    <div className="photo-option" onClick={() => { window.open(avatarUrl, '_blank'); setShowPhotoModal(false); }}>View Photo</div>
                    <div className="photo-option" onClick={() => { fileRef.current?.click(); setShowPhotoModal(false); }}>Choose Photo</div>
                    <div className="photo-option danger" onClick={() => { setAvatarUrl('https://tse2.mm.bing.net/th/id/OIP.sS6g9O5pe5mlQK1NF-hQTAHaFe?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'); setShowPhotoModal(false); }}>Remove Photo</div>
                  </div>
                </div>
              )}
            </div>
            <input type="file" ref={fileRef} accept="image/*" style={{ display: 'none' }}
              onChange={e => { if (e.target.files?.[0]) setAvatarUrl(URL.createObjectURL(e.target.files[0])); }} />
          </div>
          <div className="profile-info-main">
            <div className="profile-name-row">
              <strong className="profile-name">{p.name}</strong>
              <span className="profile-status-badge"><CheckCircle2 size={14} />{p.verified ? 'Verified' : 'Unverified'}</span>
            </div>
            <div className="profile-meta-row">
              <span><MapPin size={14} />{p.city || '--'}</span>
              <span><Calendar size={14} />{new Date(p.createdAt).toLocaleDateString()}</span>
              <span><Phone size={14} />{p.phone}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-header-grid">
        <div className="panel progress-panel">
          <div className="progress-layout">
            <CircularProgress progress={xpProgress} level={level} xp={currentXp} target={xpTargetForNextLevel} />
            <div className="metrics-grid">
              <div className="metric"><Trophy size={20} className="text-orange" /><div className="metric-info"><span className="metric-value">{achievementsCompleted}/{achievementsTotal}</span><span className="metric-label">Achievements</span></div></div>
              <div className="metric"><Star size={20} className="text-green" /><div className="metric-info"><span className="metric-value">{badgesEarned}/{badgesTotal}</span><span className="metric-label">Badges</span></div></div>
              <div className="metric"><Truck size={20} className="text-orange" /><div className="metric-info"><span className="metric-value">{totalDeliveries}</span><span className="metric-label">Total Deliveries</span></div></div>
              <div className="metric"><CheckCircle2 size={20} className="text-green" /><div className="metric-info"><span className="metric-value">{deliveredCount}</span><span className="metric-label">Delivered</span></div></div>
            </div>
          </div>
        </div>

        <div className="panel next-goal-panel">
          <div className="next-goal-header"><Target size={24} className="text-orange" /><h3>Next Milestone</h3></div>
          <p className="goal-text">Complete {Math.max(0, nextMilestone.targetValue - nextMilestone.currentValue)} more deliveries to unlock <strong>{nextMilestone.title}</strong></p>
          <div className="goal-progress">
            <div className="progress-header"><span>Progress</span><span>{nextMilestone.currentValue} / {nextMilestone.targetValue}</span></div>
            <div className="bar-track"><div className="bar-fill orange-fill" style={{ width: `${milestoneProgress}%` }} /></div>
          </div>
          <div className="reward-box"><Shield size={16} /><span>Reward: <strong>{nextMilestone.rewardName}</strong></span></div>
        </div>
      </div>

      <section className="dashboard-section">
        <h2 className="section-title">Achievement Progress</h2>
        <div className="achievements-grid">
          {achievements.map(a => {
            const pct = Math.min(100, (a.current / a.target) * 100);
            return (
              <div key={a.id} className={`achievement-card ${a.status}`}>
                <div className="ach-header">
                  <div className="ach-icon">{a.icon}</div>
                  {a.status === 'completed' && <CheckCircle2 size={20} className="status-icon completed-icon" />}
                  {a.status === 'locked' && <Lock size={18} className="status-icon locked-icon" />}
                </div>
                <div className="ach-body"><h4>{a.title}</h4><p>{a.description}</p></div>
                <div className="ach-footer">
                  <div className="progress-header">
                    <span className="status-text">{a.status === 'completed' ? 'Completed' : a.status === 'locked' ? 'Locked' : `${Math.floor(pct)}% Complete`}</span>
                    <span className="progress-numbers">{a.current}/{a.target}</span>
                  </div>
                  <div className="bar-track"><div className="bar-fill green-fill" style={{ width: `${pct}%` }} /></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="dashboard-section">
        <h2 className="section-title">Badge Collection</h2>
        <div className="badges-grid">
          {badges.map(b => (
            <div key={b.id} className={`badge-card ${b.status} rarity-${b.rarity.toLowerCase()}`}>
              <div className="badge-ring"><span className="badge-emoji">{b.icon}</span></div>
              <h4 className="badge-title">{b.title}</h4>
              <span className="badge-rarity">{b.rarity}</span>
              {b.status === 'earned' && <span className="badge-date">Earned {b.date}</span>}
              {b.status === 'in-progress' && (
                <div className="badge-progress">
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${b.progress}%` }} /></div>
                  <span>{b.progress}%</span>
                </div>
              )}
              {b.status === 'locked' && <span className="badge-locked"><Lock size={12} /> Locked</span>}
              <div className="badge-tooltip"><strong>Unlock Requirement:</strong><p>{b.criteria}</p></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
