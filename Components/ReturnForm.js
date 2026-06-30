'use client';

import { useState } from 'react';

export default function ReturnForm({ returnCode, onSubmitted }) {
  const [form, setForm] = useState({
    customer_name: returnCode?.customer_name || '',
    customer_email: returnCode?.customer_email || '',
    customer_phone: '',
    original_order_id: returnCode?.original_order_id || '',
    original_tracking_number: returnCode?.original_tracking_number || '',
    reason: '',
    comments: ''
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
      const res = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          access_code: returnCode?.code
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Could not submit return request.');
      }

      onSubmitted(data.returnRequest);
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

      {msg && <div className="notice">{msg}</div>}

      <form onSubmit={submitReturn} className="formGrid">
        <label>
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

        <label>
          Order Number
          <input value={form.original_order_id} onChange={e => set('original_order_id', e.target.value)} />
        </label>

        <label>
          Original Tracking Number
          <input value={form.original_tracking_number} onChange={e => set('original_tracking_number', e.target.value)} />
        </label>

        <label>
          Return Reason
          <select value={form.reason} onChange={e => set('reason', e.target.value)} required>
            <option value="">Select a reason</option>
            <option value="Does not fit">Does not fit</option>
            <option value="Wrong item">Wrong item</option>
            <option value="Damaged">Damaged</option>
            <option value="Defective">Defective</option>
            <option value="Changed mind">Changed mind</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label className="wide">
          Comments
          <textarea
            rows="4"
            value={form.comments}
            onChange={e => set('comments', e.target.value)}
            placeholder="Add any extra details..."
          />
        </label>

        <button className="btn primary wide" disabled={busy}>
          {busy ? 'Submitting...' : 'Submit Return Request'}
        </button>
      </form>
    </section>
  );
}
