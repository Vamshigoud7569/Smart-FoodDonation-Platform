// components/RecipientDashboard_Components/RecipientProfile.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Trophy, Target, CheckCircle2, Lock, Star, Package, HeartHandshake, Shield,
  MapPin, Calendar, Phone, Edit2, Check, Clock, XCircle, ShieldAlert,
} from 'lucide-react';
import '../../styles/RecipientProfile.css';
import type {RecipientProfileDto, RecipientVerification} from './recipientModels';
import { foodDonationService } from '../../services/foodDonationService';


/* =========================================================================
   MOCK DATA — for design preview only.
   Once the backend endpoint exists, delete this block and swap the
   fetchDashboard() body back to a real foodDonationService call
   (see the commented-out version below fetchDashboard).
========================================================================= */


const CircularProgress: React.FC<{ progress: number; level: number; xp: number; target: number }> = ({ progress, level, xp, target }) => {
  
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="circular-progress-container">
      <svg className="progress-ring" width="120" height="120">
        <circle className="progress-ring-track" strokeWidth="8" fill="transparent" r={radius} cx="60" cy="60" />
        <circle
          className="progress-ring-fill"
          strokeWidth="8"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          style={{ strokeDasharray: circumference, strokeDashoffset }}
        />
      </svg>
      <div className="progress-content">
        <span className="level-label">Level</span>
        <span className="level-number">{level}</span>
      </div>
      <div className="xp-text">{xp.toLocaleString()} / {target.toLocaleString()} XP</div>
    </div>
  );
};

function VerificationStatusBadge({ status }: { status: RecipientVerification['status'] }) {
  if (status === 'VERIFIED') return <span className="profile-status-badge is-verified"><Check size={14} />Verified</span>;
  if (status === 'PENDING') return <span className="profile-status-badge is-pending"><Clock size={14} />Pending</span>;
  if (status === 'REJECTED') return <span className="profile-status-badge is-rejected"><XCircle size={14} />Rejected</span>;
  return <span className="profile-status-badge is-unverified"><ShieldAlert size={14} />Unverified</span>;
}

/* ---------- Skeleton pieces shown while "loading" ---------- */
function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`skel ${className}`} />;
}

function ProfileSkeleton() {
  return (
    <div className="fs-dashboard">
      <div className="profile-header-card">
        <div className="profile-banner"></div>
        <div className="profile-header-content">
          <div className="skel skel-avatar" />
          <div className="profile-info-main">
            <SkeletonBlock className="skel-line skel-w-40 skel-h-20" />
            <SkeletonBlock className="skel-line skel-w-70 skel-h-14"  />
          </div>
        </div>
      </div>

      <div className="dashboard-header-grid">
        <div className="panel">
          <div className="progress-layout">
            <div className="skel skel-circle" />
            <div className="metrics-grid">
              {[0, 1, 2, 3].map((i) => <SkeletonBlock key={i} className="skel-h-60" />)}
            </div>
          </div>
        </div>
        <div className="panel">
          <SkeletonBlock className="skel-line skel-w-50 skel-h-18" />
          <SkeletonBlock className="skel-line skel-w-90 skel-h-14"   />
          <SkeletonBlock className="skel-line skel-w-100 skel-h-10"  />
        </div>
      </div>

      <div className="dashboard-section">
        <SkeletonBlock className="skel-line skel-w-30 skel-h-20" />
        <div className="achievements-grid" style={{ marginTop: 14 }}>
          {[0, 1, 2].map((i) => <SkeletonBlock key={i} className="skel-h-120" />)}
        </div>
      </div>
    </div>
  );
}

