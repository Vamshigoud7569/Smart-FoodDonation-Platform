import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, FileText, CheckCircle2, Clock, XCircle, Upload, ArrowRight, ArrowLeft } from 'lucide-react';
import { foodDonationService } from '../services/foodDonationService';
import '../styles/VolunteerVerify.css';

type Status = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export default function VolunteerVerify() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('UNVERIFIED');
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // step: 0 = selfie, 1 = govId, 2 = review
  const [step, setStep] = useState(0);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [govId, setGovId] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [govIdPreview, setGovIdPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    foodDonationService.getMyVerification()
      .then(({ data }) => {
        setStatus(data.status as Status);
        setRejectionReason(data.rejectionReason ?? null);
        // If already verified, redirect straight to dashboard
        if (data.status === 'VERIFIED') navigate('/volunteer-dashboard', { replace: true });
      })
      .catch(() => setStatus('UNVERIFIED'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  function pickSelfie(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setSelfie(f);
    setSelfiePreview(f ? URL.createObjectURL(f) : null);
  }

  function pickGovId(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setGovId(f);
    setGovIdPreview(f && f.type.startsWith('image/') ? URL.createObjectURL(f) : null);
  }

  async function handleSubmit() {
    if (!selfie || !govId) return;
    setSubmitting(true);
    setError(null);
    try {
      await foodDonationService.submitVolunteerVerification(govId, selfie);
      setStatus('PENDING');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="vv-page"><div className="vv-card">Loading…</div></div>;

  // ── Status panels ──
  if (status === 'PENDING') {
    return (
      <div className="vv-page">
        <div className="vv-card">
          <div className="vv-logo">🚴 FoodShare</div>
          <div className="vv-status-panel">
            <div className="vv-status-icon amber"><Clock size={28} /></div>
            <p className="vv-status-title">Verification Under Review</p>
            <p className="vv-status-body">
              Your documents have been submitted and are being reviewed by our team.
              You'll be able to access the dashboard once approved.
            </p>
          </div>
          <button className="vv-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    );
  }

  // ── Form (UNVERIFIED or REJECTED) ──
  const steps = ['Selfie', 'Government ID', 'Review & Submit'];
  const stepIcons = [<Camera size={20} />, <FileText size={20} />, <CheckCircle2 size={20} />];

  return (
    <div className="vv-page">
      <div className="vv-card">
        <div className="vv-logo">🚴 FoodShare</div>
        <p className="vv-title">Identity Verification</p>
        <p className="vv-subtitle">We need to verify your identity before you can start picking up orders.</p>

        {status === 'REJECTED' && (
          <div className="vv-error">
            <strong>Previous submission rejected.</strong>{' '}
            {rejectionReason || 'Please resubmit your documents.'}
          </div>
        )}

        {error && <div className="vv-error">{error}</div>}

        {/* Stepper */}
        <div className="vv-stepper">
          {steps.map((label, i) => (
            <div key={label} className={`vv-step ${i < step ? 'is-done' : i === step ? 'is-active' : ''}`}>
              {i < steps.length - 1 && <div className="vv-step-line" />}
              <div className="vv-step-circle">
                {i < step ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span className="vv-step-label">{label}</span>
            </div>
          ))}
        </div>

        {/* Step 0 — Selfie */}
        {step === 0 && (
          <div>
            <p className="vv-eyebrow">Step 1 — Take a selfie</p>
            <label className={`vv-upload-box ${selfie ? 'has-file' : ''}`}>
              {selfiePreview
                ? <img src={selfiePreview} alt="selfie preview" className="vv-preview" />
                : <Camera size={32} />}
              <span>{selfie ? selfie.name : 'Upload a clear photo of your face'}</span>
              <span className="vv-upload-hint">JPEG or PNG, max 5MB</span>
              <input type="file" className="vv-upload-input" accept="image/jpeg,image/png" onChange={pickSelfie} />
            </label>
            <div className="vv-btn-row">
              <button className="vv-btn vv-btn-primary" disabled={!selfie} onClick={() => setStep(1)}>
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 1 — Government ID */}
        {step === 1 && (
          <div>
            <p className="vv-eyebrow">Step 2 — Government-issued ID</p>
            <label className={`vv-upload-box ${govId ? 'has-file' : ''}`}>
              {govIdPreview
                ? <img src={govIdPreview} alt="id preview" className="vv-preview" />
                : <Upload size={32} />}
              <span>{govId ? govId.name : 'Upload your Aadhaar / Passport / Driving License'}</span>
              <span className="vv-upload-hint">JPEG, PNG, or PDF, max 5MB</span>
              <input type="file" className="vv-upload-input" accept="image/jpeg,image/png,application/pdf" onChange={pickGovId} />
            </label>
            <div className="vv-btn-row">
              <button className="vv-btn vv-btn-ghost" onClick={() => setStep(0)}>
                <ArrowLeft size={16} /> Back
              </button>
              <button className="vv-btn vv-btn-primary" disabled={!govId} onClick={() => setStep(2)}>
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Review */}
        {step === 2 && (
          <div>
            <p className="vv-eyebrow">Step 3 — Review & Submit</p>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.4rem' }}>Selfie</p>
                {selfiePreview
                  ? <img src={selfiePreview} alt="selfie" className="vv-preview" style={{ width: '100%', height: '100px' }} />
                  : <div style={{ background: '#f3f4f6', borderRadius: 8, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}><Camera size={24} /></div>}
                <p style={{ fontSize: '0.7rem', color: '#6B3FA0', marginTop: '0.3rem', wordBreak: 'break-all' }}>{selfie?.name}</p>
              </div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.4rem' }}>Government ID</p>
                {govIdPreview
                  ? <img src={govIdPreview} alt="gov id" className="vv-preview" style={{ width: '100%', height: '100px' }} />
                  : <div style={{ background: '#f3f4f6', borderRadius: 8, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}><FileText size={24} /></div>}
                <p style={{ fontSize: '0.7rem', color: '#6B3FA0', marginTop: '0.3rem', wordBreak: 'break-all' }}>{govId?.name}</p>
              </div>
            </div>
            <div className="vv-btn-row">
              <button className="vv-btn vv-btn-ghost" onClick={() => setStep(1)} disabled={submitting}>
                <ArrowLeft size={16} /> Back
              </button>
              <button className="vv-btn vv-btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting…' : <><CheckCircle2 size={16} /> Submit for Review</>}
              </button>
            </div>
          </div>
        )}

        <button className="vv-logout" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
