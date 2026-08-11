import { Link } from 'react-router-dom';

function CTASection() {
  return (
    <section className="cta-section">
      <div className="container cta-inner">
        <h2 className="cta-title">Ready to Make a Difference?</h2>
        <p className="cta-sub">
          Join thousands of food heroes fighting hunger and food waste. Every meal counts, every action matters.
        </p>
        <div className="cta-buttons">
          <Link to="/signup" className="cta-btn cta-btn-green">Join as Donor</Link>
          <Link to="/signup" className="cta-btn cta-btn-orange">Join as NGO</Link>
          <Link to="/signup" className="cta-btn cta-btn-outline">Become a Volunteer</Link>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