const RecipientProfile: React.FC<{ verification: RecipientVerification }> = ({ verification }) => {
  const [avatarUrl, setAvatarUrl] = useState<string>("https://tse2.mm.bing.net/th/id/OIP.sS6g9O5pe5mlQK1NF-hQTAHaFe?r=0&rs=1&pid=ImgDetMain&o=7&rm=3");
  const fileRef = useRef<HTMLInputElement>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const [dashboard, setDashboard] = useState<RecipientProfileDto | null>(null);
  const [loading, setLoading] = useState(true);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setAvatarUrl(URL.createObjectURL(file));
      setShowPhotoModal(false);
    }
  };

  const removeAvatar = () => {
    setAvatarUrl("https://tse2.mm.bing.net/th/id/OIP.sS6g9O5pe5mlQK1NF-hQTAHaFe?r=0&rs=1&pid=ImgDetMain&o=7&rm=3");
    setShowPhotoModal(false);
  };

  const fetchDashboard = async () => {
  try {
    
    setLoading(true);
    const response = await foodDonationService.getProfileRecipient();
    setDashboard(response.data);
  } catch (error) {
    console.error(
      'Error fetching recipient dashboard',
      error
    );
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
    fetchDashboard();
}, []);
  if (loading || !dashboard) {
    return <ProfileSkeleton />;
  }

  const { profileResponse, level, currentXp, xpTargetForNextLevel, achievementsCompleted,
    achievementsTotal, badgesEarned, badgesTotal, totalMealsReceived, peopleServed,
    nextMilestone, achievements, badges } = dashboard;

  const xpProgress = Math.min(100, (currentXp / xpTargetForNextLevel) * 100);
  const milestoneProgress = Math.min(100, (nextMilestone.currentValue / nextMilestone.targetValue) * 100);

  return (
    <div className="fs-dashboard">

      {/* --- Profile Header Section --- */}
      <div className="profile-header-card">
        <div className="profile-banner"></div>
        <div className="profile-header-content">
          <div className="profile-avatar-wrapper">
            <div className="avatar-trigger-area">
              <img src={avatarUrl} alt="Profile" className="profile-avatar" />
              <button className="avatar-edit-icon" onClick={() => setShowPhotoModal(true)}>
                <Edit2 size={14} />
              </button>
              {showPhotoModal && (
                <div className="photo-modal-overlay" onClick={() => setShowPhotoModal(false)}>
                  <div className="photo-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="photo-option" onClick={() => { window.open(avatarUrl, "_blank"); setShowPhotoModal(false); }}>
                      View Photo
                    </div>
                    <div className="photo-option" onClick={() => { fileRef.current?.click(); setShowPhotoModal(false); }}>
                      Choose Photo
                    </div>
                    <div className="photo-option danger" onClick={removeAvatar}>
                      Remove Photo
                    </div>
                  </div>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>

          <div className="profile-info-main">
            <div className="profile-name-row">
              <strong className="profile-name">{profileResponse?.name || "--"}</strong>
              <VerificationStatusBadge status={verification.status} />
            </div>

            <div className="profile-meta-row">
              <span><MapPin size={14} />{profileResponse?.city || "--"}</span>
              <span><Calendar size={14} />{profileResponse ? new Date(profileResponse.createdAt).toLocaleDateString() : "--"}</span>
              <span><Phone size={14} />{profileResponse?.phone || "--"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Section: Overall Progress & Next Goal */}
      <div className="dashboard-header-grid">
        <div className="panel progress-panel">
          <div className="progress-layout">
            <CircularProgress progress={xpProgress} level={level} xp={currentXp} target={xpTargetForNextLevel} />
            <div className="metrics-grid">
              <div className="metric">
                <Trophy size={20} className="text-orange" />
                <div className="metric-info">
                  <span className="metric-value">{achievementsCompleted}/{achievementsTotal}</span>
                  <span className="metric-label">Achievements</span>
                </div>
              </div>
              <div className="metric">
                <Star size={20} className="text-green" />
                <div className="metric-info">
                  <span className="metric-value">{badgesEarned}/{badgesTotal}</span>
                  <span className="metric-label">Badges Collected</span>
                </div>
              </div>
              <div className="metric">
                <Package size={20} className="text-orange" />
                <div className="metric-info">
                  <span className="metric-value">{totalMealsReceived}</span>
                  <span className="metric-label">Meals Received</span>
                </div>
              </div>
              <div className="metric">
                <HeartHandshake size={20} className="text-green" />
                <div className="metric-info">
                  <span className="metric-value">{peopleServed}</span>
                  <span className="metric-label">People Served</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="panel next-goal-panel">
          <div className="next-goal-header">
            <Target size={24} className="text-orange" />
            <h3>Next Milestone</h3>
          </div>
          <p className="goal-text">
            "Receive {Math.max(0, nextMilestone.targetValue - nextMilestone.currentValue)} more to unlock <strong>{nextMilestone.title}</strong>"
          </p>
          <div className="goal-progress">
            <div className="progress-header">
              <span>Progress</span>
              <span>{nextMilestone.currentValue} / {nextMilestone.targetValue}</span>
            </div>
            <div className="bar-track"><div className="bar-fill orange-fill" style={{ width: `${milestoneProgress}%` }}></div></div>
          </div>
          <div className="reward-box">
            <Shield size={16} />
            <span>Reward: <strong>{nextMilestone.rewardName}</strong></span>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <section className="dashboard-section">
        <h2 className="section-title">Achievement Progress</h2>
        <div className="achievements-grid">
          {achievements.map((acc) => {
            const percentage = Math.min(100, (acc.current / acc.target) * 100);
            return (
              <div key={acc.id} className={`achievement-card ${acc.status}`}>
                <div className="ach-header">
                  <div className="ach-icon">{acc.icon}</div>
                  {acc.status === 'completed' && <CheckCircle2 size={20} className="status-icon completed-icon" />}
                  {acc.status === 'locked' && <Lock size={18} className="status-icon locked-icon" />}
                </div>
                <div className="ach-body">
                  <h4>{acc.title}</h4>
                  <p>{acc.description}</p>
                </div>
                <div className="ach-footer">
                  <div className="progress-header">
                    <span className="status-text">
                      {acc.status === 'completed' ? 'Completed' : acc.status === 'locked' ? 'Locked' : `${Math.floor(percentage)}% Complete`}
                    </span>
                    <span className="progress-numbers">{acc.current}/{acc.target}</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill green-fill" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Badges Section */}
      <section className="dashboard-section">
        <h2 className="section-title">Badge Collection</h2>
        <div className="badges-grid">
          {badges.map((badge) => (
            <div key={badge.id} className={`badge-card ${badge.status} rarity-${badge.rarity.toLowerCase()}`}>
              <div className="badge-ring">
                <span className="badge-emoji">{badge.icon}</span>
              </div>
              <h4 className="badge-title">{badge.title}</h4>
              <span className="badge-rarity">{badge.rarity}</span>

              {badge.status === 'earned' && <span className="badge-date">Earned {badge.date}</span>}
              {badge.status === 'in-progress' && (
                <div className="badge-progress">
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${badge.progress}%` }}></div></div>
                  <span>{badge.progress}%</span>
                </div>
              )}
              {badge.status === 'locked' && <span className="badge-locked"><Lock size={12} /> Locked</span>}

              <div className="badge-tooltip">
                <strong>Unlock Requirement:</strong>
                <p>{badge.criteria}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default RecipientProfile;