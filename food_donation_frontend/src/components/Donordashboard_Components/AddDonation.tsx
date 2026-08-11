// components/Donordashboard_Components/AddDonation.tsx
import { useState } from 'react';
import { ClipboardList, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { foodDonationService } from '../../services/foodDonationService';

const initialForm = {
  foodDescription: '',
  foodType: '',
  foodQuantity: '',
  pickupAddress: '',
};

export default function AddDonation() {
  const [form, setForm] = useState(initialForm);
  const [msg, setMsg]   = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await foodDonationService.postDonation(form);
      setMsg('success');
      setForm(initialForm);
    } catch {
      setMsg('error');
    }
  };

  return (
    <div className="dd-form-card page-enter">
      <div className="dd-card-header">
        <span className="dd-card-header-icon"><ClipboardList size={18} /></span>
        <span className="dd-card-title">Post a New Donation</span>
      </div>

      {msg === 'success' && (
        <div className="dd-msg-success">
          <CheckCircle2 size={16} /> Donation posted successfully!
        </div>
      )}
      {msg === 'error' && (
        <div className="dd-msg-error">
          <AlertCircle size={16} /> Failed to post donation. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="dd-form-grid">
          <div className="dd-form-group full">
            <label>Food Description</label>
            <textarea name="foodDescription" value={form.foodDescription}
              onChange={handleChange} required rows={3} placeholder="Describe the food items..." />
          </div>
          <div className="dd-form-group">
            <label>Food Type</label>
            <select name="foodType" value={form.foodType} onChange={handleChange} required>
              <option value="">Select type</option>
              <option>Veg</option>
              <option>Non-Veg</option>
              <option>Both</option>
            </select>
          </div>
          <div className="dd-form-group">
            <label>Quantity</label>
            <input name="foodQuantity" value={form.foodQuantity}
              onChange={handleChange} required placeholder="e.g. 10 kg / 50 plates" />
          </div>
          <div className="dd-form-group full">
            <label>Pickup Address</label>
            <input name="pickupAddress" value={form.pickupAddress}
              onChange={handleChange} required placeholder="Full pickup address" />
          </div>
          <button type="submit" className="dd-submit-btn">
            <Send size={16} /> Submit Donation
          </button>
        </div>
      </form>
    </div>
  );
}