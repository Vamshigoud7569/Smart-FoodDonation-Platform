import { useState } from 'react';
import { foodDonationService } from '../../services/foodDonationService';

const initialForm = {
  foodDescription: '',
  foodType: '',
  foodQuantity: '',
  pickupAddress: '',
  donorName: '',
  donorContact: '',
};

export default function DonationForm() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await foodDonationService.postDonation(form);
      setMessage('Donation posted successfully!');
      setForm(initialForm);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to post donation.');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ color: '#241A12', fontWeight: 800 }}>Post a Donation</h2>
      {message && <p style={{ color: message.includes('success') ? '#1E7A44' : '#B23A32', fontWeight: 600 }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={labelCell}>Food Description</td>
              <td style={inputCell}>
                <textarea name="food_description" value={form.foodDescription}
                  onChange={handleChange} required style={inputStyle} rows={2} />
              </td>
            </tr>
            <tr>
              <td style={labelCell}>Food Type</td>
              <td style={inputCell}>
                <select name="food_type" value={form.foodType} onChange={handleChange} required style={inputStyle}>
                  <option value="">Select type</option>
                  <option value="Veg">Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                  <option value="Both">Both</option>
                </select>
              </td>
            </tr>
            <tr>
              <td style={labelCell}>Quantity</td>
              <td style={inputCell}>
                <input name="food_quantity" type="text" value={form.foodQuantity}
                  onChange={handleChange} required style={inputStyle} placeholder="e.g. 10 kg / 50 plates" />
              </td>
            </tr>
            <tr>
              <td style={labelCell}>Pickup Address</td>
              <td style={inputCell}>
                <input name="pickupAddress" type="text" value={form.pickupAddress}
                  onChange={handleChange} required style={inputStyle} placeholder="Enter pickup address" />
              </td>
            </tr>
            <tr>
              <td style={labelCell}>Donor Name</td>
              <td style={inputCell}>
                <input name="donorName" type="text" value={form.donorName}
                  onChange={handleChange} required style={inputStyle} placeholder="Your name" />
              </td>
            </tr>
            <tr>
              <td style={labelCell}>Contact Number</td>
              <td style={inputCell}>
                <input name="donorContact" type="tel" value={form.donorContact}
                  onChange={handleChange} required style={inputStyle} placeholder="10-digit number" />
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{ paddingTop: '16px' }}>
                <button type="submit" style={submitBtn}>Submit Donation</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}

const labelCell: React.CSSProperties = {
  padding: '10px 16px 10px 0',
  fontWeight: 600,
  width: '180px',
  verticalAlign: 'top',
  borderBottom: '1px solid #EEE3CF',
  color: '#6B5D4F',
};

const inputCell: React.CSSProperties = {
  padding: '10px 0',
  borderBottom: '1px solid #EEE3CF',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '12px',
  border: '1px solid #EEE3CF',
  fontSize: '14px',
  boxSizing: 'border-box',
  background: '#FBF6EE',
  color: '#241A12',
};

const submitBtn: React.CSSProperties = {
  padding: '11px 28px',
  backgroundImage: 'linear-gradient(135deg, #E58A0B 0%, #F5B542 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '14px',
  fontSize: '15px',
  fontWeight: 700,
  cursor: 'pointer',
};