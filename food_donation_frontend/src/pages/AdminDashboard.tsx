// pages/AdminDashboard.tsx

import { useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import DashboardHome from "../components/Admindashboard_Components/DashboardHome";
import VerificationQueue from "../components/Admindashboard_Components/VerificationQueue";
import ReviewDrawer from "../components/Admindashboard_Components/ReviewDrawer";

import type {  Submission } from "../components/Admindashboard_Components/VerificationModels";

import "../styles/AdminDashboard.css";

import {
  LayoutDashboard,
  ShieldCheck,
  ScrollText,
  LogOut,
} from "lucide-react";

import { foodDonationService } from "../services/foodDonationService";
import AuditLog from "../components/Admindashboard_Components/AuditLog";

const navItems = [
  { key: "dashboard", label: "Dashboard" },
  { key: "verification", label: "Verification" },
  { key: "audit", label: "Audit Log" },
];


const NavIcon = ({ k }: { k: string }) => {
  const icons: Record<string, ReactNode> = {
    dashboard: <LayoutDashboard size={18} />,
    verification: <ShieldCheck size={18} />,
    audit: <ScrollText size={18} />,
    logout: <LogOut size={18} />,
  };

  return (
    <span className="av-nav-icon">
      {icons[k]}
    </span>
  );
};

export default function AdminDashboard() {
  const [active, setActive] = useState<
    "dashboard" | "verification" | "audit"
  >("dashboard");

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  //const [auditLog,setAuditlog] = useState<AuditEntry[]>([])
  const [selected, setSelected] = useState<Submission | null>(null);

  const navigate = useNavigate();

  const name = localStorage.getItem("name") ;
  const role = localStorage.getItem("role") ;

  console.log(localStorage.getItem("token"));
  console.log(localStorage.getItem("userId"));
console.log(localStorage.getItem("email"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const fetchRecords = async () => {
    try {
      const response =
        await foodDonationService.getPendingRecords();

      setSubmissions(response.data);
    } catch (error) {
      console.error("Error getting values", error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const pendingCount = submissions.filter(
    (s) => s.status === "PENDING"
  ).length;

  const titles = {
    dashboard: "Admin Dashboard",
    verification: "Verification Queue",
    audit: "Audit Log",
  };

  const handleDecide = async (
    id:Number,
    status: "VERIFIED" | "REJECTED",
    reason?: string
  ) => {
    
    try {

      const payload = {
      userId: id,
      adminId: Number(localStorage.getItem("userId")),
      status,
      rejectReason: reason,
    };

    console.log("Payload:", payload);

    await foodDonationService.submitAdminStatus(payload);
      

      await fetchRecords();
      setSelected(null);
    } catch (error: any) {
  console.error("Full error:", error);
  console.error("Server response:", error.response?.data);
}
  };

  const renderContent = () => {
    switch (active) {
      case "dashboard":
        return (
          <DashboardHome
              submissions={submissions}
              onOpen={setSelected}
              onNavigate={(key) =>
                setActive(
                  key as "dashboard" | "verification" | "audit"
                )
              }
            />
        );

      case "verification":
        return (
          <VerificationQueue
            submissions={submissions}
            onOpen={setSelected}
          />
        );

      case "audit":
        return (
          <AuditLog 
             submissions={submissions}
            />
        );

      default:
        return (
          <DashboardHome
              submissions={submissions}
              onOpen={setSelected}
              onNavigate={(key) =>
                setActive(
                  key as "dashboard" | "verification" | "audit"
                )
              }
            />
    )}
  };

  return (
    <div className="av-layout">
      {/* Sidebar */}
      <aside className="av-sidebar">
        <div className="av-logo">
          <span className="av-logo-badge">
            <ShieldCheck size={16} />
          </span>
          Food Share
        </div>

        <nav className="av-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`av-nav-item ${
                active === item.key ? "active" : ""
              }`}
              onClick={() =>
                setActive(
                  item.key as
                    | "dashboard"
                    | "verification"
                    | "audit"
                )
              }
            >
              <NavIcon k={item.key} />

              {item.label}

              {item.key === "verification" &&
                pendingCount > 0 && (
                  <span className="av-nav-badge">
                    {pendingCount}
                  </span>
                )}
            </button>
          ))}
        </nav>

        <div className="av-sidebar-footer">
          <button
            className="av-nav-item"
            onClick={handleLogout}
          >
            <NavIcon k="logout" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="av-main">
        <div className="av-topbar">
          <span className="av-topbar-title page-title">
            {titles[active]}
          </span>

          <div className="av-topbar-right">
            <div className="av-user-info">
              <div className="av-avatar">
                {name.charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="av-user-name">
                  {name.toUpperCase()}
                </div>

                <div className="av-user-role">
                  {role}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="av-content">
          {renderContent()}
        </div>
      </main>

      <ReviewDrawer
        submission={selected}
        onClose={() => setSelected(null)}
        onDecide={handleDecide}
      />
    </div>
  );
}