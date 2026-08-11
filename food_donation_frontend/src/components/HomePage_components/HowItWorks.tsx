const steps = [
  {
    num: '1',
    icon: '📱',
    title: 'Post Donation',
    desc: 'Restaurants, hotels, or households post available food with details like quantity, type, and pickup time through our easy-to-use app.',
  },
  {
    num: '2',
    icon: '🔔',
    title: 'Instant Match',
    desc: 'Nearby NGOs and shelters receive real-time notifications and can accept donations based on their needs and capacity.',
  },
  {
    num: '3',
    icon: '🚚',
    title: 'Quick Pickup',
    desc: 'Verified volunteers pick up the food and deliver it to those in need, with live tracking for complete transparency.',
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="section">
      <div className="container">
        <h2 className="section-title">How It Works</h2>
        <p className="section-sub">Simple, fast, and impactful - in just 3 steps</p>

        <div className="how-cards">
          {steps.map(s => (
            <div className="how-card" key={s.num}>
              <div className="how-num-badge">{s.num}</div>
              <div className="how-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
