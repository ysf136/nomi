import { useState, useEffect } from "react";
import { useToast } from "../../components/common/Toast";
import {
  ProcessingActivity,
  DATA_CATEGORIES,
  DATA_SUBJECTS,
  LEGAL_BASES,
  RETENTION_PERIODS,
  SECURITY_MEASURES,
  TRANSFER_MECHANISMS,
} from "../../types/processing-activities";
import { tokens } from '../../styles/tokens';

const ACTIVITIES_STORAGE_KEY = "nova_processing_activities_v1";

interface ProcessingActivityFormProps {
  activity?: ProcessingActivity;
  onSave: (activity: ProcessingActivity) => void;
  onCancel: () => void;
}

function ProcessingActivityForm({ activity, onSave, onCancel }: ProcessingActivityFormProps) {
  const [formData, setFormData] = useState<ProcessingActivity>(
    activity || {
      id: Date.now().toString(),
      name: "",
      purpose: "",
      legalBasis: "",
      dataCategories: [],
      dataSubjects: [],
      recipients: [],
      retentionPeriod: "",
      securityMeasures: [],
      internationalTransfer: false,
      transferMechanism: "",
      subProcessors: [],
      status: "draft",
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      notes: "",
    }
  );

  const handleInputChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value, lastUpdated: new Date().toISOString() }));
  };

  const handleToggleArray = (field: keyof ProcessingActivity, item: string) => {
    setFormData((prev) => {
      const arr = prev[field] as string[];
      return {
        ...prev,
        [field]: arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item],
        lastUpdated: new Date().toISOString(),
      };
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.purpose || !formData.legalBasis) {
      alert("Bitte füllen Sie mindestens Name, Zweck und Rechtsgrundlage aus.");
      return;
    }
    onSave(formData);
  };

  return (
    <div
      className="nova-glass-static"
      style={{
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
      }}
    >
      <h3 style={{ color: tokens.colors.brand.primary, marginBottom: 16 }}>
        {activity ? "Verarbeitungstätigkeit bearbeiten" : "Neue Verarbeitungstätigkeit"}
      </h3>

      {/* Name */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8, color: tokens.colors.neutral[800], fontWeight: 500 }}>
          Name der Verarbeitung *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="z.B. Kundenverwaltung"
          className="nova-input"
          style={{ width: "100%" }}
        />
      </div>

      {/* Purpose */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8, color: tokens.colors.neutral[800], fontWeight: 500 }}>
          Zweck der Verarbeitung *
        </label>
        <textarea
          value={formData.purpose}
          onChange={(e) => handleInputChange("purpose", e.target.value)}
          placeholder="Beschreiben Sie den Zweck der Verarbeitung"
          className="nova-input"
          style={{ width: "100%", minHeight: 80, resize: "vertical" }}
        />
      </div>

      {/* Legal Basis */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8, color: tokens.colors.neutral[800], fontWeight: 500 }}>
          Rechtsgrundlage *
        </label>
        <select
          value={formData.legalBasis}
          onChange={(e) => handleInputChange("legalBasis", e.target.value)}
          className="nova-input"
          style={{ width: "100%" }}
        >
          <option value="">-- Wählen Sie eine Rechtsgrundlage --</option>
          {LEGAL_BASES.map((basis) => (
            <option key={basis} value={basis}>
              {basis}
            </option>
          ))}
        </select>
      </div>

      {/* Data Categories */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8, color: tokens.colors.neutral[800], fontWeight: 500 }}>
          Datenkategorien
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
          {DATA_CATEGORIES.map((cat) => (
            <label
              key={cat}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                color: tokens.colors.neutral[600],
              }}
            >
              <input
                type="checkbox"
                checked={(formData.dataCategories as string[]).includes(cat)}
                onChange={() => handleToggleArray("dataCategories", cat)}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* Data Subjects */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8, color: tokens.colors.neutral[800], fontWeight: 500 }}>
          Betroffene Kategorien
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
          {DATA_SUBJECTS.map((subject) => (
            <label
              key={subject}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                color: tokens.colors.neutral[600],
              }}
            >
              <input
                type="checkbox"
                checked={(formData.dataSubjects as string[]).includes(subject)}
                onChange={() => handleToggleArray("dataSubjects", subject)}
              />
              {subject}
            </label>
          ))}
        </div>
      </div>

      {/* Recipients */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8, color: tokens.colors.neutral[800], fontWeight: 500 }}>
          Empfänger (kommagetrennt)
        </label>
        <input
          type="text"
          value={(formData.recipients as string[]).join(", ")}
          onChange={(e) =>
            handleInputChange(
              "recipients",
              e.target.value.split(",").map((x) => x.trim())
            )
          }
          placeholder="z.B. Finanzamt, Steuerberater"
          className="nova-input"
          style={{ width: "100%" }}
        />
      </div>

      {/* Retention Period */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8, color: tokens.colors.neutral[800], fontWeight: 500 }}>
          Aufbewahrungsdauer
        </label>
        <select
          value={formData.retentionPeriod}
          onChange={(e) => handleInputChange("retentionPeriod", e.target.value)}
          className="nova-input"
          style={{ width: "100%" }}
        >
          <option value="">-- Wählen Sie eine Aufbewahrungsdauer --</option>
          {RETENTION_PERIODS.map((period) => (
            <option key={period} value={period}>
              {period}
            </option>
          ))}
        </select>
      </div>

      {/* Security Measures */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8, color: tokens.colors.neutral[800], fontWeight: 500 }}>
          Sicherheitsmaßnahmen
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
          {SECURITY_MEASURES.map((measure) => (
            <label
              key={measure}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                color: tokens.colors.neutral[600],
              }}
            >
              <input
                type="checkbox"
                checked={(formData.securityMeasures as string[]).includes(measure)}
                onChange={() => handleToggleArray("securityMeasures", measure)}
              />
              {measure}
            </label>
          ))}
        </div>
      </div>

      {/* International Transfer */}
      <div style={{ marginBottom: 16 }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            color: tokens.colors.neutral[800],
          }}
        >
          <input
            type="checkbox"
            checked={formData.internationalTransfer}
            onChange={(e) => handleInputChange("internationalTransfer", e.target.checked)}
          />
          Transfer außerhalb EU/EWR
        </label>
      </div>

      {/* Transfer Mechanism */}
      {formData.internationalTransfer && (
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 8, color: tokens.colors.neutral[800], fontWeight: 500 }}>
            Übertragungsmechanismus
          </label>
          <select
            value={formData.transferMechanism || ""}
            onChange={(e) => handleInputChange("transferMechanism", e.target.value)}
            className="nova-input"
            style={{ width: "100%" }}
          >
            <option value="">-- Wählen Sie einen Mechanismus --</option>
            {TRANSFER_MECHANISMS.map((mechanism) => (
              <option key={mechanism} value={mechanism}>
                {mechanism}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Sub Processors */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8, color: tokens.colors.neutral[800], fontWeight: 500 }}>
          Auftragsverarbeiter (kommagetrennt)
        </label>
        <input
          type="text"
          value={(formData.subProcessors as string[]).join(", ")}
          onChange={(e) =>
            handleInputChange(
              "subProcessors",
              e.target.value.split(",").map((x) => x.trim())
            )
          }
          placeholder="z.B. Cloud-Provider, IT-Dienstleister"
          className="nova-input"
          style={{ width: "100%" }}
        />
      </div>

      {/* Status */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8, color: tokens.colors.neutral[800], fontWeight: 500 }}>
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => handleInputChange("status", e.target.value)}
          className="nova-input"
          style={{ width: "100%" }}
        >
          <option value="draft">Entwurf</option>
          <option value="review">Überprüfung</option>
          <option value="completed">Abgeschlossen</option>
        </select>
      </div>

      {/* Notes */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", marginBottom: 8, color: tokens.colors.neutral[800], fontWeight: 500 }}>
          Zusätzliche Notizen
        </label>
        <textarea
          value={formData.notes || ""}
          onChange={(e) => handleInputChange("notes", e.target.value)}
          placeholder="Weitere Informationen oder Besonderheiten"
          className="nova-input"
          style={{ width: "100%", minHeight: 80, resize: "vertical" }}
        />
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={handleSubmit}
          className="nova-btn nova-btn-primary"
        >
          {activity ? "Aktualisieren" : "Speichern"}
        </button>
        <button
          onClick={onCancel}
          className="nova-btn nova-btn-secondary"
        >
          Abbrechen
        </button>
      </div>
    </div>
  );
}

