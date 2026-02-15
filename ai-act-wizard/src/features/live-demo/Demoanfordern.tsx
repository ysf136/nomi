import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

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
      <main className="min-h-screen bg-white">
        <section className="bg-[#E6E9ED]">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="mx-auto max-w-xl text-center">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow">
                <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 12.75l-2-2L6 11.75l3 3 9-9-1.06-1.06L9 12.75z" fill="#3FB292"/>
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-[#183939]">Danke für Ihre Anfrage!</h1>
              <p className="mt-3 text-[#183939]/80">
                Wir melden uns zeitnah, um mit Ihnen einen Termin für die kostenlose NOVA-Demo zu finden.
              </p>
              <div className="mt-8">
                <Link to="/" className="text-[#3FB292] underline hover:no-underline">
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
    <main className="min-h-screen bg-white font-['Aptos',sans-serif]">
      {/* Hero */}
      <section className="relative border-b border-[#E6E9ED]">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:py-20 relative">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#183939]">
            Fordern Sie Ihre kostenlose NOVA-Demo an
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[#183939]/80">
            In 30&nbsp;Minuten zeigen wir Ihnen live, wie NOVA Datenschutzprozesse automatisiert,
            Risiken bewertet und Berichte auditfest erstellt.
          </p>
        </div>
      </section>

      {/* Grid: Formular + Trust/Info */}
      <section className="mx-auto max-w-6xl px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* FORM */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-[#E6E9ED] shadow-lg shadow-[#183939]/5">
              <div className="border-b border-[#E6E9ED] px-6 py-5">
                <h2 className="text-xl font-semibold text-[#183939]">Kontaktdaten</h2>
                <p className="mt-1 text-sm text-[#183939]/70">
                  Mit * markierte Felder sind Pflichtfelder.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="p-6 lg:p-8 space-y-6">
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

                <label className="flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    name="datenschutz"
                    checked={form.datenschutz}
                    onChange={handleChange}
                    aria-invalid={!!errors.datenschutz}
                    className="mt-1 h-4 w-4 rounded border-[#183939]/30 text-[#3FB292] focus:ring-[#3FB292]"
                  />
                  <span className="text-[#183939]">
                    Ich stimme der Verarbeitung meiner Daten gemäß{" "}
                    <Link to="/datenschutz" className="underline text-[#3FB292] hover:text-[#2e8c74]">
                      Datenschutzerklärung
                    </Link>{" "}
                    zu.*
                    {errors.datenschutz && (
                      <span className="ml-2 text-red-600">{errors.datenschutz}</span>
                    )}
                  </span>
                </label>

                {errors.submit && (
                  <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errors.submit}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#3FB292] px-5 py-4 text-white text-base font-semibold shadow hover:bg-[#2e8c74] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3FB292] disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner /> Wird gesendet...
                    </>
                  ) : (
                    <>Demo anfordern</>
                  )}
                </button>

                <p className="text-xs text-[#183939]/60">
                  Ihre Angaben werden ausschließlich zur Kontaktaufnahme für die Demo verwendet. Keine Werbung, keine Weitergabe.
                </p>
              </form>
            </div>
          </div>

          {/* TRUST / INFO */}
          <aside className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-[#E6E9ED] bg-[#F8FAFC] p-8">
              <h3 className="text-lg font-semibold text-[#183939]">Was Sie erwartet</h3>
              <ul className="mt-4 space-y-3 text-[#183939]/80 text-sm">
                <li className="flex items-start gap-3">
                  <Bullet /> 30-minütiger Live-Walkthrough durch NOVA
                </li>
                <li className="flex items-start gap-3">
                  <Bullet /> Einschätzung zu Ihren konkreten Anforderungen
                </li>
                <li className="flex items-start gap-3">
                  <Bullet /> Klarer Umsetzungsplan inkl. Zeit & Aufwand
                </li>
              </ul>
            </div>
          </aside>
        </div>

        {/* FOOTER LINKS */}
        <div className="mt-14 text-center text-sm text-[#183939]/70">
          <Link to="/datenschutz" className="underline mx-2">Datenschutzerklärung</Link>
          <Link to="/impressum" className="underline mx-2">Impressum</Link>
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
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-[#183939]">
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
        className={[
          "w-full rounded-xl border bg-white px-4 py-3 text-base outline-none",
          "placeholder:text-[#183939]/40",
          error
            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
            : "border-[#E6E9ED] focus:border-[#3FB292] focus:ring-2 focus:ring-[#3FB292]/20",
        ].join(" ")}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
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
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-[#183939]">
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
        className={[
          "w-full rounded-xl border bg-white px-4 py-3 text-base outline-none",
          "placeholder:text-[#183939]/40",
          error
            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
            : "border-[#E6E9ED] focus:border-[#3FB292] focus:ring-2 focus:ring-[#3FB292]/20",
        ].join(" ")}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
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
