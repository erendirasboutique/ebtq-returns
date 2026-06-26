"use client";

import { useEffect, useState } from "react";

const content = {
  en: {
    navPill: "Returns",
    eyebrow: "Erendira's Boutique",
    title: "Start a return request.",
    subtitle: "Fill out the form below and our team will review your request. A return label is not automatically created until your return is approved.",
    formTitle: "Return request",
    formSubtitle: "Please enter your order details.",
    name: "Full name",
    email: "Email address",
    orderNumber: "Order number",
    trackingNumber: "Tracking number",
    reason: "Reason for return",
    details: "More details",
    photos: "Upload photos",
    namePlaceholder: "Enter your full name",
    emailPlaceholder: "you@example.com",
    orderPlaceholder: "Example: EB-1047",
    trackingPlaceholder: "Enter your tracking number",
    reasonPlaceholder: "Select a reason",
    detailsPlaceholder: "Tell us what happened or what you would like help with.",
    submit: "Submit return request",
    submitting: "Submitting...",
    successTitle: "Return request submitted!",
    successText: "Thank you. Our team will review your request and contact you by email.",
    errorTitle: "Something went wrong.",
    errorText: "Please try again or contact us directly.",
    noteTitle: "Return label note",
    noteText: "This form does not automatically generate a paid return label. Your request will be reviewed first.",
    reasons: ["Item does not fit", "Wrong item received", "Item arrived damaged", "Changed my mind", "Other"],
    footer: "Thank you for shopping with Erendira's Boutique."
  },
  es: {
    navPill: "Devoluciones",
    eyebrow: "Erendira's Boutique",
    title: "Inicia una solicitud de devolución.",
    subtitle: "Completa el formulario y nuestro equipo revisará tu solicitud. La etiqueta de devolución no se crea automáticamente hasta que tu devolución sea aprobada.",
    formTitle: "Solicitud de devolución",
    formSubtitle: "Ingresa los detalles de tu pedido.",
    name: "Nombre completo",
    email: "Correo electrónico",
    orderNumber: "Número de pedido",
    trackingNumber: "Número de rastreo",
    reason: "Razón de devolución",
    details: "Más detalles",
    photos: "Subir fotos",
    namePlaceholder: "Ingresa tu nombre completo",
    emailPlaceholder: "tu@email.com",
    orderPlaceholder: "Ejemplo: EB-1047",
    trackingPlaceholder: "Ingresa tu número de rastreo",
    reasonPlaceholder: "Selecciona una razón",
    detailsPlaceholder: "Cuéntanos qué pasó o cómo podemos ayudarte.",
    submit: "Enviar solicitud",
    submitting: "Enviando...",
    successTitle: "¡Solicitud enviada!",
    successText: "Gracias. Nuestro equipo revisará tu solicitud y te contactará por correo electrónico.",
    errorTitle: "Algo salió mal.",
    errorText: "Intenta de nuevo o contáctanos directamente.",
    noteTitle: "Nota sobre la etiqueta",
    noteText: "Este formulario no genera automáticamente una etiqueta de devolución pagada. Primero revisaremos tu solicitud.",
    reasons: ["La prenda no me quedó", "Recibí el artículo incorrecto", "El artículo llegó dañado", "Cambié de opinión", "Otro"],
    footer: "Gracias por comprar en Erendira's Boutique."
  }
};

