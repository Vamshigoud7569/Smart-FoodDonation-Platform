import { useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { foodDonationService } from '../services/foodDonationService';
import DashboardHome from '../components/Donordashboard_Components/DashboardHome';
import AddDonation   from '../components/Donordashboard_Components/AddDonation';
import MyDonations   from '../components/Donordashboard_Components/MyDonations';
import Analytics     from '../components/Donordashboard_Components/Analytics';
import DonorProfile  from '../components/Donordashboard_Components/DonorProfile';
import DonorSettings from '../components/Donordashboard_Components/DonorSettings';
import IncomingRequests from '../components/Donordashboard_Components/IncomingRequests';
import '../styles/DonorDashboard.css';

const navItems = [
  { key: 'dashboard',  label: 'Dashboard'       },
  { key: 'add',        label: 'Add Donation'    },
  { key: 'donations',  label: 'My Donations'    },
  { key: 'requests',   label: 'Requests'        },
  { key: 'analytics',  label: 'Analytics'       },
  { key: 'profile',    label: 'Profile'         },
  { key: 'settings',   label: 'Settings'        },
];


import {
  LayoutDashboard,
  HandPlatter,
  Package,
  BarChart3,
  UserRound,
  Settings,
  LogOut,
  ClipboardList
} from "lucide-react";

const NavIcon = ({ k }: { k: string }) => {

  const icons: Record<string, ReactNode> = {
    dashboard: <LayoutDashboard size={18} />,
    add: <HandPlatter size={18} />,
    donations: <Package size={18} />,
    requests: <ClipboardList size={18} />,
    analytics: <BarChart3 size={18} />,
    profile: <UserRound size={18} />,
    settings: <Settings size={18} />,
    logout: <LogOut size={18} />
  };

return (
    <span className="dd-nav-icon">
      {icons[k as keyof typeof icons]}
    </span>
  );
};



export default function DonorDashboard() {
  const [active, setActive] = useState('dashboard');
  const [pendingCount, setPendingCount] = useState(0);
  const navigate = useNavigate();
  const name  = localStorage.getItem('name')  || 'Donor';
  const role  = localStorage.getItem('role')  || 'DONOR';

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  useEffect(() => {
    async function fetchPending() {
      try {
        const { data } = await foodDonationService.getDonorIncomingRequests();
        setPendingCount(data.filter((r: any) => r.status === 'PENDING').length);
      } catch { /* silent */ }
    }
    fetchPending();
    const interval = setInterval(fetchPending, 10000);
    return () => clearInterval(interval);
  }, []);

  const titles: Record<string, string> = {
    dashboard: 'Donor Dashboard', add: 'Add Donation',
    donations: 'My Donations', requests: 'Incoming Requests',
    analytics: 'Analytics',
    profile: 'Profile', settings: 'Settings',
  };

  const renderContent = () => {
    switch (active) {
      case 'dashboard': return <DashboardHome onNavigate={setActive} />;
      case 'add':       return <AddDonation />;
      case 'donations': return <MyDonations />;
      case 'requests':  return <IncomingRequests />;
      case 'analytics': return <Analytics />;
      case 'profile':   return <DonorProfile />;
      case 'settings':  return <DonorSettings />;
      default:          return <DashboardHome onNavigate={setActive} />;
    }
  };

  return (
    <div className="dd-layout">

      {/* ── Sidebar ── */}
      <aside className="dd-sidebar">
        <div className="dd-logo">❤️ FoodShare</div>

        <nav className="dd-nav">
          {navItems.map(item => (
            <button key={item.key}
              className={`dd-nav-item ${active === item.key ? 'active' : ''}`}
              onClick={() => setActive(item.key)}>
              <NavIcon k={item.key} />
              {item.label}
              {item.key === 'requests' && pendingCount > 0 && (
                <span className="rd-nav-dot" style={{ marginLeft: 'auto' }} />
              )}
            </button>
          ))}
        </nav>

        <div className="dd-sidebar-footer">
          <button className="dd-nav-item" onClick={handleLogout}>
            <NavIcon k="logout" /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="dd-main">

        {/* Topbar */}
        <div className="dd-topbar">
          <span className="dd-topbar-title">{titles[active]}</span>
          <div className="dd-topbar-right">
            <div className="dd-notif-btn">
              🔔 <span className="dd-notif-badge">3</span>
            </div>
            <div className="dd-user-info">
              <div className="dd-avatar">{name.charAt(0).toUpperCase()}</div>
              <div>
                <div className="dd-user-name">{name.toUpperCase()}</div>
                <div className="dd-user-role">{role}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="dd-content">{renderContent()}</div>
      </main>
    </div>
  );
}
