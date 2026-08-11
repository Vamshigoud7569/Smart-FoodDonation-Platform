// components/Donordashboard_Components/Analytics.tsx
import React from 'react';
import { useEffect, useState } from 'react';
import { CalendarDays, Boxes } from 'lucide-react';
import '../../styles/Analytics.css';
import { Donation } from '../../types/Donation';
import { foodDonationService } from '../../services/foodDonationService';

interface StatusItem {
  label: string;
  count: number;
  color: string;
}

const Analytics: React.FC = () => {
  const [totalDonations, setTotalDonations] = useState<Donation[]>([]);
  const [hourlyTrends, setHourlyTrends] = useState<{ hour: number; count: number }[]>([]);

  const fetchDonations = async () => {
    try {
      const response = await foodDonationService.getMyDonations();
      setTotalDonations(response.data);
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  const fetchHourlyTrends = async () => {
    try {
      const response = await foodDonationService.gethourlyTrends();
      setHourlyTrends(response.data);
    } catch (error) {
      console.error('Error fetching hourly trends:', error);
    }
  };

  useEffect(() => {
    // Fetch analytics data from the backend API here
    fetchDonations();
    fetchHourlyTrends();
  }, []);

  const statuses: StatusItem[] = [
    { label: 'Completed', count: totalDonations.filter(d => d.status.toLowerCase() === 'completed').length, color: '#10B981' },
    { label: 'Pending', count: totalDonations.filter(d => d.status.toLowerCase() === 'active').length, color: '#F59E0B' },
    { label: 'Expired', count: totalDonations.filter(d => d.status.toLowerCase() === 'expired').length, color: '#EF4444' },
  ];

  return (
    <div className="analytics-page-container page-enter">

      {/* Date controls (aligned to top right of the page) */}
      <div className="analytics-toolbar">
        <div className="date-picker">
          <CalendarDays size={16} />
          <span className="date-text">Last 30 Days</span>
        </div>
      </div>

      {/* Top Highlight Card */}
      <div className="highlight-card">
        <div className="highlight-content">
          <div className="icon-box">🍱</div>
          <span className="highlight-title">Community Food Crates</span>
        </div>
        <div className="badge">Top Donation Type</div>
      </div>

      {/* Chart Area */}
      <div className="chart-section">
        <h3 className="chart-title">
          <Boxes size={16} /> Total Contributions: <span className="chart-title-num">{totalDonations.length}</span>
        </h3>
        <div className="svg-chart-container">
          <svg viewBox="0 0 500 150" className="line-chart" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity="0.28" />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,100 Q40,120 100,80 T200,90 T300,50 T400,60 T500,20 L500,150 L0,150 Z" fill="url(#chartGradient)" />
            <path d="M0,100 Q40,120 100,80 T200,90 T300,50 T400,60 T500,20" fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" className="chart-line-path" />
          </svg>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">

        {/* Requirement 1: Status Tracking */}
        <div className="metric-card">
          <h4>Donation Status</h4>
          <div className="status-list">
            {statuses.map((status) => (
              <div className="status-row" key={status.label}>
                <div className="status-label">
                  <span className="status-dot" style={{ backgroundColor: status.color }}></span>
                  {status.label}
                </div>
                <div className="status-count">{status.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Idea: Peak Hours */}
        <div className="metric-card">
          <h4>Peak drop-off hours</h4>
          <div className="peak-hours-list">
            {hourlyTrends
              .slice(0, 3)
              .map((trend) => (
                <div className="peak-row" key={trend.hour}>
                  <span className="time">{new Date(trend.hour * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <div className="pill primary">{trend.count} donations</div>
                </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;