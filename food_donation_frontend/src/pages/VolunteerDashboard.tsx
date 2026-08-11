import { useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Bike, UserRound, BarChart3, Settings, LogOut } from 'lucide-react';

import DashboardHome      from '../components/VolunteerDashboard_Components/DashboardHome';
import ActivePickups      from '../components/VolunteerDashboard_Components/ActivePickups';
import VolunteerProfile   from '../components/VolunteerDashboard_Components/VolunteerProfile';
import VolunteerAnalytics from '../components/VolunteerDashboard_Components/VolunteerAnalytics';
import VolunteerSettings  from '../components/VolunteerDashboard_Components/VolunteerSettings';

import type { VolunteerDashboardDto } from '../components/VolunteerDashboard_Components/volunteerModels';
import { foodDonationService } from '../services/foodDonationService';
import '../styles/VolunteerDashboard.css';

const navItems = [
  { key: 'dashboard', label: 'Dashboard',  Icon: LayoutDashboard },
  { key: 'pickups',   label: 'Pickups',    Icon: Bike             },
  { key: 'profile',   label: 'Profile',    Icon: UserRound        },
  { key: 'analytics', label: 'Analytics',  Icon: BarChart3        },
  { key: 'settings',  label: 'Settings',   Icon: Settings         },
];

export default function VolunteerDashboard() {
  const [active, setActive] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState<VolunteerDashboardDto | null>(null);
  const [claiming, setClaiming] = useState<number | null>(null);
  const navigate = useNavigate();

  const name = localStorage.getItem('name') || 'Volunteer';
  const role = localStorage.getItem('role') || 'VOLUNTEER';

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  const fetchDashboard = async () => {
    try {
      const { data } = await foodDonationService.getVolunteerDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load volunteer dashboard', err);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleClaim = async (requestId: number) => {
    setClaiming(requestId);
    try {
      await foodDonationService.claimPickup(requestId);
      await fetchDashboard();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to claim pickup');
    } finally {
      setClaiming(null);
    }
  };

  const handleUpdateStatus = async (deliveryId: number, status: string) => {
    try {
      await foodDonationService.updateDeliveryStatus(deliveryId, status);
      await fetchDashboard();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update status');
    }
  };

  const titles: Record<string, string> = {
    dashboard: 'Volunteer Dashboard', pickups: 'Available Pickups',
    profile: 'Profile', analytics: 'Analytics', settings: 'Settings',
  };

  const renderContent = () => {
    switch (active) {
      case 'dashboard':
        return dashboardData
          ? <DashboardHome data={dashboardData} onNavigate={setActive} onUpdateStatus={handleUpdateStatus} />
          : <div className="vd-loading">Loading…</div>;
      case 'pickups':
        return dashboardData
          ? <ActivePickups pickups={dashboardData.availablePickups} activeDelivery={dashboardData.activeDelivery} onClaim={handleClaim} claiming={claiming} />
          : <div className="vd-loading">Loading…</div>;
      case 'profile':    return <VolunteerProfile />;
      case 'analytics':  return <VolunteerAnalytics />;
      case 'settings':   return <VolunteerSettings />;
      default:           return null;
    }
  };

  return (
    <div className="vd-layout">
      <aside className="vd-sidebar">
        <div className="vd-logo">🚴 FoodShare</div>
        <nav className="vd-nav">
          {navItems.map(({ key, label, Icon }) => (
            <button
              key={key}
              className={`vd-nav-item ${active === key ? 'active' : ''}`}
              onClick={() => setActive(key)}
            >
              <span className="vd-nav-icon"><Icon size={18} /></span>
              {label}
            </button>
          ))}
        </nav>
        <div className="vd-sidebar-footer">
          <button className="vd-nav-item" onClick={handleLogout}>
            <span className="vd-nav-icon"><LogOut size={18} /></span> Logout
          </button>
        </div>
      </aside>

      <main className="vd-main">
        <div className="vd-topbar">
          <span className="vd-topbar-title page-title">{titles[active]}</span>
          <div className="vd-topbar-right">
            <div className="vd-user-info">
              <div className="vd-avatar">{name.charAt(0).toUpperCase()}</div>
              <div>
                <div className="vd-user-name">{name.toUpperCase()}</div>
                <div className="vd-user-role">{role}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="vd-content">{renderContent()}</div>
      </main>
    </div>
  );
}
