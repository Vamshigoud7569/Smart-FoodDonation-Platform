// pages/RecipientDashboard.tsx
import { useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHome        from '../components/RecipientDashboard_Components/DashboardHome';
import BrowseDonations      from '../components/RecipientDashboard_Components/BrowseDonations';
import MyRequests           from '../components/RecipientDashboard_Components/MyRequests';
import VerificationCenter   from '../components/RecipientDashboard_Components/VerificationCenter';
import RecipientProfile     from '../components/RecipientDashboard_Components/RecipientProfile';
import RecipientSettings    from '../components/RecipientDashboard_Components/RecipientSettings';
import type {
  DonationListing, FoodRequest, ReceiverType, RecipientVerification, UploadedDocument,
} from '../components/RecipientDashboard_Components/recipientModels';
import { foodDonationService } from '../services/foodDonationService';
import '../styles/RecipientDashboard.css';

import {LayoutDashboard, UtensilsCrossed, ClipboardList, ShieldCheck,UserRound, Settings, LogOut,}from 'lucide-react';

const navItems = [
  { key: 'dashboard',     label: 'Dashboard'          },
  { key: 'browse',        label: 'Browse Donations'   },
  { key: 'requests',      label: 'My Requests'        },
  { key: 'verification',  label: 'Verification'       },
  { key: 'profile',       label: 'Profile'            },
  { key: 'settings',      label: 'Settings'           },
];

const NavIcon = ({ k }: { k: string }) => {
  const icons: Record<string, ReactNode> = {
    dashboard: <LayoutDashboard size={18} />,
    browse: <UtensilsCrossed size={18} />,
    requests: <ClipboardList size={18} />,
    verification: <ShieldCheck size={18} />,
    profile: <UserRound size={18} />,
    settings: <Settings size={18} />,
    logout: <LogOut size={18} />,
  };
  return <span className="rd-nav-icon">{icons[k as keyof typeof icons]}</span>;
};

export default function RecipientDashboard() {

  const [active, setActive] = useState('dashboard');
  const [verification, setVerification] = useState<RecipientVerification | null>(null);
  const [loadingVerification, setLoadingVerification] = useState(true);
  const [donations,setDonations] = useState<DonationListing[]>([]);
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [error,setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  useEffect(() => {
    async function loadVerification() {
      try {
        const { data } = await foodDonationService.getMyVerification();
        setVerification({
          receiverType: data.receiverType ?? null,
          status: data.status,
          documents: data.documentUrl
            ? [{ label: data.documentLabel, fileName: data.documentUrl }]
            : [],
          submittedAt: data.submittedAt,
          reviewedAt: data.reviewedAt,
          rejectionReason: data.rejectionReason,
        });
      } catch (err) {
        console.error('Failed to load verification status', err);
        setError (err instanceof Error ? err.message : String(err));
      } finally {
        setLoadingVerification(false);
      }
    }
    loadVerification();
    async function fetchData() {
      try {
        const {data} = await foodDonationService.getRecipientDashboard();
        setDonations(data.donations);
        setRequests(data.requests);
      } catch (error) {
        console.error("Error fetching dashboard details", error);
        setError(error instanceof Error ? error.message : String(error));
      }
    }
    fetchData();

    // Poll every 10 seconds for live tracking updates
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);
if (loadingVerification || !verification) { return <div>Loading...</div>;}
  if (error) {return <div>Error: {error}</div>;}
  const needsAttention = verification.status === 'UNVERIFIED' || verification.status === 'REJECTED';
  const requestedIds = requests.map((r) => r.donation_id);

  const titles: Record<string, string> = {
    dashboard: 'Recipient Dashboard',
    browse: 'Browse Donations',
    requests: 'My Requests',
    verification: 'Account Verification',
    profile: 'Profile',
    settings: 'Settings',
  };

  function handleSubmitVerification(type: ReceiverType, docs: UploadedDocument[]) {
    const now = new Date();
    const stamp = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);
    setVerification({
      receiverType: type,
      status: 'PENDING',
      documents: docs,
      submittedAt: stamp,
      rejectionReason: undefined,
    });
  }

  async function handleRequestDonation(donation: DonationListing) {
    if (verification.status !== 'VERIFIED') return;
    try {
      await foodDonationService.requestDonation(donation.id);
      const { data } = await foodDonationService.getRecipientDashboard();
      setDonations(data.donations);
      setRequests(data.requests);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to send request';
      setError(msg);
    }
  }
  


  const renderContent = () => {
    switch (active) 
    {
      case 'dashboard':
        return <DashboardHome verification={verification} donations={donations} requests={requests} onNavigate={setActive} />;
      case 'browse':
        return <BrowseDonations donations={donations} verification={verification} requestedIds={requestedIds} onRequest={handleRequestDonation} onNavigate={setActive} />;
      case 'requests':
        return <MyRequests requests={requests} />;
      case 'verification':
        return loadingVerification
          ? <p>Loading verification status…</p>
          : <VerificationCenter verification={verification} onSubmit={handleSubmitVerification} />;
      case 'profile':
        return <RecipientProfile verification={verification} />;
      case 'settings':
        return <RecipientSettings />;
      default:
        return <DashboardHome verification={verification} donations={donations} requests={requests} onNavigate={setActive} />;
    }
  };

  return (
    <div className="rd-layout">

      {/* ── Sidebar ── */}
      <aside className="rd-sidebar">
        <div className="rd-logo">❤️ FoodShare</div>

        <nav className="rd-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`rd-nav-item ${active === item.key ? 'active' : ''}`}
              onClick={() => setActive(item.key)}
            >
              <NavIcon k={item.key} />
              {item.label}
              {item.key === 'verification' && needsAttention && <span className="rd-nav-dot" />}
            </button>
          ))}
        </nav>

        <div className="rd-sidebar-footer">
          <button className="rd-nav-item" onClick={handleLogout}>
            <NavIcon k="logout" /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="rd-main">

        {/* Topbar */}
        <div className="rd-topbar">
          <span className="rd-topbar-title page-title">{titles[active]}</span>
          <div className="rd-topbar-right">
            <div className="rd-user-info">
              <div className="rd-avatar">{name.charAt(0).toUpperCase()}</div>
              <div>
                <div className="rd-user-name">{name.toUpperCase()}</div>
                <div className="rd-user-role">{role}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rd-content">{renderContent()}</div>
      </main>
    </div>
  );
}