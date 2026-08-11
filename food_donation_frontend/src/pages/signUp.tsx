import { useState } from 'react';
import { Link } from 'react-router-dom';
import { foodDonationService } from '../services/foodDonationService';
import '../styles/signUp.css';
//import 

const INDIA_LOCATIONS: Record<string, string[]> = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati'],
  'Delhi': ['New Delhi', 'Dwarka', 'Rohini', 'Saket'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Hubli', 'Mangaluru'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
};



const PHONE_REGEX = /^(\+91[6-9]\d{9}|[6-9]\d{9})$/;


export default function SignUp() {

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    address: '', state: '', city: '', role: '', terms: false,
  });

  const[phoneError,setphoneError] = useState('');
  const cities = form.state ? INDIA_LOCATIONS[form.state] ?? [] : [];


  const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>{
        const{id,value,type} = e.target;
        
        if(type === "checkbox")
        {
          const {checked} = e.target as HTMLInputElement;
          setForm({...form, [id]:checked})
          return;
        }
        if(id == "state")
        {
            setForm({
                ...form,
                [id]:value,
                city:""
            });
          return;
        }
        if(id === "phone")
        {
            const cleaned = value.replace(/\s/g,'');
            setForm({
              ...form,
              [id]: cleaned
            })
            setphoneError(
              cleaned && !PHONE_REGEX.test(cleaned) ? "Enter a valid Phone Number": ""
            );
            return;
        }

        setForm({...form,[id]:value})
  };

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) =>{

      e.preventDefault();
      // validate phone number
      if(!PHONE_REGEX.test(form.phone))
      {
          setphoneError("Enter a valid Phone Number");
          return;
      }

      const payload = {
        
    name: form.name,
    email: form.email,
    phone: form.phone,
    password: form.password,
    address: form.address,
    state: form.state,
    city: form.city,
    role: form.role,

      };

      try
      {
          await foodDonationService.registerUser(payload);
          console.log("User registered successfully",payload);
          alert("Registration successful, You can login now");
          setForm({
              name: '', email: '', phone: '', password: '',
              address: '', state: '', city: '', role: '', terms: false,
          })

      }
      catch(error)
      {
          console.error("Error registering user:",error);
      }
  };

  return (
    <div className="auth-page">

      {/* ── Left: Form ── */}
      <div className="auth-left">
        <div className="auth-form-center" style={{ maxWidth: '500px' }}>
          <Link to="/" className="auth-back">← Back to Home</Link>

          <div className="auth-logo">
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
              <defs>
                <linearGradient id="su-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
              <circle cx="20" cy="20" r="20" fill="url(#su-grad)" />
              <path d="M20 10L25 15H22V25H18V15H15L20 10Z" fill="white" />
              <path d="M12 28H28V30H12V28Z" fill="white" />
            </svg>
            <span className="auth-logo-text">Food<span>Share</span></span>
          </div>

          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Join thousands making a difference every day</p>

        <form className="auth-form" onSubmit={handleSubmit}>

          <div className="input-group">
            <label className="input-label">Full Name</label>
            <div className="input-wrap">
              <span className="input-icon">👤</span>
              <input id="name" type="text" className="input-field" placeholder="Enter your full name"
                value={form.name} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div className="input-wrap">
              <span className="input-icon">✉️</span>
              <input id="email" type="email" className="input-field" placeholder="Enter your email"
                value={form.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Phone Number</label>
            <div className="input-wrap">
              <span className="input-icon">📱</span>
              <input id="phone" type="tel" className="input-field" placeholder="XXXXXXXXXX or 10 digits"
                value={form.phone} onChange={handleChange} required maxLength={13} />
            </div>
            <span className="input-hint">Indian numbers only: XXXXXXXXXX or 10 digits starting with 6–9</span>
            {phoneError && <span className="input-error">{phoneError}</span>}
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-wrap">
              <span className="input-icon">🔒</span>
              <input id="password" type="password" className="input-field" placeholder="Min 6 characters"
                value={form.password} onChange={handleChange} required minLength={6} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Address</label>
            <div className="input-wrap">
              <span className="input-icon">📍</span>
              <input id="address" type="text" className="input-field" placeholder="Enter your address"
                value={form.address} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label className="input-label">State</label>
              <select id="state" className="input-field no-icon" value={form.state} onChange={handleChange} required>
                <option value="">Select State</option>
                {Object.keys(INDIA_LOCATIONS).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">City</label>
              <select id="city" className="input-field no-icon" value={form.city} onChange={handleChange}
                required disabled={!form.state}>
                <option value="">{form.state ? 'Select City' : 'Select State first'}</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">I am a</label>
            <select id="role" className="input-field no-icon" value={form.role} onChange={handleChange} required>
              <option value="">Select your role</option>
              <option value="DONOR">🍽️ Donor (Restaurant / Hotel / Individual)</option>
              <option value="NGO">🏠 NGO / Shelter / Individual</option>
              <option value="VOLUNTEER">🚴 Volunteer</option>
            </select>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input id="terms" type="checkbox" checked={form.terms} onChange={handleChange} required />
              <span>I agree to the <a href="#" className="auth-link">Terms &amp; Conditions</a></span>
            </label>
          </div>

          <button type="submit" className="btn-auth">Create Account</button>

          <div className="auth-divider" />

          <p className="auth-switch">
            Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
          </p>

        </form>
        </div>
      </div>

      {/* ── Right: Illustration ── */}
      <div className="auth-right">
        <div className="auth-right-inner">
          <div className="auth-right-tag">🌱 Join the Movement</div>
          <h2>Every Meal<br />Counts</h2>
          <p>Be part of a community that's fighting hunger and food waste across India — one donation at a time.</p>

          <div className="auth-stats">
            <div className="auth-stat">
              <div className="auth-stat-num">15K+</div>
              <div className="auth-stat-label">Meals Saved</div>
            </div>
            <div className="auth-stat">
              <div className="auth-stat-num">40+</div>
              <div className="auth-stat-label">Cities</div>
            </div>
            <div className="auth-stat">
              <div className="auth-stat-num">3K+</div>
              <div className="auth-stat-label">Volunteers</div>
            </div>
          </div>

          <div className="auth-features">
            {[
              { icon: '📡', text: 'Real-time donation tracking' },
              { icon: '✅', text: 'Connect with verified NGOs' },
              { icon: '📊', text: 'Track your personal impact' },
              { icon: '🤝', text: 'Join a community of heroes' },
            ].map(f => (
              <div className="auth-feature" key={f.text}>
                <span className="auth-feature-icon">{f.icon}</span>
                <span className="auth-feature-text">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
