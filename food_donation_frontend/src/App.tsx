import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/HomePage';
import SignUp from './pages/signUp';
import Login from './pages/Login';
import DonorDashboard from './pages/DonorDashboard';
import AddDonation from './components/Donordashboard_Components/AddDonation';
import AdminDashboard from './pages/AdminDashboard';
import RecipientDashboard from './pages/RecipientDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import VolunteerVerify from './pages/VolunteerVerify';
import { foodDonationService } from './services/foodDonationService';
import { useEffect, useState, type ReactNode } from 'react';

// Guard: only lets VERIFIED volunteers reach the dashboard
function VolunteerGuard({ children }: { children: ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'VOLUNTEER') { setChecking(false); return; }
    foodDonationService.getMyVerification()
      .then(({ data }) => setVerified(data.status === 'VERIFIED'))
      .catch(() => setVerified(false))
      .finally(() => setChecking(false));
  }, []);

  if (checking) return null;
  return verified ? <>{children}</> : <Navigate to="/volunteer-verify" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/donor-dashboard" element={<DonorDashboard />} />
      <Route path="/add" element={<AddDonation />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/recipient-dashboard" element={<RecipientDashboard />} />
      <Route path="/volunteer-verify" element={<VolunteerVerify />} />
      <Route path="/volunteer-dashboard" element={
        <VolunteerGuard>
          <VolunteerDashboard />
        </VolunteerGuard>
      } />
    </Routes>
  );
}

export default App;
