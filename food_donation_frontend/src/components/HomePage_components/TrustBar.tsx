const items = [
  { icon: '🔒', text: 'Verified NGOs only' },
  { icon: '⚡', text: 'Real-time matching' },
  { icon: '🌍', text: '40+ cities covered' },
  { icon: '🤝', text: '3,000+ active volunteers' },
  { icon: '🍱', text: '15,000+ meals saved' },
];

function TrustBar() {
  return (
    <div className="trust-bar">
      <div className="container">
        <div className="trust-bar-inner">
          {items.map(i => (
            <div className="trust-item" key={i.text}>
              <span>{i.icon}</span>
              <span>{i.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrustBar;