export default function ReturnsPage() {
  const [language, setLanguage] = useState("en");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const t = content[language];

  useEffect(() => {
    const saved = window.localStorage.getItem("erendirasReturnsLanguage");
    if (saved === "en" || saved === "es") {
      setLanguage(saved);
      document.documentElement.lang = saved;
      return;
    }

    if ((navigator.language || "").toLowerCase().startsWith("es")) {
      setLanguage("es");
      document.documentElement.lang = "es";
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("erendirasReturnsLanguage", language);
  }, [language]);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    formData.set("language", language);

    try {
      const response = await fetch("/api/return-request", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Request failed");

      setStatus("success");
      setMessage(t.successText);
      event.currentTarget.reset();
    } catch {
      setStatus("error");
      setMessage(t.errorText);
    }
    <a
  href="/return-instructions.pdf"
  target="_blank"
  rel="noopener noreferrer"
>
  📄 Return Instructions

    <a
  href="/return-instructions.pdf"
  target="_blank"
  rel="noopener noreferrer"
>
  📄 Return Packet
</a>
</a>
  }

  return (
    <main className="page">
      <div className="decorFlower flowerOne">✿</div>
      <div className="decorFlower flowerTwo">✿</div>
      <div className="decorFlower flowerThree">✿</div>
      <div className="decorFlower flowerFour">✿</div>

      <header className="nav">
        <a className="brand" href="/">
          <img src="/logo.png" alt="Erendira's Boutique" />
        </a>

        <div className="navActions">
          <label className="languageToggle">
            <span>🌐</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </label>
          <span className="navPill">{t.navPill}</span>
        </div>
      </header>

      <section className="hero">
        <div className="heroText">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="subtext">{t.subtitle}</p>

          <div className="noticeCard">
            <span>🏷️</span>
            <div>
              <strong>{t.noteTitle}</strong>
              <p>{t.noteText}</p>
            </div>
          </div>
        </div>

        <form className="returnCard" onSubmit={handleSubmit}>
          <div className="cardHeader">
            <div>
              <p className="eyebrow smallEye">{t.formTitle}</p>
              <h2>{t.formSubtitle}</h2>
            </div>
            <span className="flower">✿</span>
          </div>

          <label>{t.name}</label>
          <input name="name" required placeholder={t.namePlaceholder} />

          <label>{t.email}</label>
          <input name="email" type="email" required placeholder={t.emailPlaceholder} />

          <label>{t.orderNumber}</label>
          <input name="orderNumber" required placeholder={t.orderPlaceholder} />

          <label>{t.trackingNumber}</label>
          <input name="trackingNumber" placeholder={t.trackingPlaceholder} />

          <label>{t.reason}</label>
          <select name="reason" required defaultValue="">
            <option value="" disabled>{t.reasonPlaceholder}</option>
            {t.reasons.map((reason) => (
              <option key={reason} value={reason}>{reason}</option>
            ))}
          </select>

          <label>{t.details}</label>
          <textarea name="details" rows="5" required placeholder={t.detailsPlaceholder} />

          <label>{t.photos}</label>
          <input name="photos" type="file" accept="image/*" multiple />

          <button disabled={status === "loading"}>
            {status === "loading" ? t.submitting : t.submit}
          </button>

          {status === "success" && (
            <div className="message success">
              <strong>{t.successTitle}</strong>
              <p>{message}</p>
            </div>
          )}

          {status === "error" && (
            <div className="message error">
              <strong>{t.errorTitle}</strong>
              <p>{message}</p>
            </div>
          )}
        </form>
      </section>

      <footer>
        <img src="/logo.png" alt="Erendira's Boutique" />
        <p>{t.footer}</p>
      </footer>

      <style jsx>{`
        .page { min-height: 100vh; padding: 24px; font-family: var(--font-body), Arial, sans-serif; position: relative; overflow-x: hidden; }
        .nav { max-width: 1120px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; gap: 18px; }
        .brand img { width: min(310px, 62vw); height: auto; display: block; }
        .navActions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .languageToggle { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,.6); border: 1px solid var(--border); border-radius: 999px; padding: 6px 12px; box-shadow: 0 8px 20px rgba(111,153,64,.08); margin: 0; }
        .languageToggle select { width: auto; border: 0; outline: 0; background: transparent; color: var(--green-dark); font-size: 14px; font-weight: 900; padding: 4px 2px; cursor: pointer; }
        .navPill { border: 1px solid var(--border); background: rgba(255,255,255,.55); color: var(--green-dark); padding: 10px 16px; border-radius: 999px; font-weight: 800; box-shadow: 0 8px 20px rgba(111,153,64,.08); }
        .hero { max-width: 1120px; margin: 54px auto 28px; display: grid; grid-template-columns: 1fr 1fr; gap: 44px; align-items: start; }
        .eyebrow { margin: 0; color: var(--green); text-transform: uppercase; letter-spacing: .15em; font-size: 12px; font-weight: 900; }
        h1, h2 { font-family: var(--font-heading), Georgia, serif; font-weight: 400; }
        h1 { font-size: clamp(46px, 7vw, 76px); line-height: 1.02; margin: 12px 0 18px; color: var(--text); }
        h2 { font-size: 34px; margin: 6px 0 0; line-height: 1.08; }
        .subtext { font-size: 19px; line-height: 1.7; color: var(--brown); max-width: 610px; }
        .noticeCard, .returnCard { background: rgba(255,255,255,.78); backdrop-filter: blur(16px); border: 1px solid var(--border); border-radius: 30px; padding: 26px; box-shadow: 0 26px 70px rgba(111,153,64,.16); }
        .noticeCard { margin-top: 28px; display: flex; gap: 16px; align-items: flex-start; }
        .noticeCard span { font-size: 30px; }
        .noticeCard p { color: var(--brown); margin: 6px 0 0; line-height: 1.5; }
        .cardHeader { display: flex; justify-content: space-between; align-items: flex-start; gap: 18px; }
        .flower { color: var(--purple); font-size: 30px; line-height: 1; }
        label { display: block; margin: 18px 0 8px; font-weight: 900; color: var(--text); }
        input, select, textarea { width: 100%; padding: 15px 16px; border: 1px solid #e6d4c8; border-radius: 16px; font-size: 16px; background: #fffdfb; color: var(--text); }
        textarea { resize: vertical; }
        input:focus, select:focus, textarea:focus { outline: 3px solid rgba(111,153,64,.22); border-color: var(--green); }
        button { width: 100%; margin-top: 20px; border: 0; border-radius: 18px; background: var(--green); color: white; padding: 16px; font-size: 16px; font-weight: 900; cursor: pointer; box-shadow: 0 14px 28px rgba(111,153,64,.28); }
        button:disabled { opacity: .55; cursor: not-allowed; }
        .message { margin-top: 18px; border-radius: 18px; padding: 16px; line-height: 1.5; }
        .message p { margin: 6px 0 0; }
        .success { background: rgba(111,153,64,.14); border: 1px solid rgba(111,153,64,.2); color: var(--green-dark); }
        .error { background: rgba(185,28,28,.08); border: 1px solid rgba(185,28,28,.18); color: #991b1b; }
        footer { max-width: 1120px; margin: 50px auto 12px; padding: 20px 0; text-align: center; color: var(--brown); }
        footer img { width: 190px; max-width: 70vw; display: block; margin: 0 auto 8px; }
        .decorFlower { position: fixed; z-index: 0; color: var(--purple); opacity: .22; pointer-events: none; user-select: none; filter: drop-shadow(0 8px 12px rgba(155,79,216,.14)); }
        .flowerOne { top: 138px; left: 5vw; font-size: 34px; transform: rotate(-18deg); }
        .flowerTwo { top: 220px; right: 8vw; font-size: 28px; color: var(--lavender); transform: rotate(16deg); }
        .flowerThree { bottom: 125px; left: 9vw; font-size: 26px; transform: rotate(14deg); }
        .flowerFour { bottom: 175px; right: 12vw; font-size: 38px; transform: rotate(-10deg); }
        .nav, .hero, footer { position: relative; z-index: 1; }
        @media (max-width: 820px) {
          .page { padding: 18px; }
          .nav { align-items: flex-start; gap: 12px; flex-direction: column; }
          .navActions { width: 100%; justify-content: space-between; }
          .hero { grid-template-columns: 1fr; margin-top: 36px; }
        }
      `}</style>
    </main>
  );
}
