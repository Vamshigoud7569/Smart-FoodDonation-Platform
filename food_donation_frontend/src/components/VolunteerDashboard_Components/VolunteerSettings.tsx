import React, { useState, useMemo } from 'react';
import { Truck, Bell, ShieldCheck, UserCircle, Clock, Save, LogOut, KeyRound, X, Check, AlertTriangle } from 'lucide-react';
import '../../styles/Settings.css';
import { foodDonationService } from '../../services/foodDonationService';
import type { PasswordFields } from '../../types/PasswordFields';
import { useNavigate } from 'react-router-dom';

type Tab = 'preferences' | 'notifications' | 'privacy' | 'account';

interface Prefs {
  name: string; phone: string;
  availableForPickup: boolean; preferredTime: string;
  emailNotifications: boolean; pickupAlerts: boolean; deliveryUpdates: boolean;
  showContactNumber: boolean;
}

const DEFAULTS: Prefs = {
  name: '', phone: '',
  availableForPickup: true, preferredTime: 'afternoon',
  emailNotifications: true, pickupAlerts: true, deliveryUpdates: true,
  showContactNumber: false,
};

const EMPTY_PW: PasswordFields = { current: '', new: '', confirm: '' };

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'preferences',  label: 'Preferences',  icon: <Truck size={16} /> },
  { id: 'notifications',label: 'Notifications', icon: <Bell size={16} /> },
  { id: 'privacy',      label: 'Privacy',       icon: <ShieldCheck size={16} /> },
  { id: 'account',      label: 'Account',       icon: <UserCircle size={16} /> },
];

const Row: React.FC<{ title: string; desc: string; children: React.ReactNode; last?: boolean }> = ({ title, desc, children, last }) => (
  <div className={`ss-row ${last ? 'last' : ''}`}><div><h4>{title}</h4><p>{desc}</p></div>{children}</div>
);

const Switch: React.FC<{ checked: boolean; onChange: () => void; label: string }> = ({ checked, onChange, label }) => (
  <label className="ss-switch">
    <input type="checkbox" checked={checked} onChange={onChange} aria-label={label} />
    <span className="ss-switch-track"><span className="ss-switch-thumb" /></span>
  </label>
);

