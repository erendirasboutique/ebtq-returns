"use client";

import { useEffect, useState } from "react";

const text = {
  en: {
    title: "Create your return label.",
    subtitle:
      "Enter your return information below. If everything is correct, your prepaid return label will be created instantly.",
    warning:
      "Only create a return label if your return follows Erendira's Boutique return policy.",
    language: "Language",
    name: "Full name",
    email: "Email",
    phone: "Phone number",
    orderNumber: "Order number",
    trackingNumber: "Original tracking number",
    carrier: "Carrier",
    address: "Street address",
    apartment: "Apartment, suite, etc. optional",
    city: "City",
    state: "State",
    zip: "ZIP code",
    weight: "Package weight in pounds",
    reason: "Reason for return",
    details: "More details",
    policy:
      "I understand this return must follow Erendira's Boutique return policy.",
    submit: "Create return label",
    loading: "Creating label...",
    success: "Your return label is ready!",
    download: "Download return label",
    track: "Track return",
    error: "We could not create your return label.",
    reasons: [
      "Item does not fit",
      "Wrong item received",
      "Item arrived damaged",
      "Changed my mind",
      "Other"
    ]
  },
  es: {
    title: "Crea tu etiqueta de devolución.",
    subtitle:
      "Ingresa la información de tu devolución. Si todo está correcto, tu etiqueta prepagada se creará al instante.",
    warning:
      "Solo crea una etiqueta si tu devolución sigue la política de Erendira's Boutique.",
    language: "Idioma",
    name: "Nombre completo",
    email: "Correo electrónico",
    phone: "Número de teléfono",
    orderNumber: "Número de pedido",
    trackingNumber: "Número de rastreo original",
    carrier: "Transportista",
    address: "Dirección",
    apartment: "Apartamento, suite, etc. opcional",
    city: "Ciudad",
    state: "Estado",
    zip: "Código postal",
    weight: "Peso del paquete en libras",
    reason: "Razón de devolución",
    details: "Más detalles",
    policy:
      "Entiendo que esta devolución debe seguir la política de Erendira's Boutique.",
    submit: "Crear etiqueta de devolución",
    loading: "Creando etiqueta...",
    success: "¡Tu etiqueta de devolución está lista!",
    download: "Descargar etiqueta",
    track: "Rastrear devolución",
    error: "No pudimos crear tu etiqueta de devolución.",
    reasons: [
      "La prenda no me quedó",
      "Recibí el artículo incorrecto",
      "El artículo llegó dañado",
      "Cambié de opinión",
      "Otro"
    ]
  }
};

