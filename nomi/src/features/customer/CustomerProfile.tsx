import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { Toast, useToast } from "../../components/common/Toast";
import { tokens } from '../../styles/tokens';

const PROFILE_STORAGE_KEY = "nova_customer_profile_v1";

interface CustomerProfileData {
  companyName: string;
  industry: string;
  companySize: string;
  dataProtectionOfficer: string;
  dataProtectionOfficerEmail: string;
  dataProtectionCoordinator: string;
  dataProtectionCoordinatorEmail: string;
  processingActivities: string; // Beschreibung der Verarbeitungstätigkeiten
  personalDataCategories: string[]; // Array of selected categories
  internationalTransfers: boolean;
  subProcessors: string;
  lastUpdated: string;
}

const DEFAULT_PROFILE: CustomerProfileData = {
  companyName: "",
  industry: "",
  companySize: "",
  dataProtectionOfficer: "",
  dataProtectionOfficerEmail: "",
  dataProtectionCoordinator: "",
  dataProtectionCoordinatorEmail: "",
  processingActivities: "",
  personalDataCategories: [],
  internationalTransfers: false,
  subProcessors: "",
  lastUpdated: new Date().toISOString(),
};

const INDUSTRIES = [
  "Finanzdienstleistungen",
  "Gesundheitswesen",
  "Einzelhandel",
  "Bildung",
  "Produktion",
  "Informationstechnologie",
  "Telekommunikation",
  "Versicherungen",
  "Öffentliche Verwaltung",
  "Transport & Logistik",
  "Energie & Versorgung",
  "Medien & Verlage",
  "Immobilien",
  "Sonstiges",
];

const COMPANY_SIZES = [
  "1-10 Mitarbeiter",
  "11-50 Mitarbeiter",
  "51-250 Mitarbeiter",
  "251-500 Mitarbeiter",
  "501-1000 Mitarbeiter",
  "1000+ Mitarbeiter",
];

const DATA_CATEGORIES = [
  "Identifikationsdaten (Name, Adresse)",
  "Kontaktdaten (E-Mail, Telefon)",
  "Finanzdaten (IBAN, Kreditkarte)",
  "Biometrische Daten",
  "Gesundheitsdaten",
  "Standortdaten",
  "IP-Adressen",
  "Cookies/Tracking-IDs",
];



