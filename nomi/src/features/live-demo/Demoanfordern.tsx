import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { tokens } from "../../styles/tokens";

type FormState = {
  vorname: string;
  nachname: string;
  unternehmen: string;
  email: string;
  telefon: string;
  challenge: string;
  datenschutz: boolean;
  website?: string; // Honeypot gegen Bots
};

export default function Demoanfordern() {
  const [form, setForm] = useState<FormState>({
    vorname: "",
    nachname: "",
    unternehmen: "",
    email: "",
    telefon: "",
    challenge: "",
    datenschutz: false,
    website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const required = useMemo(
    () => ["vorname", "nachname", "email", "datenschutz"] as const,
    []
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function validate(f: FormState) {
    const next: Record<string, string> = {};
    for (const key of required) {
      if (key !== "datenschutz" && !f[key].trim()) {
        next[key] = "Pflichtfeld";
      }
    }
    if (!f.datenschutz) next.datenschutz = "Bitte zustimmen";
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) {
      next.email = "Ungültige E-Mail";
    }
    if (f.website && f.website.trim().length > 0) {
      next.website = "Bot erkannt";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate(form)) return;
    setIsSubmitting(true);
    try {
      // TODO: hier echten Submit einbauen (API-Call / E-Mail / CRM)
      await new Promise((r) => setTimeout(r, 900));
      setSuccess(true);
      setForm({
        vorname: "",
        nachname: "",
        unternehmen: "",
        email: "",
        telefon: "",
        challenge: "",
        datenschutz: false,
        website: "",
      });
    } catch (err) {
      setErrors({ submit: "Senden fehlgeschlagen. Bitte später erneut versuchen." });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <main>
        <section style={{ background: tokens.colors.neutral[100] }}>
          <div style={{ maxWidth: 1152, margin: "0 auto", padding: "80px 16px" }}>
            <div className="nova-glass-static" style={{ maxWidth: 560, margin: "0 auto", textAlign: "center", padding: 32, borderRadius: 16 }}>
              <div style={{ margin: "0 auto 24px", display: "flex", height: 56, width: 56, alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 12.75l-2-2L6 11.75l3 3 9-9-1.06-1.06L9 12.75z" fill={tokens.colors.brand.primary}/>
                </svg>
              </div>
              <h1 style={{ fontSize: 30, fontWeight: 700, color: tokens.colors.neutral[900] }}>Danke für Ihre Anfrage!</h1>
              <p style={{ marginTop: 12, color: tokens.colors.neutral[500] }}>
                Wir melden uns zeitnah, um mit Ihnen einen Termin für die kostenlose NOVA-Demo zu finden.
              </p>
              <div style={{ marginTop: 32 }}>
                <Link to="/" className="nova-btn nova-btn-ghost" style={{ color: tokens.colors.brand.primary }}>
                  Zur Startseite
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      {/* Hero */}
      <section style={{ borderBottom: `1px solid ${tokens.colors.neutral[200]}` }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "64px 16px" }}>
          <h1 style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.025em", color: tokens.colors.neutral[900] }}>
            Fordern Sie Ihre kostenlose NOVA-Demo an
          </h1>
          <p style={{ marginTop: 16, maxWidth: 672, fontSize: 18, color: tokens.colors.neutral[500] }}>
            In 30&nbsp;Minuten zeigen wir Ihnen live, wie NOVA Datenschutzprozesse automatisiert,
            Risiken bewertet und Berichte auditfest erstellt.
          </p>
        </div>
      </section>

      {/* Grid: Formular + Trust/Info */}
      <section style={{ maxWidth: 1152, margin: "0 auto", padding: "48px 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 40 }}>
          {/* FORM */}
          <div>
            <div className="nova-glass-static" style={{ borderRadius: 16, overflow: "hidden" }}>
              <div style={{ borderBottom: `1px solid ${tokens.colors.neutral[200]}`, padding: "20px 24px" }}>
                <h2 style={{ fontSize: 20, fontWeight: 600, color: tokens.colors.neutral[900] }}>Kontaktdaten</h2>
                <p style={{ marginTop: 4, fontSize: 14, color: tokens.colors.neutral[400] }}>
                  Mit * markierte Felder sind Pflichtfelder.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 24 }}>
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <Field
                    label="Vorname*"
                    name="vorname"
                    value={form.vorname}
                    onChange={handleChange}
                    error={errors.vorname}
                  />
                  <Field
                    label="Nachname*"
                    name="nachname"
                    value={form.nachname}
                    onChange={handleChange}
                    error={errors.nachname}
                  />
                </div>

                <Field
                  label="Unternehmen"
                  name="unternehmen"
                  value={form.unternehmen}
                  onChange={handleChange}
                  error={errors.unternehmen}
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <Field
                    label="E-Mail*"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="name@firma.de"
                  />
                  <Field
                    label="Telefon"
                    name="telefon"
                    type="tel"
                    value={form.telefon}
                    onChange={handleChange} 
                    error={errors.telefon}
                    placeholder="+49 ..."
                  />
                </div>

                <TextArea
                  label="Welche Herausforderung möchten Sie mit NOVA lösen?"
                  name="challenge"
                  value={form.challenge}
                  onChange={handleChange}
                  error={errors.challenge}
                  rows={4}
                />

                <label style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 14 }}>
                  <input
                    type="checkbox"
                    name="datenschutz"
                    checked={form.datenschutz}
                    onChange={handleChange}
                    aria-invalid={!!errors.datenschutz}
                    style={{ marginTop: 4, width: 16, height: 16, accentColor: tokens.colors.brand.primary }}
                  />
                  <span style={{ color: tokens.colors.neutral[900] }}>
                    Ich stimme der Verarbeitung meiner Daten gemäß{" "}
                    <Link to="/datenschutz" style={{ textDecoration: "underline", color: tokens.colors.brand.primary }}>
                      Datenschutzerklärung
                    </Link>{" "}
                    zu.*
                    {errors.datenschutz && (
                      <span style={{ marginLeft: 8, color: tokens.colors.status.error }}>{errors.datenschutz}</span>
                    )}
                  </span>
                </label>

                {errors.submit && (
                  <div style={{ borderRadius: 8, border: `1px solid ${tokens.colors.status.error}20`, background: `${tokens.colors.status.error}10`, padding: "12px 16px", fontSize: 14, color: tokens.colors.status.error }}>
                    {errors.submit}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="nova-btn nova-btn-primary nova-btn-lg"
                  style={{ width: "100%" }}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner /> Wird gesendet...
                    </>
                  ) : (
                    <>Demo anfordern</>
                  )}
                </button>

                <p style={{ fontSize: 12, color: tokens.colors.neutral[400] }}>
                  Ihre Angaben werden ausschließlich zur Kontaktaufnahme für die Demo verwendet. Keine Werbung, keine Weitergabe.
                </p>
              </form>
            </div>
          </div>

          {/* TRUST / INFO */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="nova-glass-static" style={{ padding: 32, borderRadius: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: tokens.colors.neutral[900] }}>Was Sie erwartet</h3>
              <ul style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12, color: tokens.colors.neutral[500], fontSize: 14, listStyle: "none", padding: 0 }}>
                <li style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <Bullet /> 30-minütiger Live-Walkthrough durch NOVA
                </li>
                <li style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <Bullet /> Einschätzung zu Ihren konkreten Anforderungen
                </li>
                <li style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <Bullet /> Klarer Umsetzungsplan inkl. Zeit & Aufwand
                </li>
              </ul>
            </div>
          </aside>
        </div>

        {/* FOOTER LINKS */}
        <div style={{ marginTop: 56, textAlign: "center", fontSize: 14, color: tokens.colors.neutral[400] }}>
          <Link to="/datenschutz" style={{ textDecoration: "underline", margin: "0 8px", color: "inherit" }}>Datenschutzerklärung</Link>
          <Link to="/impressum" style={{ textDecoration: "underline", margin: "0 8px", color: "inherit" }}>Impressum</Link>
        </div>
      </section>
    </main>
  );
}

/* ---------- Kleine UI-Helfer ---------- */

function Field(props: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  placeholder?: string;
}) {
  const { label, name, value, onChange, error, type = "text", placeholder } = props;
  const id = `field-${name}`;
  return (
    <div>
      <label htmlFor={id} style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500, color: tokens.colors.neutral[800] }}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="nova-input"
        style={error ? { borderColor: tokens.colors.status.error } : undefined}
      />
      {error && (
        <p id={`${id}-error`} style={{ marginTop: 4, fontSize: 14, color: tokens.colors.status.error }}>
          {error}
        </p>
      )}
    </div>
  );
}

function TextArea(props: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  rows?: number;
}) {
  const { label, name, value, onChange, error, rows = 4 } = props;
  const id = `field-${name}`;
  return (
    <div>
      <label htmlFor={id} style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500, color: tokens.colors.neutral[800] }}>
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="nova-input"
        style={error ? { borderColor: tokens.colors.status.error } : undefined}
      />
      {error && (
        <p id={`${id}-error`} style={{ marginTop: 4, fontSize: 14, color: tokens.colors.status.error }}>
          {error}
        </p>
      )}
    </div>
  );
}

function Bullet() {
  return (
    <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#E6E9ED] bg-white">
      <span className="inline-block h-2 w-2 rounded-full bg-[#3FB292]" />
    </span>
  );
}

function Spinner() {
  return (
    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.2" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" fill="none" />
    </svg>
  );
}
