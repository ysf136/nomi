import Stepper from "../../../components/common/Stepper";
import { AVV_STEPS, useAvvWizard } from "./useAvvWizard";
import StepUpload from "./StepUpload";
import StepPreview from "./StepPreview";
import StepAnalyzing from "./StepAnalyzing";
import StepResult from "./StepResult";
import StepExport from "./StepExport";
import AIPoweredBadge from "../../../components/common/AIPoweredBadge";
import GlassCard from "../../../components/ui/GlassCard";
import { Reveal } from "../../../hooks/useScrollReveal";
import { tokens } from "../../../styles/tokens";

export default function AvvWizard() {
  const wizard = useAvvWizard();
  const { state, goTo } = wizard;

  const handleStepClick = (index: number) => {
    if (index < state.currentIndex) {
      const stepNames = ["upload", "preview", "analyzing", "result", "export"] as const;
      goTo(stepNames[index]);
    }
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case "upload":
        return <StepUpload wizard={wizard} />;
      case "preview":
        return <StepPreview wizard={wizard} />;
      case "analyzing":
        return <StepAnalyzing wizard={wizard} />;
      case "result":
        return <StepResult wizard={wizard} />;
      case "export":
        return <StepExport wizard={wizard} />;
    }
  };

  return (
    <div style={{ padding: "2rem 1rem" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Header */}
        <Reveal variant="up">
          <header style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
              <h1 style={{ margin: 0, fontSize: "1.75rem", color: tokens.colors.neutral[900], fontWeight: 700, letterSpacing: "-0.02em" }}>
                AV-Vertrag prüfen
              </h1>
              <AIPoweredBadge tooltip="KI-gestützte Analyse nach Art. 28/32/44ff DSGVO" />
            </div>
            <p style={{ margin: "0.25rem 0 0", color: tokens.colors.neutral[500], fontSize: 14 }}>
              Lade deinen Auftragsverarbeitungsvertrag (PDF) hoch. Unsere KI prüft Art. 28, 32 und 44 ff. DSGVO.
            </p>
          </header>
        </Reveal>

        {/* Stepper */}
        <GlassCard flat padding="md" style={{ marginBottom: "1.25rem" }}>
          <Stepper
            steps={[...AVV_STEPS]}
            currentIndex={state.currentIndex}
            onStepClick={handleStepClick}
          />
        </GlassCard>

        {/* Error banner */}
        {state.error && (
          <div style={{ padding: "0.75rem 1rem", background: "rgba(239,68,68,0.08)", border: `1px solid ${tokens.colors.status.error}40`, borderRadius: 12, color: tokens.colors.status.error, marginBottom: "1rem", fontSize: 14, backdropFilter: "blur(8px)" }}>
            {state.error}
          </div>
        )}

        {/* Step content */}
        <GlassCard glow padding="lg">
          {renderStep()}
        </GlassCard>
      </div>
    </div>
  );
}