export default function CustomerProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { messages, addToast, dismissToast } = useToast();

  const [profile, setProfile] = useState<CustomerProfileData>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);



  // Load profile on mount
  useEffect(() => {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfile(parsed);
      } catch (e) {
        console.error("Profile load error", e);
      }
    }
  }, []);

  // Auto-save on changes (every 3 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasChanges) {
        localStorage.setItem(
          PROFILE_STORAGE_KEY,
          JSON.stringify({ ...profile, lastUpdated: new Date().toISOString() })
        );
        setHasChanges(false);
        addToast("✓ Profil gespeichert", "success", 1500);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [profile, hasChanges]);

  const handleChange = (field: keyof CustomerProfileData, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleCategoryToggle = (category: string) => {
    setProfile((prev) => {
      const cats = prev.personalDataCategories.includes(category)
        ? prev.personalDataCategories.filter((c) => c !== category)
        : [...prev.personalDataCategories, category];
      return { ...prev, personalDataCategories: cats };
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const finalProfile = { ...profile, lastUpdated: new Date().toISOString() };
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(finalProfile));
      addToast("✓ Profil erfolgreich gespeichert", "success", 2000);
      setTimeout(() => navigate("/welcome"), 1500);
    } catch (e) {
      console.error(e);
      addToast("Fehler beim Speichern. Bitte versuchen Sie es später erneut.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "2rem 1rem",
      }}
    >
      <Toast messages={messages} onDismiss={dismissToast} />
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <button
            onClick={() => navigate("/welcome")}
            className="nova-btn nova-btn-ghost nova-btn-sm"
            style={{ marginBottom: "1rem" }}
          >
            ← Zurück
          </button>
          <h1
            style={{
              margin: "0 0 0.5rem",
              fontSize: "2.2rem",
              color: tokens.colors.neutral[900],
            }}
          >
            👤 Unternehmensprofil
          </h1>
          <p style={{ margin: 0, fontSize: "16px", color: tokens.colors.neutral[500], marginBottom: "0.5rem" }}>
            Helfen Sie uns, Ihr Unternehmen besser zu verstehen.
          </p>
          <p style={{ margin: 0, fontSize: "13px", color: tokens.colors.neutral[400] }}>
            Diese Informationen verfeinern unsere datenschutzrechtlichen Analysen.
          </p>
        </div>

        {/* Info Box */}
        <div
          style={{
            background: "rgba(63, 178, 146, 0.08)",
            border: `1px solid ${tokens.colors.brand.primary}44`,
            borderRadius: 12,
            padding: "1rem",
            marginBottom: "2rem",
            fontSize: "14px",
            color: tokens.colors.neutral[900],
          }}
        >
          ℹ️ <strong>Sichtbarkeit:</strong> Diese Daten werden lokal gespeichert und helfen NOMI bei der
          kontextgerechten Analyse. Nicht alle Felder sind erforderlich.
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div
            className="nova-glass-static"
            style={{ borderRadius: 16, padding: "2rem" }}
          >
            {/* Section 1: Unternehmensangaben */}
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: tokens.colors.neutral[900],
                marginTop: 0,
                marginBottom: "1.5rem",
                paddingBottom: "0.75rem",
                borderBottom: `2px solid ${tokens.colors.brand.primary}`,
              }}
            >
              🏢 Unternehmensangaben
            </h2>

            {/* Unternehmen */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  fontWeight: 600,
                  display: "block",
                  marginBottom: "8px",
                  color: tokens.colors.neutral[800],
                }}
              >
                Unternehmensname
              </label>
              <input
                type="text"
                placeholder="z.B. Acme GmbH"
                value={profile.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                className="nova-input"
              />
            </div>

            {/* Branche */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  fontWeight: 600,
                  display: "block",
                  marginBottom: "8px",
                  color: tokens.colors.neutral[800],
                }}
              >
                Branche <span data-tooltip="Branchen unterliegen unterschiedlichen Datenschutzanforderungen" style={{ cursor: "help", color: tokens.colors.brand.primary, fontWeight: "bold", marginLeft: 4 }}>?</span>
              </label>
              <select
                value={profile.industry}
                onChange={(e) => handleChange("industry", e.target.value)}
                className="nova-input"
              >
                <option value="">-- Bitte wählen --</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            {/* Unternehmensgröße */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  fontWeight: 600,
                  display: "block",
                  marginBottom: "8px",
                  color: tokens.colors.neutral[800],
                }}
              >
                Unternehmensgröße
                <span data-tooltip="Größere Unternehmen brauchen oft ein DSB (Datenschutzbeauftragter)" style={{ cursor: "help", color: tokens.colors.brand.primary, fontWeight: "bold", marginLeft: 4 }}>?</span>
              </label>
              <select
                value={profile.companySize}
                onChange={(e) => handleChange("companySize", e.target.value)}
                className="nova-input"
              >
                <option value="">-- Bitte wählen --</option>
                {COMPANY_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Section 2: Datenschutzverantwortliche */}
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: tokens.colors.neutral[900],
                marginTop: "2rem",
                marginBottom: "1.5rem",
                paddingBottom: "0.75rem",
                borderBottom: `2px solid ${tokens.colors.brand.primary}`,
              }}
            >
              🔐 Datenschutzverantwortliche
            </h2>

            {/* Datenschutzbeauftragter */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  fontWeight: 600,
                  display: "block",
                  marginBottom: "8px",
                  color: tokens.colors.neutral[800],
                }}
              >
                Datenschutzbeauftragter (DSB) *
                <span data-tooltip="DSGVO Art. 37: Pflicht ab 250 MA oder bei öffentlicher Stelle" style={{ cursor: "help", color: tokens.colors.brand.primary, fontWeight: "bold", marginLeft: 4 }}>?</span>
              </label>
              <input
                type="text"
                placeholder="Name oder Kontaktperson"
                value={profile.dataProtectionOfficer}
                onChange={(e) => handleChange("dataProtectionOfficer", e.target.value)}
                className="nova-input"
                style={{ marginBottom: "0.5rem" }}
              />
              <input
                type="email"
                placeholder="E-Mail"
                value={profile.dataProtectionOfficerEmail}
                onChange={(e) => handleChange("dataProtectionOfficerEmail", e.target.value)}
                className="nova-input"
              />
              <small style={{ color: tokens.colors.neutral[400], display: "block", marginTop: "4px" }}>
                * Muss der Aufsichtsbehörde bekannt sein
              </small>
            </div>

            {/* Datenschutzkoordinator (intern) */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  fontWeight: 600,
                  display: "block",
                  marginBottom: "8px",
                  color: tokens.colors.neutral[800],
                }}
              >
                Datenschutzkoordinator (intern)
                <span data-tooltip="Interne Ansprechperson für Datenschutzfragen" style={{ cursor: "help", color: tokens.colors.brand.primary, fontWeight: "bold", marginLeft: 4 }}>?</span>
              </label>
              <input
                type="text"
                placeholder="Name oder Titel"
                value={profile.dataProtectionCoordinator}
                onChange={(e) => handleChange("dataProtectionCoordinator", e.target.value)}
                className="nova-input"
                style={{ marginBottom: "0.5rem" }}
              />
              <input
                type="email"
                placeholder="E-Mail"
                value={profile.dataProtectionCoordinatorEmail}
                onChange={(e) => handleChange("dataProtectionCoordinatorEmail", e.target.value)}
                className="nova-input"
              />
            </div>

            {/* Section 3: Verarbeitungstätigkeiten */}
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: tokens.colors.neutral[900],
                marginTop: "2rem",
                marginBottom: "1.5rem",
                paddingBottom: "0.75rem",
                borderBottom: `2px solid ${tokens.colors.brand.primary}`,
              }}
            >
              ⚙️ Verarbeitungstätigkeiten
            </h2>

            {/* Hauptverarbeitungstätigkeiten */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  fontWeight: 600,
                  display: "block",
                  marginBottom: "8px",
                  color: tokens.colors.neutral[800],
                }}
              >
                Beschreibung der Verarbeitungstätigkeiten
                <span data-tooltip="z.B. Kundenverwaltung, Personalabrechnung, Marketing, Website-Tracking" style={{ cursor: "help", color: tokens.colors.brand.primary, fontWeight: "bold", marginLeft: 4 }}>?</span>
              </label>
              <textarea
                rows={5}
                placeholder="Beispiel: Wir verarbeiten Kundendaten zur Auftragsabwicklung, Rechnungslegung und zum Versand von Produktinformationen..."
                value={profile.processingActivities}
                onChange={(e) => handleChange("processingActivities", e.target.value)}
                className="nova-input"
                style={{ resize: "vertical" }}
              />
            </div>

            {/* Kategorien personenbezogener Daten */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  fontWeight: 600,
                  display: "block",
                  marginBottom: "12px",
                  color: tokens.colors.neutral[800],
                }}
              >
                Kategorien personenbezogener Daten
                <span data-tooltip="Welche Arten von Daten verarbeiten Sie?" style={{ cursor: "help", color: tokens.colors.brand.primary, fontWeight: "bold", marginLeft: 4 }}>?</span>
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "10px",
                }}
              >
                {DATA_CATEGORIES.map((cat) => (
                  <label
                    key={cat}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 12px",
                      border: "1px solid #e0e4ea",
                      borderRadius: 8,
                      cursor: "pointer",
                      background: profile.personalDataCategories.includes(cat)
                        ? "rgba(63, 178, 146, 0.1)"
                        : "white",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={profile.personalDataCategories.includes(cat)}
                      onChange={() => handleCategoryToggle(cat)}
                      style={{ cursor: "pointer" }}
                    />
                    <span style={{ fontSize: "13px" }}>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Internationale Datenübermittlungen */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  color: tokens.colors.neutral[800],
                }}
              >
                <input
                  type="checkbox"
                  checked={profile.internationalTransfers}
                  onChange={(e) => handleChange("internationalTransfers", e.target.checked)}
                  style={{ cursor: "pointer", width: "16px", height: "16px" }}
                />
                Datenübermittlungen in Drittländer
                <span data-tooltip="DSGVO Kap. 5: Besondere Anforderungen außerhalb EU/EWR" style={{ cursor: "help", color: tokens.colors.brand.primary, fontWeight: "bold", marginLeft: 4 }}>?</span>
              </label>
              <p style={{ margin: "0.5rem 0 0", fontSize: "13px", color: tokens.colors.neutral[500] }}>
                Wir verarbeiten Daten in Ländern außerhalb der EU/EWR
              </p>
            </div>

            {/* Auftragsverarbeiter */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  fontWeight: 600,
                  display: "block",
                  marginBottom: "8px",
                  color: tokens.colors.neutral[800],
                }}
              >
                Auftragsverarbeiter / Subprozessoren
                <span data-tooltip="DSGVO Art. 28: Verträge für Auftragsverarbeiter erforderlich" style={{ cursor: "help", color: tokens.colors.brand.primary, fontWeight: "bold", marginLeft: 4 }}>?</span>
              </label>
              <textarea
                rows={3}
                placeholder="z.B. Cloud-Provider: AWS, Google Workspace; Zahlungsanbieter: Stripe; E-Mail: Brevo"
                value={profile.subProcessors}
                onChange={(e) => handleChange("subProcessors", e.target.value)}
                className="nova-input"
                style={{ resize: "vertical" }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "12px", marginTop: "2rem" }}>
              <button
                type="submit"
                disabled={loading}
                className="nova-btn nova-btn-primary nova-btn-lg"
                style={{ flex: 1 }}
              >
                {loading ? "⏳ Speichert..." : "✓ Profil speichern"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/welcome")}
                className="nova-btn nova-btn-secondary"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </form>

        {/* Info Footer */}
        <div
          className="nova-glass-static"
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            fontSize: "13px",
            color: tokens.colors.neutral[500],
          }}
        >
          <strong>💡 Warum diese Informationen?</strong>
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.2rem", lineHeight: 1.6 }}>
            <li>
              <strong>Branche & Größe:</strong> Verschiedene Sektoren haben unterschiedliche
              Datenschutzanforderungen
            </li>
            <li>
              <strong>DSB & Koordinator:</strong> Wir helfen bei der Erfüllung der DSGVO
              Art. 37-Anforderungen
            </li>
            <li>
              <strong>Verarbeitungstätigkeiten:</strong> DSGVO Art. 30 fordert ein
              Verzeichnis – wir unterstützen Sie dabei
            </li>
            <li>
              <strong>Datenübermittlungen:</strong> Internationale Transfers (DSGVO Kap. 5)
              erfordern spezielle Sicherungsmaßnahmen
            </li>
            <li>
              <strong>Auftragsverarbeiter:</strong> DSGVO Art. 28 verlangt schriftliche
              Verträge mit allen Subprozessoren
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
