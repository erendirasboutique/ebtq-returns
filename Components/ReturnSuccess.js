export default function ReturnSuccess({ request }) {
  return (
    <section className="card successCard">
      <div className="successIcon">✓</div>

      <p className="eyebrow">Request Submitted</p>
      <h2>Your return request was received</h2>

      <p className="muted">
        We’ll prepare your return label and update your return status soon.
      </p>

      <div className="summaryBox">
        <b>Reference</b>
        <span>{request?.id || 'Return request created'}</span>

        <b>Status</b>
        <span>{request?.status || 'requested'}</span>

        <b>Tracking</b>
        <span>{request?.original_tracking_number || '—'}</span>
      </div>
    </section>
  );
}
