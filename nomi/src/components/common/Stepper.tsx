import { type CSSProperties } from "react";
import { tokens } from "../../styles/tokens";

export interface StepDef {
  label: string;
  description?: string;
}

interface StepperProps {
  steps: StepDef[];
  currentIndex: number;
  onStepClick?: (index: number) => void;
}

export default function Stepper({ steps, currentIndex, onStepClick }: StepperProps) {
  return (
    <nav aria-label="Fortschritt" style={{ display: "flex", alignItems: "center", gap: 0, width: "100%" }}>
      {steps.map((step, i) => {
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;
        const isClickable = isCompleted && !!onStepClick;

        const circleStyle: CSSProperties = {
          width: 32,
          height: 32,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 14,
          flexShrink: 0,
          border: isCurrent
            ? `2px solid ${tokens.colors.brand.primary}`
            : isCompleted
              ? "none"
              : `2px solid ${tokens.colors.neutral[200]}`,
          background: isCompleted
            ? tokens.colors.brand.primary
            : isCurrent
              ? "rgba(63,178,146,0.1)"
              : "rgba(255,255,255,0.6)",
          color: isCompleted
            ? "white"
            : isCurrent
              ? tokens.colors.brand.primary
              : tokens.colors.neutral[400],
          cursor: isClickable ? "pointer" : "default",
          transition: tokens.transitions.base,
          boxShadow: isCurrent ? `0 0 12px ${tokens.colors.brand.primary}30` : "none",
        };

        const labelStyle: CSSProperties = {
          fontSize: 12,
          fontWeight: isCurrent ? 700 : 400,
          color: isCurrent
            ? tokens.colors.neutral[800]
            : isCompleted
              ? tokens.colors.brand.primary
              : tokens.colors.neutral[400],
          marginTop: 4,
          textAlign: "center",
          maxWidth: 90,
          lineHeight: 1.2,
        };

        const connectorStyle: CSSProperties = {
          flex: 1,
          height: 2,
          background: isCompleted
            ? `linear-gradient(90deg, ${tokens.colors.brand.primary}, ${tokens.colors.brand.secondary})`
            : tokens.colors.neutral[200],
          transition: "background 0.3s ease",
          borderRadius: 1,
        };

        return (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                role="listitem"
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Schritt ${i + 1}: ${step.label}${isCompleted ? " (abgeschlossen)" : isCurrent ? " (aktuell)" : ""}`}
                style={circleStyle}
                tabIndex={isClickable ? 0 : -1}
                onClick={isClickable ? () => onStepClick(i) : undefined}
                onKeyDown={isClickable ? (e) => { if (e.key === "Enter" || e.key === " ") onStepClick(i); } : undefined}
              >
                {isCompleted ? "✓" : i + 1}
              </div>
              <div style={labelStyle}>{step.label}</div>
            </div>
            {i < steps.length - 1 && <div style={connectorStyle} />}
          </div>
        );
      })}
    </nav>
  );
}
