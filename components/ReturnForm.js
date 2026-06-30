'use client';

import { useState } from 'react';

export default function ReturnForm({ returnCode, onSubmitted, onBack }) {
  const [form, setForm] = useState({
    access_code: returnCode?.code || '',
    customer_name: returnCode?.customer_name || '',
    customer_email: returnCode?.customer_email || '',
    customer_phone: returnCode?.customer_phone || '',
    original_tracking_number: returnCode?.original_tracking_number || '',
    reason: '',
    comments: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: 'CA',
    zip: '',
    country: 'US',
    parcel_length: 13,
    parcel_width: 10,
    parcel_height: 10,
    parcel_weight_lb: 1,
    parcel_weight_oz: 0
  });

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  function set(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function submitReturn(e) {
    e.preventDefault();
    setBusy(true);
    setMsg('Submitting return request...');

    try {
      const res = await fetch('/api/return-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not submit return request.');

      onSubmitted(data.request);
    } catch (err) {
      setMsg(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card returnForm">
      <p className="eyebrow">Return Request</p>
      <h2>Tell us about your return</h2>
      <p className="muted">Complete the details below so we can prepare your return label.</p>

      <div className="summary">
        <b>Access code accepted:</b> {form.access_code}<br />
        <span className="muted">After submitting, your request will appear in our Shipping Studio for label creation.</span>
      </div>

      {msg && <div className={`notice ${msg.toLowerCase().includes('could') ? 'error' : ''}`}>{msg}</div>}

      <form onSubmit={submitReturn} className="form">
        <div className="grid">
          <label className="wide">
            Name
            <input value={form.customer_name} onChange={e => set('customer_name', e.target.value)} required />
          </label>

          <label>
            Email
            <input type="email" value={form.customer_email} onChange={e => set('customer_email', e.target.value)} required />
          </label>

          <label>
            Phone
            <input value={form.customer_phone} onChange={e => set('customer_phone', e.target.value)} />
          </label>

          <label className="wide">
            Original Tracking Number
            <input value={form.original_tracking_number} onChange={e => set('original_tracking_number', e.target.value)} />
          </label>

          <label className="wide">
            Return Reason
            <select value={form.reason} onChange={e => set('reason', e.target.value)} required>
              <option value="">Choose a reason</option>
              <option value="Wrong size">Wrong size</option>
              <option value="Does not fit">Does not fit</option>
              <option value="Damaged item">Damaged item</option>
              <option value="Wrong item received">Wrong item received</option>
              <option value="Changed mind">Changed mind</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label className="wide">
            Comments
            <textarea value={form.comments} onChange={e => set('comments', e.target.value)} rows="3" placeholder="Add any extra details..." />
          </label>

          <label className="wide">
            Return Address 1
            <input value={form.address_line1} onChange={e => set('address_line1', e.target.value)} required />
          </label>

          <label className="wide">
            Address 2
            <input value={form.address_line2} onChange={e => set('address_line2', e.target.value)} />
          </label>

          <label>
            City
            <input value={form.city} onChange={e => set('city', e.target.value)} required />
          </label>

          <label>
            State
            <input value={form.state} onChange={e => set('state', e.target.value)} required />
          </label>

          <label>
            ZIP
            <input value={form.zip} onChange={e => set('zip', e.target.value)} required />
          </label>

          <label>
            Country
            <input value={form.country} onChange={e => set('country', e.target.value)} />
          </label>

          <label>
            Weight lb
            <input type="number" value={form.parcel_weight_lb} onChange={e => set('parcel_weight_lb', e.target.value)} />
          </label>

          <label>
            Weight oz
            <input type="number" value={form.parcel_weight_oz} onChange={e => set('parcel_weight_oz', e.target.value)} />
          </label>
        </div>

        <div className="actions">
          <button className="primary" disabled={busy}>{busy ? 'Submitting...' : 'Submit Return Request'}</button>
          <button className="btn" type="button" onClick={onBack}>Back</button>
        </div>
      </form>
    </section>
  );
}
