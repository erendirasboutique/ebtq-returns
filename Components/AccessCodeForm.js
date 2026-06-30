'use client';

import { useState } from 'react';

export default function AccessCodeForm({ onVerified }) {
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  async function verifyCode(e) {
    e.preventDefault();
    setBusy(true);
    setMsg('Checking access code...');

    try {
      const res = await fetch('/api/returns/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid access code.');
      }

      setMsg('');
      onVerified(data.returnCode);
    } catch (err) {
      setMsg(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card accessCard">
      <p className="eyebrow">Return Access</p>
      <h2>Enter your return code</h2>
      <p className="muted">
        Use the access code provided by Erendira&apos;s Boutique to start your return request.
      </p>

      {msg && <div className="notice">{msg}</div>}

      <form onSubmit={verifyCode}>
        <label>
          Access Code
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Example: EBTQ-123456"
            required
          />
        </label>

        <button className="btn primary" disabled={busy}>
          {busy ? 'Checking...' : 'Continue'}
        </button>
      </form>
    </section>
  );
}