function ActivityCard({ activity, onEdit, onDelete }: { activity: ProcessingActivity; onEdit: () => void; onDelete: () => void }) {
  const statusBadgeClass: Record<string, string> = {
    draft: "nova-badge nova-badge-warning",
    review: "nova-badge nova-badge-info",
    completed: "nova-badge nova-badge-success",
  };

  const statusTexts: Record<string, string> = {
    draft: "Entwurf",
    review: "Überprüfung",
    completed: "Abgeschlossen",
  };

  return (
    <div
      className="nova-glass-static"
      style={{
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
        <div>
          <h4 style={{ color: tokens.colors.brand.primary, marginBottom: 4, fontSize: 16 }}>{activity.name}</h4>
          <p style={{ color: tokens.colors.neutral[500], fontSize: 13, marginBottom: 8 }}>{activity.purpose}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span className={statusBadgeClass[activity.status]}>
              {statusTexts[activity.status]}
            </span>
            <span style={{ color: tokens.colors.neutral[400], fontSize: 12 }}>
              Rechtsgrundlage: {activity.legalBasis}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onEdit}
            className="nova-btn nova-btn-ghost nova-btn-sm"
          >
            Bearbeiten
          </button>
          <button
            onClick={onDelete}
            className="nova-btn nova-btn-danger nova-btn-sm"
          >
            Löschen
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 12,
          fontSize: 13,
          color: tokens.colors.neutral[500],
          paddingTop: 12,
          borderTop: `1px solid rgba(0,0,0,0.06)`,
        }}
      >
        <div>
          <strong style={{ color: tokens.colors.neutral[700] }}>Datenkategorien:</strong>{" "}
          {activity.dataCategories.length > 0 ? activity.dataCategories.join(", ") : "Keine"}
        </div>
        <div>
          <strong style={{ color: tokens.colors.neutral[700] }}>Betroffene:</strong>{" "}
          {activity.dataSubjects.length > 0 ? activity.dataSubjects.join(", ") : "Keine"}
        </div>
        <div>
          <strong style={{ color: tokens.colors.neutral[700] }}>Aufbewahrungsdauer:</strong> {activity.retentionPeriod}
        </div>
        <div>
          <strong style={{ color: tokens.colors.neutral[700] }}>Sicherheit:</strong>{" "}
          {activity.securityMeasures.length > 0 ? `${activity.securityMeasures.length} Maßnahmen` : "Keine"}
        </div>
      </div>
    </div>
  );
}

