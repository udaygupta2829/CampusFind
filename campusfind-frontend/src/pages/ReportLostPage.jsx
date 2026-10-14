import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemService } from '../services/itemService';
import ImageUploader from '../components/ImageUploader';
import { PlusCircle, AlertCircle, ShieldAlert, Lock, CheckCircle } from 'lucide-react';

const ReportLostPage = () => {
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'Electronics',
    colour: '',
    description: '',
    uniqueMarks: '',
    location: '',
    eventDate: new Date().toISOString().split('T')[0],
    contactPreference: 'Campus Portal',
    imageUrls: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const categories = [
    'Electronics',
    'ID Cards / Documents',
    'Bags & Backpacks',
    'Keys',
    'Books & Stationery',
    'Clothing & Accessories',
    'Sports Equipment',
    'Other Belongings'
  ];

  const locations = [
    'Central Library, 1st/2nd Floor',
    'Block A Cafeteria & Food Court',
    'Block B - Computer Science Labs',
    'Block C - Mechanical & Civil Block',
    'Block D - Management Block',
    'Sports Complex & Gym',
    'Main Campus Auditorium',
    'Hostel Grounds / Mess',
    'Parking Area Gate 1 & 2',
    'Administrative Block'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.itemName.trim() || !formData.colour.trim() || !formData.location.trim() || !formData.description.trim()) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await itemService.createReport({
        ...formData,
        type: 'LOST'
      });

      if (res.success && res.data) {
        navigate(`/items/${res.data.id}?created=true`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit lost item report. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '780px', marginTop: '2.5rem', marginBottom: '3.5rem' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem' }}>Report a Lost Item</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Submit details to broadcast across the campus lost & found network
            </p>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid-2" style={{ gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">
                Item Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="itemName"
                className="form-control"
                placeholder="e.g. Apple AirPods Pro 2, Wildcraft Blue Bag"
                value={formData.itemName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Category <span className="required">*</span>
              </label>
              <select
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid-2" style={{ gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">
                Primary Colour <span className="required">*</span>
              </label>
              <input
                type="text"
                name="colour"
                className="form-control"
                placeholder="e.g. Navy Blue, Matte Black, Silver"
                value={formData.colour}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Date Lost <span className="required">*</span>
              </label>
              <input
                type="date"
                name="eventDate"
                className="form-control"
                value={formData.eventDate}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Last Seen / Lost Location <span className="required">*</span>
            </label>
            <input
              type="text"
              name="location"
              className="form-control"
              placeholder="e.g. Central Library 2nd floor desk #14 or select below"
              list="location-options"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <datalist id="location-options">
              {locations.map((loc) => (
                <option key={loc} value={loc} />
              ))}
            </datalist>
          </div>

          <div className="form-group">
            <label className="form-label">
              Public Description <span className="required">*</span>
            </label>
            <textarea
              name="description"
              className="form-control"
              placeholder="General description visible to students: Brand, model, general appearance, where it was kept..."
              value={formData.description}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          {/* Unique Identification Marks (Private) */}
          <div className="form-group" style={{ backgroundColor: '#FEF8E6', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #FDE68A' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <Lock size={16} color="#92400E" />
              <label className="form-label" style={{ margin: 0, color: '#92400E', fontWeight: 700 }}>
                Unique Marks / Private Identifiers (Protected)
              </label>
            </div>
            <textarea
              name="uniqueMarks"
              className="form-control"
              style={{ backgroundColor: '#ffffff' }}
              placeholder="e.g. Specific sticker on back, scratch on bottom left corner, specific keychain, wallpaper description, last 4 digits of document number. (Visible ONLY to you and verifying staff)."
              value={formData.uniqueMarks}
              onChange={handleChange}
              rows={2}
            />
            <div className="form-hint" style={{ color: '#92400E' }}>
              Never made public. Staff will use this to verify any found item matches.
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contact Preference</label>
            <select
              name="contactPreference"
              className="form-control"
              value={formData.contactPreference}
              onChange={handleChange}
            >
              <option value="Campus Portal">Campus Portal In-App Notification (Recommended)</option>
              <option value="Email">Email & Portal</option>
              <option value="Phone">Phone Call & SMS</option>
            </select>
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label className="form-label">Upload Item Photo (Optional)</label>
            <ImageUploader
              onImagesUploaded={(urls) => setFormData({ ...formData, imageUrls: urls })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-gold btn-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner spinner-gold" style={{ width: '18px', height: '18px' }}></div>
                  Publishing Report...
                </>
              ) : (
                <>
                  <PlusCircle size={18} />
                  Submit Lost Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportLostPage;
