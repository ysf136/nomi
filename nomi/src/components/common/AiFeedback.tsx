import { useState } from "react";
import { tokens } from "../../styles/tokens";
import { useAuth } from "../../auth/AuthContext";
import { promoteToGoldenExample, type GoldenDomain } from "../../services/golden-examples.service";

interface AiFeedbackProps {
  domain: GoldenDomain;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  analysisId?: string;
}

export default function AiFeedback({ domain, input, output, analysisId }: AiFeedbackProps) {
  const { user } = useAuth();
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [promoted, setPromoted] = useState(false);
  const [showPromote, setShowPromote] = useState(false);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  function handleVote(v: "up" | "down") {
    setVote(v);
    if (v === "up") setShowPromote(true);
  }

  async function handlePromote() {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await promoteToGoldenExample({
        domain,
        title: title.trim(),
        input,
        output,
        userId: user?.uid ?? "unknown",
        analysisId,
      });
      setPromoted(true);
      setShowPromote(false);
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  }

  const btnStyle = (active: boolean, color: string): React.CSSProperties => ({
    background: active ? `${color}18` : "transparent",
    border: `1px solid ${active ? color : "rgba(0,0,0,0.12)"}`,
    borderRadius: 8,
    padding: "4px 12px",
    cursor: "pointer",
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    gap: 4,
    color: active ? color : tokens.colors.neutral[500],
    fontWeight: active ? 600 : 400,
    transition: "all 0.2s",
  });

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 12, color: tokens.colors.neutral[400] }}>
          War diese Analyse hilfreich?
        </span>
        <button onClick={() => handleVote("up")} style={btnStyle(vote === "up", "#27ae60")}>
          👍 Gut
        </button>
        <button onClick={() => handleVote("down")} style={btnStyle(vote === "down", "#e74c3c")}>
          👎 Ungenau
        </button>
        {promoted && (
          <span style={{ fontSize: 12, color: tokens.colors.brand.primary, fontWeight: 600 }}>
            ✓ Als Goldstandard gespeichert
          </span>
        )}
      </div>

      {showPromote && !promoted && user?.role === "admin" && (
        <div
          style={{
            marginTop: 10,
            padding: 12,
            background: "rgba(63,178,146,0.06)",
            borderRadius: 10,
            border: `1px solid ${tokens.colors.brand.primary}33`,
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 12, color: tokens.colors.neutral[600], whiteSpace: "nowrap" }}>
            Als Goldstandard speichern:
          </span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titel für diesen Referenzfall"
            style={{
              flex: 1,
              padding: "6px 10px",
              borderRadius: 6,
              border: "1px solid rgba(0,0,0,0.12)",
              fontSize: 13,
            }}
          />
          <button
            onClick={handlePromote}
            disabled={saving || !title.trim()}
            style={{
              background: tokens.colors.brand.primary,
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "6px 14px",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              opacity: saving || !title.trim() ? 0.5 : 1,
            }}
          >
            {saving ? "..." : "Speichern"}
          </button>
          <button
            onClick={() => setShowPromote(false)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#999" }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