export default function Verarbeitungstätigkeiten() {
  const { addToast } = useToast();
  const [activities, setActivities] = useState<ProcessingActivity[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ProcessingActivity | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    const saved = localStorage.getItem(ACTIVITIES_STORAGE_KEY);
    if (saved) {
      try {
        setActivities(JSON.parse(saved));
      } catch {
        console.error("Fehler beim Laden von Verarbeitungstätigkeiten");
      }
    }
  }, []);

  const saveActivities = (newActivities: ProcessingActivity[]) => {
    setActivities(newActivities);
    localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(newActivities));
  };

  const handleSave = (activity: ProcessingActivity) => {
    if (editingActivity) {
      const updated = activities.map((a) => (a.id === activity.id ? activity : a));
      saveActivities(updated);
      addToast("Verarbeitungstätigkeit aktualisiert", "success");
    } else {
      saveActivities([...activities, activity]);
      addToast("Verarbeitungstätigkeit erstellt", "success");
    }
    setShowForm(false);
    setEditingActivity(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.")) {
      saveActivities(activities.filter((a) => a.id !== id));
      addToast("Verarbeitungstätigkeit gelöscht", "success");
    }
  };

  const filteredActivities =
    filterStatus === "all" ? activities : activities.filter((a) => a.status === filterStatus);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <h2 style={{ color: tokens.colors.neutral[900], marginBottom: 24, fontSize: 28, fontWeight: 600 }}>
        📋 Verzeichnis der Verarbeitungstätigkeiten (VVT)
      </h2>

      <p style={{ color: tokens.colors.neutral[500], marginBottom: 24, fontSize: 14, lineHeight: 1.6 }}>
        Das Verzeichnis der Verarbeitungstätigkeiten ist eine DSGVO-Anforderung (Art. 30), die alle
        Verarbeitungen personenbezogener Daten dokumentiert. Dies ist ein wichtiges Compliance-Dokument, das bei
        einer Datenschutzbehörden-Kontrolle vorgelegt werden muss.
      </p>

      {/* Filter */}
      <div style={{ marginBottom: 24, display: "flex", gap: 12 }}>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="nova-input"
        >
          <option value="all">Alle Status</option>
          <option value="draft">Entwurf</option>
          <option value="review">Überprüfung</option>
          <option value="completed">Abgeschlossen</option>
        </select>

        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingActivity(null);
          }}
          className="nova-btn nova-btn-primary"
        >
          {showForm ? "Formular ausblenden" : "+ Neue Verarbeitungstätigkeit"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <ProcessingActivityForm
          activity={editingActivity || undefined}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingActivity(null);
          }}
        />
      )}

      {/* Activities List */}
      <div>
        {filteredActivities.length === 0 ? (
          <div
            className="nova-glass-static"
            style={{
              borderRadius: 16,
              padding: 32,
              textAlign: "center",
              color: tokens.colors.neutral[500],
            }}
          >
            <p style={{ fontSize: 16, marginBottom: 12 }}>Noch keine Verarbeitungstätigkeiten erfasst</p>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingActivity(null);
              }}
              className="nova-btn nova-btn-primary"
            >
              Erste Verarbeitungstätigkeit erstellen
            </button>
          </div>
        ) : (
          <>
            <p style={{ color: tokens.colors.neutral[500], marginBottom: 16, fontSize: 14 }}>
              {filteredActivities.length} Verarbeitungstätigkeit(en) gefunden
            </p>
            {filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onEdit={() => {
                  setEditingActivity(activity);
                  setShowForm(true);
                }}
                onDelete={() => handleDelete(activity.id)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
