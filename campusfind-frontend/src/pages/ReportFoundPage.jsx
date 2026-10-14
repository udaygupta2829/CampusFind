import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemService } from '../services/itemService';
import ImageUploader from '../components/ImageUploader';
import { Package, AlertCircle, Building2 } from 'lucide-react';

const ReportFoundPage = () => {
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'Electronics',
    colour: '',
    description: '',
    location: '',
    eventDate: new Date().toISOString().split('T')[0],
    itemHeldAt: 'Security Office',
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
        type: 'FOUND'
      });

      if (res.success && res.data) {
        navigate(`/items/${res.data.id}?created=true`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit found item report. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '780px', marginTop: '2.5rem', marginBottom: '3.5rem' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
            <Package size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem' }}>Report a Found Item</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Help reconnect a misplaced item with its rightful owner on campus
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
                placeholder="e.g. Set of Keys with Yamaha Keychain, Silver Watch"
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
                placeholder="e.g. Black, White, Gold, Silver"
                value={formData.colour}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Date Found <span className="required">*</span>
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
              Found Location <span className="required">*</span>
            </label>
            <input
              type="text"
              name="location"
              className="form-control"
              placeholder="e.g. Cafeteria Table 7 or select from campus points"
              list="found-location-options"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <datalist id="found-location-options">
              {locations.map((loc) => (
                <option key={loc} value={loc} />
              ))}
            </datalist>
          </div>

          <div className="form-group">
            <label className="form-label">
              Current Physical Custody (Item Held At) <span className="required">*</span>
            </label>
            <select
              name="itemHeldAt"
              className="form-control"
              value={formData.itemHeldAt}
              onChange={handleChange}
              required
            >
              <option value="Security Office">Central Security Desk (Recommended for handover)</option>
              <option value="Admin Office">Academic / Admin Office Counter</option>
              <option value="Department Lab / Reception">Department Lab / Library Reception</option>
              <option value="With Finder (Myself)">With Finder (I am currently holding it)</option>
            </select>
            <div className="form-hint">
              Security offices provide safe storage and biometric ID verification for claims.
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Public Description <span className="required">*</span>
            </label>
            <textarea
              name="description"
              className="form-control"
              placeholder="Describe general appearance. Do NOT include sensitive codes, secret contents, or full ID numbers to allow valid owner verification."
              value={formData.description}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label className="form-label">Upload Found Item Photo (Recommended)</label>
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
                  <Package size={18} />
                  Submit Found Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportFoundPage;
