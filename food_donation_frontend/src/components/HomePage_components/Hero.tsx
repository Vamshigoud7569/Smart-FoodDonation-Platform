import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="hero">
      <div className="container hero-content">

        <div className="hero-left">
          <div className="hero-badge">⭐ Trusted by 3,000+ food heroes across India</div>

          <h1>
            Save Food.<br />
            Feed <span className="highlight">People.</span><br />
            Change Lives.
          </h1>

          <p>
            Connect restaurants, households, NGOs and volunteers
            through one smart platform — turning surplus into sustenance.
          </p>

          <div className="hero-buttons">
            <Link to="/signup" className="btn btn-primary">🍱 Start Donating</Link>
            <a href="#how-it-works" className="btn btn-outline">See How It Works</a>
          </div>

          <div className="hero-stats">
            <div>
              <div className="hero-stat-num">15K+</div>
              <div className="hero-stat-label">Meals Saved</div>
            </div>
            <div>
              <div className="hero-stat-num">40+</div>
              <div className="hero-stat-label">Cities</div>
            </div>
            <div>
              <div className="hero-stat-num">3K+</div>
              <div className="hero-stat-label">Volunteers</div>
            </div>
            <div>
              <div className="hero-stat-num">98%</div>
              <div className="hero-stat-label">Success Rate</div>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-badge-float top">
            <div className="dot-pulse"></div>
            <span>Live donations active now</span>
          </div>

          <div className="hero-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&q=80"
              alt="Food Donation"
            />
            <div className="hero-img-overlay"></div>
          </div>

          <div className="hero-badge-float bottom">
            <span>🎉</span>
            <span>1,200+ deliveries completed</span>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;
