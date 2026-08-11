import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import '../styles/signUp.css';
import { foodDonationService } from '../services/foodDonationService';
import { useNavigate } from 'react-router-dom';


export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) 
  {
    const { id, value, type, checked } = e.target;
    setForm(f => ({ ...f, [id]: type === 'checkbox' ? checked : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // validate form
    const payload = {
      email:form.email,
      password:form.password
    }
    try
    {
      const response = await foodDonationService.loginUser(payload);
      const { token, role, name, userId ,email} = response.data;
      console.log(userId);
      localStorage.setItem('token', token);
      localStorage.setItem('name', name);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);
      localStorage.setItem('email', email);

      if (role === "DONOR") {
        navigate("/donor-dashboard");
      }if (role === "REQUESTER" || role === "NGO") {
        navigate("/recipient-dashboard");
      }
      if (role === "VOLUNTEER") {
        navigate("/volunteer-verify");
      }
      if(role === "ADMIN")
      {
        navigate("/admin-dashboard");
        console.log(token);
      }

    }
    catch(error)
    {
        console.error(error);
        alert(
              error.response?.data?.message ||
              "Invalid Credentials"
            );

    }

    
  }

  return (
    <div className="auth-page">

      {/* ── Left: Form ── */}
      <div className="auth-left">
        <div className="auth-form-center">
          <h1 className="auth-title">Welcome Back!</h1>
          <p className="auth-subtitle">Login to continue to FoodShare</p>

          <form className="auth-form" onSubmit={handleSubmit}>

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input id="email" type="email" className="input-field no-icon"
                placeholder="Enter your email"
                value={form.email} onChange={handleChange} required />
            </div>

            

            <div className="input-group">
              <label className="input-label">Password</label>

              <div className="password-field">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="input-field no-icon"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye />: <FaEyeSlash /> }
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input id="remember" type="checkbox" checked={form.remember} onChange={handleChange} />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="auth-link">Forgot Password?</Link>
            </div>

            <button type="submit" className="btn-auth">Login</button>

            <div className="auth-divider" />

            <p className="auth-switch">
              Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
            </p>

          </form>
        </div>
      </div>

      {/* ── Right: Gradient panel ── */}
      <div className="auth-right">
        <div className="auth-right-inner">
          <h2>Save Food, Serve<br />Humanity</h2>
          <p>Join thousands of food heroes fighting hunger and food waste</p>

          <div className="auth-stats">
            <div className="auth-stat">
              <div className="auth-stat-num">1M+</div>
              <div className="auth-stat-label">Meals Saved</div>
            </div>
            <div className="auth-stat">
              <div className="auth-stat-num">25K+</div>
              <div className="auth-stat-label">Active Users</div>
            </div>
            <div className="auth-stat">
              <div className="auth-stat-num">100+</div>
              <div className="auth-stat-label">Cities</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
