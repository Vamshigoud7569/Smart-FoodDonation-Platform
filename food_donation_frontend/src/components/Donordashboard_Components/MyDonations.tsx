import { useState, useEffect, useMemo } from 'react';
import { foodDonationService } from '../../services/foodDonationService';
import { resolveFoodIcon } from '../../configuration/FoodiconConfig';

import  {Donation}  from '../../types/Donation';
import "../../styles/MyDonations.css";

function MyDonations() {

  const [donations, setDonations] = useState<Donation[]>([]);
  const [activeTab, setActiveTab] = useState('All Donations');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchDonations = async() => {
    setIsLoading(true);
    setHasError(false);
    try {
      await foodDonationService.getMyDonations()
      .then((response) => {
        setDonations(response.data);
      });
    }
    catch(error) {
      console.error('Error fetching donations:', error);
      setHasError(true);
    }
    finally {
      setIsLoading(false);
    }
  };
  useEffect(()=> {
    // Fetch donations from the API
       fetchDonations();
    },[]);

  const tabs = useMemo(() => {
    const delivered = donations.filter(d => d.status.toLowerCase() === 'completed');
    const pending = donations.filter(d => d.status.toLowerCase() === 'active');
    const cancelled = donations.filter(d => d.status.toLowerCase() === 'expired');

    return [
      { label: 'All Donations', count: donations.length },
      { label: 'Delivered', count: delivered.length },
      { label: 'Pending', count: pending.length },
      { label: 'Cancelled', count: cancelled.length }
    ];
  }, [donations]);

  const filteredDonations = donations.filter((donation) => {
  const status = donation.status.toLowerCase();
  if (activeTab === 'Pending') return status === 'active';
  if (activeTab === 'Delivered') return status === 'completed';
  if (activeTab === 'Cancelled') return status  === 'expired';
  return true; // 'All Donations'
});

  return (
    <div className="dashboard-layout">
      {/* Top Navigation */}
     

      {/* Main Content Area */}
      <main className="dashboard-content">
        <div className="card-container">
          
          {/* Tabs Navigation */}
          <div className="tabs-row">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                className={`tab-btn ${activeTab === tab.label ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.label)}
              >
                {tab.label}
                <span className="tab-badge">{tab.count}</span>
              </button>
            ))}
          </div>

          {/* Conditional Rendering for Loading, Error, and Success states */}
          {isLoading ? (
            <div className="loading-view" style={{ textAlign: 'center', marginTop: '40px' }}>
              <p>Loading donations...</p>
            </div>
          ) : hasError ? (
            <div className="error-view">
              <div className="error-icon">
                <span>!</span>
              </div>
              <h2>Something went wrong</h2>
              <button className="retry-btn" onClick={fetchDonations}>
                Retry
              </button>
            </div>
          ) : 
          (
            <div className="donations-grid">

            {filteredDonations.map((donation) => {
              console.log("Backend Type:", donation.foodDescription, "| Matched Icon:", resolveFoodIcon(donation.foodDescription));
              const iconConfig = resolveFoodIcon(donation.foodDescription);

              return (
                <div key={donation.id} className="food-card">

                  {/* Card Header: Icon + Title & Status */}
                  <div className="card-header-block">
                    <div className="food-icon-wrapper">
                      {iconConfig.isImage ? (
                      <img 
                        src={iconConfig.iconPath} 
                        className="food-icon-img"
                      />
                    ) : (
                      iconConfig.iconPath
                    )}
                    </div>
                    <div className="title-section">
                      <h3>{donation.foodDescription}</h3>
                    <span className="food-type-tag">{donation.foodType}</span>
                  </div>
                  <span className={`status-pill ${donation.status.toLowerCase()}`}>
                    {donation.status}
                  </span>
                </div>

                <hr className="card-divider" />

                {/* Card Body: Clean Metadata Grid */}
                <div className="card-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Quantity</span>
                    <span className="detail-value">{donation.foodQuantity}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Pickup Address</span>
                    <span className="detail-value text-truncate">{donation.pickupAddress}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Contact</span>
                    <span className="detail-value">{donation.donorContact}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Listed On</span>
                    <span className="detail-value">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

              </div>
            )})}

          </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default MyDonations;