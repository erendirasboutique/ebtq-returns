export default function ReturnSuccess({ request, onReset }) {
  return (
    <section className="card successCard">
      <div className="successIcon">✓</div>
      <p className="eyebrow">Request Submitted</p>
      <h2>Return Request Sent</h2>
      <p className="muted">Thank you. Erendira&apos;s Boutique will create your return label soon.</p>

      <div className="summaryBox summary">
        <b>Status:</b> {request?.status || 'requested'}<br />
        <b>Access Code:</b> {request?.access_code || '—'}<br />
        <b>Tracking:</b> {request?.original_tracking_number || '—'}
      </div>

      <button className="green" type="button" onClick={onReset}>Start Another Return</button>
    </section>
  );
}
