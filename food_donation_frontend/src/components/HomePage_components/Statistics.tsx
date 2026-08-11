const stats = [
  { icon: '🍱', num: '15,000+', label: 'Meals Saved' },
  { icon: '👥', num: '3,000+',  label: 'Community Members' },
  { icon: '🏙️', num: '40+',     label: 'Cities Covered' },
  { icon: '🚀', num: '1,200+',  label: 'Deliveries Completed' },
];

function Statistics() {
  return (
    <section id="impact" className="stats-section">
      <div className="container">
        <div className="section-tag">Our Impact</div>
        <h2 className="section-title">Numbers That Tell the Story</h2>
        <p className="section-sub" style={{ color: 'white' ,font: 'bold'}}>Every number represents a real person whose life was touched by your generosity.</p>

        <div className="stats-grid">
          {stats.map(s => (
            <div className="stat-card" key={s.label}>
              <div className="stat-icon">{s.icon}</div>
              <h3>{s.num}</h3>
              <p>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Statistics;
