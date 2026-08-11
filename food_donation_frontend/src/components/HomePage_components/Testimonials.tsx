const stories = [
  {
    emoji: '🍴',
    quote: 'We donated over 5,000 meals through FoodShare and cut our food wastage by 80%. The platform made it incredibly easy to connect with NGOs.',
    name: 'Rajesh Kumar',
    role: 'Restaurant Owner, Mumbai',
  },
  {
    emoji: '🏠',
    quote: 'Daily food donations from FoodShare help us serve hundreds of people every week. It has completely transformed how our shelter operates.',
    name: 'Priya Sharma',
    role: 'NGO Director, Delhi',
  },
  {
    emoji: '🚴',
    quote: 'The pickup and delivery process is seamless. I volunteer every weekend and it is genuinely the most rewarding thing I do with my time.',
    name: 'Arjun Mehta',
    role: 'Volunteer, Bengaluru',
  },
];

function Testimonials() {
  return (
    <section id="stories" className="testimonials-section">
      <div className="container">
        <div className="section-tag">Impact Stories</div>
        <h2 className="section-title">Voices from Our Community</h2>
        <p className="section-sub">Real stories from donors, NGOs, and volunteers making a difference every single day.</p>

        <div className="testimonial-cards">
          {stories.map(s => (
            <div className="testimonial-card" key={s.name}>
              <div className="stars">★★★★★</div>
              <p>{s.quote}</p>
              <div className="testimonial-author">
                <div className="author-avatar">{s.emoji}</div>
                <div>
                  <div className="author-name">{s.name}</div>
                  <div className="author-role">{s.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
