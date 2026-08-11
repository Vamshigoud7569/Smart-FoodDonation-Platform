// components/RecipientDashboard_Components/VerificationCenter.tsx
import { useState } from 'react';
import {
  Building2, Home, UserRound, FileUp, CheckCircle2, Clock,
  XCircle, ShieldCheck, RotateCcw,
} from 'lucide-react';
import type { ReceiverType, RecipientVerification, UploadedDocument } from './recipientModels';
import { foodDonationService } from '../../services/foodDonationService';

interface Props {
  verification: RecipientVerification;
  onSubmit: (type: ReceiverType, docs: UploadedDocument[]) => void;
}

const typeOptions: { key: ReceiverType; label: string; desc: string; Icon: typeof Building2; docLabel: string }[] = [
  { key: 'NGO', label: 'NGO', desc: 'Registered non-profit organization', Icon: Building2, docLabel: 'NGO Registration Certificate' },
  { key: 'ORPHANAGE', label: 'ORPHANAGE', desc: 'Licensed childcare institution', Icon: Home, docLabel: 'Orphanage License / Recognition Certificate' },
  { key: 'INDIVIDUAL', label: 'INDIVIDUAL', desc: 'Requesting on your own behalf', Icon: UserRound, docLabel: 'Government-issued Photo ID' },
];

function VerifiedPanel({ verification }: { verification: RecipientVerification }) {
  const doc = verification.documents[0];
  return (
    <div className="rd-verify-result rd-verify-result-green page-enter">
      <div className="rd-verify-result-icon"><ShieldCheck size={28} /></div>
      <p className="rd-verify-result-title">You're verified</p>
      <p className="rd-verify-result-text">
        Approved on {verification.reviewedAt}. You can now request any available donation.
      </p>
      {doc && <p className="rd-verify-result-doc">{doc.label}: {doc.fileName}</p>}
    </div>
  );
}

function PendingPanel({ verification }: { verification: RecipientVerification }) {
  const doc = verification.documents[0];
  return (
    <div className="rd-verify-result rd-verify-result-amber page-enter">
      <div className="rd-verify-result-icon"><Clock size={28} /></div>
      <p className="rd-verify-result-title">Under review</p>
      <p className="rd-verify-result-text">
        Submitted {verification.submittedAt}. You can browse donations now — requesting opens as soon as an admin approves this.
      </p>
      {doc && <p className="rd-verify-result-doc">{doc.label}: {doc.fileName}</p>}
    </div>
  );
}

export default function VerificationCenter({ verification, onSubmit }: Props) {
  const [selectedType, setSelectedType] = useState<ReceiverType | null>(verification.receiverType);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Only REJECTED or UNVERIFIED fall through to the form below.
  // VERIFIED and PENDING both short-circuit into a read-only panel.
  if (verification.status === 'VERIFIED') return <VerifiedPanel verification={verification} />;
  if (verification.status === 'PENDING') return <PendingPanel verification={verification} />;

  const activeOption = typeOptions.find((t) => t.key === selectedType) || null;
  const stepIndex = selectedType ? 1 : 0;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0] ?? null;
    setFile(picked);
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedType(e.currentTarget.value as ReceiverType);
    setFile(null);
  };

  async function handleSubmit() {
    if (!selectedType || !file || !activeOption) return;

    setSubmitting(true);
   

  

    setError(null);

    const formData = new FormData();
    const payload = {
      receiverType: selectedType,
      documentLabel: activeOption.docLabel,
    };
    formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    formData.append('govId', file);

    try {
      await foodDonationService.submitVerification(formData);

      // Pull the fresh, server-confirmed state so the parent flips this
      // into PendingPanel instead of leaving the form sitting there.
      const { data: latest } = await foodDonationService.getMyVerification();
      onSubmit(latest.receiverType, [
        { label: latest.documentLabel, fileName: latest.documentUrl },
      ]);
    } catch (err:any) {
      
      //setError('Something went wrong submitting your documents. Please try again.');
      const message = err?.response?.data?.message;
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rd-section page-enter">
      {verification.status === 'REJECTED' && (
        <div className="rd-banner rd-banner-red">
          <div className="rd-banner-icon"><XCircle size={18} /></div>
          <div className="rd-banner-text">
            <p className="rd-banner-title">Your last submission was rejected</p>
            <p className="rd-banner-body">{verification.rejectionReason || 'Please review and resubmit your documents.'}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="rd-banner rd-banner-red">
          <div className="rd-banner-icon"><XCircle size={18} /></div>
          <div className="rd-banner-text">
            <p className="rd-banner-title">Submission failed</p>
            <p className="rd-banner-body">{error}</p>
          </div>
        </div>
      )}

      <div className="rd-stepper">
        {['Choose your type', 'Upload document', 'Under review'].map((label, i) => (
          <div key={label} className={`rd-step ${i <= stepIndex ? 'is-active' : ''}`}>
            <div className="rd-step-circle">{i + 1}</div>
            <p className="rd-step-label">{label}</p>
            {i < 2 && <div className="rd-step-line" />}
          </div>
        ))}
      </div>

      <div>
        <p className="rd-eyebrow">1. What type of receiver are you?</p>
        <div className="rd-type-grid">
          {typeOptions.map((opt) => (
            <button
              key={opt.key}
              className={`rd-type-card ${selectedType === opt.key ? 'is-selected' : ''}`}
              value={opt.key}
              onClick={handleClick}
            >
              <opt.Icon size={22} />
              <p className="rd-type-label">{opt.label}</p>
              <p className="rd-type-desc">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {activeOption && (
        <div className="page-enter">
          <p className="rd-eyebrow">2. Upload your {activeOption.docLabel.toLowerCase()}</p>
          <label className="rd-upload-box">
            <FileUp size={22} />
            <span>{file ? file.name : 'Click to choose a file'}</span>
            <input type="file" className="rd-upload-input" onChange={handleFileChange} accept="image/*,.pdf" />
          </label>

          <button className="rd-btn rd-btn-primary" disabled={!file || submitting} onClick={handleSubmit}>
            {verification.status === 'REJECTED' ? <RotateCcw size={16} /> : <CheckCircle2 size={16} />}
            {submitting ? 'Submitting…' : verification.status === 'REJECTED' ? 'Resubmit for review' : 'Submit for review'}
          </button>
        </div>
      )}
    </div>
  );
}