export default function VolunteerSettings() {
  const [tab, setTab] = useState<Tab>('preferences');
  const [saved, setSaved] = useState<Prefs>(DEFAULTS);
  const [draft, setDraft] = useState<Prefs>(DEFAULTS);
  const [toast, setToast] = useState<string | null>(null);
  const [showLogout, setShowLogout] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pw, setPw] = useState<PasswordFields>(EMPTY_PW);
  const navigate = useNavigate();

  const dirty = useMemo(() => JSON.stringify(saved) !== JSON.stringify(draft), [saved, draft]);
  const update = <K extends keyof Prefs>(k: K, v: Prefs[K]) => setDraft(p => ({ ...p, [k]: v }));
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2400); };

  const handleChangePassword = async () => {
    if (!pw.current || !pw.new || !pw.confirm) { showToast('Enter all fields'); return; }
    if (pw.new !== pw.confirm) { showToast('Passwords do not match'); return; }
    try {
      await foodDonationService.updatePassword(pw);
      setShowPassword(false); setPw(EMPTY_PW); showToast('Password updated');
    } catch { showToast('Error updating password'); }
  };

  return (
    <div className="ss-page">
      <div className="ss-container">
        <div className="ss-tabs">
          {TABS.map(t => (
            <button key={t.id} className={`ss-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              {t.icon}<span>{t.label}</span>
            </button>
          ))}
        </div>

        {tab === 'preferences' && (
          <section className="ss-card">
            <div className="ss-card-title"><div className="ss-icon-badge green"><Truck size={18} /></div><h2>Volunteer preferences</h2></div>
            <Row title="Available for pickup" desc="Show up in the available volunteer list">
              <Switch checked={draft.availableForPickup} onChange={() => update('availableForPickup', !draft.availableForPickup)} label="Available for pickup" />
            </Row>
            <Row title="Preferred pickup time" desc="When you're usually free to pick up" last>
              <div className="ss-time-select"><Clock size={15} />
                <select value={draft.preferredTime} onChange={e => update('preferredTime', e.target.value)}>
                  <option value="morning">Morning (7–11am)</option>
                  <option value="afternoon">Afternoon (12–4pm)</option>
                  <option value="evening">Evening (5–9pm)</option>
                </select>
              </div>
            </Row>
          </section>
        )}

        {tab === 'notifications' && (
          <section className="ss-card">
            <div className="ss-card-title"><div className="ss-icon-badge orange"><Bell size={18} /></div><h2>Notifications</h2></div>
            <Row title="Email notifications" desc="Updates sent to your inbox">
              <Switch checked={draft.emailNotifications} onChange={() => update('emailNotifications', !draft.emailNotifications)} label="Email notifications" />
            </Row>
            <Row title="Pickup alerts" desc="Notified when new pickups are available">
              <Switch checked={draft.pickupAlerts} onChange={() => update('pickupAlerts', !draft.pickupAlerts)} label="Pickup alerts" />
            </Row>
            <Row title="Delivery updates" desc="Status changes on your active delivery" last>
              <Switch checked={draft.deliveryUpdates} onChange={() => update('deliveryUpdates', !draft.deliveryUpdates)} label="Delivery updates" />
            </Row>
          </section>
        )}

        {tab === 'privacy' && (
          <section className="ss-card">
            <div className="ss-card-title"><div className="ss-icon-badge green"><ShieldCheck size={18} /></div><h2>Privacy</h2></div>
            <Row title="Show contact number" desc="Visible to donor and recipient during delivery" last>
              <Switch checked={draft.showContactNumber} onChange={() => update('showContactNumber', !draft.showContactNumber)} label="Show contact number" />
            </Row>
          </section>
        )}

        {tab === 'account' && (
          <section className="ss-card">
            <div className="ss-card-title"><div className="ss-icon-badge orange"><UserCircle size={18} /></div><h2>Account</h2></div>
            <div className="ss-field-grid">
              <div className="ss-field"><label>Full name</label><input type="text" value={draft.name} onChange={e => update('name', e.target.value)} placeholder="Your name" /></div>
              <div className="ss-field"><label>Phone number</label><input type="text" value={draft.phone} onChange={e => update('phone', e.target.value)} placeholder="+91 98765 43210" /></div>
            </div>
            <div className="ss-account-row">
              <div><h4>Change password</h4><p>Update your sign-in password</p></div>
              <button className="ss-btn-secondary" onClick={() => setShowPassword(true)}><KeyRound size={14} /> Change</button>
            </div>
            <div className="ss-account-row last">
              <div><h4>Logout</h4><p>Sign out of your account</p></div>
              <button className="ss-btn-danger-ghost" onClick={() => setShowLogout(true)}><LogOut size={14} /> Logout</button>
            </div>
          </section>
        )}
        <div className="ss-bottom-spacer" />
      </div>

      <div className={`ss-save-bar ${dirty ? 'visible' : ''}`}>
        <div className="ss-save-bar-inner">
          <span>You have unsaved changes</span>
          <button className="ss-save-btn" onClick={() => { setSaved(draft); showToast('Settings saved'); }}><Save size={15} /> Save changes</button>
        </div>
      </div>

      {showPassword && (
        <div className="ss-modal-overlay" onClick={() => setShowPassword(false)}>
          <div className="ss-modal" onClick={e => e.stopPropagation()}>
            <button className="ss-modal-close" onClick={() => setShowPassword(false)}><X size={16} /></button>
            <div className="ss-modal-icon green"><KeyRound size={20} /></div>
            <h3>Change your password</h3>
            {(['current', 'new', 'confirm'] as (keyof PasswordFields)[]).map(k => (
              <div key={k} className="ss-modal-field">
                <label>{k === 'current' ? 'Current' : k === 'new' ? 'New' : 'Confirm'} password</label>
                <input type="password" value={pw[k]} onChange={e => setPw(p => ({ ...p, [k]: e.target.value }))} placeholder="••••••••" />
              </div>
            ))}
            <div className="ss-modal-actions">
              <button className="ss-modal-cancel" onClick={() => setShowPassword(false)}>Cancel</button>
              <button className="ss-modal-confirm green" onClick={handleChangePassword}>Update password</button>
            </div>
          </div>
        </div>
      )}

      {showLogout && (
        <div className="ss-modal-overlay" onClick={() => setShowLogout(false)}>
          <div className="ss-modal" onClick={e => e.stopPropagation()}>
            <button className="ss-modal-close" onClick={() => setShowLogout(false)}><X size={16} /></button>
            <div className="ss-modal-icon orange"><AlertTriangle size={20} /></div>
            <h3>Log out?</h3>
            <p className="ss-modal-desc">You'll need to sign in again to access your account.</p>
            <div className="ss-modal-actions">
              <button className="ss-modal-cancel" onClick={() => setShowLogout(false)}>Cancel</button>
              <button className="ss-modal-confirm orange" onClick={() => { localStorage.clear(); navigate('/login'); }}>Log out</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="ss-toast"><Check size={15} /><span>{toast}</span></div>}
    </div>
  );
}