export default function ReturnsPage() {
  const [language, setLanguage] = useState("en");
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const t = text[language];

  useEffect(() => {
    const saved = localStorage.getItem("returnsLanguage");
    if (saved === "en" || saved === "es") {
      setLanguage(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem("returnsLanguage", language);
  }, [language]);

  async function handleSubmit(event) {
  event.preventDefault();

  setStatus("loading");
  setResult(null);
  setError("");

  const form = event.target.closest("form");

  if (!form) {
    setStatus("error");
    setError("The return form could not be found. Please refresh and try again.");
    return;
  }

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  payload.returnPolicyAccepted =
    formData.get("returnPolicyAccepted") === "on";

  try {
    const response = await fetch("/api/return-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(data.message || "Return label failed.");
    }

    setResult(data);
    setStatus("success");
    form.reset();
  } catch (err) {
    setError(err.message || "Something went wrong.");
    setStatus("error");
  }
}

  return (
    <main className="page">
      <div className="flower flowerOne">✿</div>
      <div className="flower flowerTwo">✿</div>
      <div className="flower flowerThree">✿</div>

      <header className="nav">
        <a href="/" className="logo">
          <img src="/logo.png" alt="Erendira's Boutique" />
        </a>

        <label className="language">
          <span>🌐</span>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </label>
      </header>

      <section className="hero">
        <div className="intro">
          <p className="eyebrow">Erendira&apos;s Boutique</p>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>

          <div className="warning">
            <strong>Important</strong>
            <p>{t.warning}</p>
          </div>
        </div>

        <form className="card" onSubmit={handleSubmit}>
          <label>{t.name}</label>
          <input name="name" required />

          <label>{t.email}</label>
          <input name="email" type="email" required />

          <label>{t.phone}</label>
          <input name="phone" required />

          <div className="two">
            <div>
              <label>{t.orderNumber}</label>
              <input name="orderNumber" required />
            </div>

            <div>
              <label>{t.trackingNumber}</label>
              <input name="trackingNumber" required />
            </div>
          </div>

          <label>{t.carrier}</label>
          <select name="carrier" required defaultValue="usps">
            <option value="usps">USPS</option>
            <option value="ups">UPS</option>
            <option value="fedex">FedEx</option>
          </select>

          <label>{t.address}</label>
          <input name="street1" required />

          <label>{t.apartment}</label>
          <input name="street2" />

          <div className="three">
            <div>
              <label>{t.city}</label>
              <input name="city" required />
            </div>

            <div>
              <label>{t.state}</label>
              <input name="state" required maxLength="2" />
            </div>

            <div>
              <label>{t.zip}</label>
              <input name="zip" required />
            </div>
          </div>

          <input type="hidden" name="country" value="US" />

          <label>{t.weight}</label>
          <input
            name="weight"
            type="number"
            min="0.1"
            step="0.1"
            defaultValue="1"
            required
          />

          <input type="hidden" name="length" value="10" />
          <input type="hidden" name="width" value="8" />
          <input type="hidden" name="height" value="2" />

          <label>{t.reason}</label>
          <select name="reason" required defaultValue="">
            <option value="" disabled>
              Select
            </option>
            {t.reasons.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>

          <label>{t.details}</label>
          <textarea name="details" rows="4" />

          <label className="checkbox">
            <input type="checkbox" name="returnPolicyAccepted" required />
            <span>{t.policy}</span>
          </label>

          <button disabled={status === "loading"}>
            {status === "loading" ? t.loading : t.submit}
          </button>

          {status === "error" && (
            <div className="message error">
              <strong>{t.error}</strong>
              <p>{error}</p>
            </div>
          )}

          {status === "success" && result && (
            <div className="message success">
              <strong>{t.success}</strong>

              <p>
                Return tracking:{" "}
                <strong>{result.returnTrackingNumber || "Not available"}</strong>
              </p>

              <div className="actions">
                {result.labelUrl && (
                  <a
                    href={result.labelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.download}
                  </a>
                )}

                {result.trackingUrlProvider && (
                  <a
                    href={result.trackingUrlProvider}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.track}
                  </a>
                )}
              </div>
            </div>
          )}
        </form>
      </section>

      <style jsx>{`
        .page {
          min-height: 100vh;
          padding: 24px;
          background: #fff4eb;
          color: #2f261f;
          position: relative;
          overflow-x: hidden;
        }

        .nav {
          max-width: 1120px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .logo img {
          width: min(310px, 62vw);
          height: auto;
          display: block;
        }

        .language {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(111, 153, 64, 0.18);
          border-radius: 999px;
          padding: 8px 12px;
        }

        .language select {
          border: 0;
          background: transparent;
          color: #4f742a;
          font-weight: 900;
        }

        .hero {
          max-width: 1120px;
          margin: 54px auto;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 44px;
          align-items: start;
          position: relative;
          z-index: 1;
        }

        .eyebrow {
          margin: 0;
          color: #6f9940;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-size: 12px;
          font-weight: 900;
        }

        h1 {
          font-size: clamp(46px, 7vw, 78px);
          line-height: 1.02;
          margin: 12px 0 18px;
        }

        .intro p {
          font-size: 19px;
          line-height: 1.7;
          color: #6b5648;
        }

        .warning,
        .card {
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(111, 153, 64, 0.18);
          border-radius: 30px;
          padding: 26px;
          box-shadow: 0 26px 70px rgba(111, 153, 64, 0.16);
        }

        .warning {
          margin-top: 26px;
        }

        .warning p {
          margin-bottom: 0;
        }

        label {
          display: block;
          margin: 16px 0 8px;
          font-weight: 900;
        }

        input,
        select,
        textarea {
          width: 100%;
          border: 1px solid #e6d4c8;
          border-radius: 16px;
          padding: 14px 15px;
          font-size: 16px;
          background: #fffdfb;
        }

        textarea {
          resize: vertical;
        }

        .two {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .three {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .checkbox {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: #6b5648;
          line-height: 1.4;
        }

        .checkbox input {
          width: auto;
          margin-top: 3px;
        }

        button {
          width: 100%;
          margin-top: 18px;
          border: 0;
          border-radius: 18px;
          background: #6f9940;
          color: white;
          padding: 16px;
          font-size: 16px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 14px 28px rgba(111, 153, 64, 0.28);
        }

        button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .message {
          margin-top: 18px;
          border-radius: 18px;
          padding: 16px;
          line-height: 1.5;
        }

        .message p {
          margin: 8px 0;
        }

        .success {
          background: rgba(111, 153, 64, 0.14);
          border: 1px solid rgba(111, 153, 64, 0.2);
          color: #4f742a;
        }

        .error {
          background: rgba(185, 28, 28, 0.08);
          border: 1px solid rgba(185, 28, 28, 0.18);
          color: #991b1b;
        }

        .actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 12px;
        }

        .actions a {
          display: inline-block;
          background: #6f9940;
          color: white;
          padding: 12px 16px;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 900;
        }

        .flower {
          position: fixed;
          color: #9b4fd8;
          opacity: 0.22;
          pointer-events: none;
          user-select: none;
        }

        .flowerOne {
          top: 138px;
          left: 5vw;
          font-size: 34px;
          transform: rotate(-18deg);
        }

        .flowerTwo {
          top: 220px;
          right: 8vw;
          font-size: 28px;
        }

        .flowerThree {
          bottom: 125px;
          left: 9vw;
          font-size: 26px;
        }

        @media (max-width: 820px) {
          .page {
            padding: 18px;
          }

          .nav {
            flex-direction: column;
            align-items: flex-start;
          }

          .hero {
            grid-template-columns: 1fr;
            margin-top: 36px;
          }

          .two,
          .three {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
