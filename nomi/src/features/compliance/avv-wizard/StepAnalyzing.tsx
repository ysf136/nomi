import { useEffect, useRef } from "react";
import { useAuth } from "../../../auth/AuthContext";
import { analyzeAvv } from "../../../services/ai.service";
import { createAvvCase, saveAvvAnalysis } from "../../../services/avv.service";
import type { AvvAnalysisResult } from "../../../types/models";
import type { useAvvWizard } from "./useAvvWizard";
import { tokens } from "../../../styles/tokens";

type Props = { wizard: ReturnType<typeof useAvvWizard> };

export default function StepAnalyzing({ wizard }: Props) {
  const { state, setAnalyzing, setAvvCaseId, setAnalysisResult, setError, goTo } = wizard;
  const { user } = useAuth();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const run = async () => {
      setAnalyzing(true);

      try {
        const userId = user?.uid ?? "anonymous";

        // 1. Create Firestore case
        const caseId = await createAvvCase({
          userId,
          fileName: state.fileName,
          fileSizeKB: state.fileSizeKB,
          documentText: state.extractedText,
        });
        setAvvCaseId(caseId);

        // 2. Call AI analysis
        const result = await analyzeAvv({
          avv: {
            documentText: state.extractedText,
            fileName: state.fileName,
            fileSizeKB: state.fileSizeKB,
          },
          userId,
          avvId: caseId,
        });

        // 3. Determine confidence
        const confidence =
          result.conformity_score >= 70 ? "high" : result.conformity_score >= 40 ? "medium" : "low";

        const analysisDoc: AvvAnalysisResult = {
          ...result,
          confidence,
        };

        // 4. Persist analysis + auto-escalate low confidence
        await saveAvvAnalysis(caseId, analysisDoc, userId);

        // 5. Store in wizard state and advance
        setAnalysisResult(result);
        goTo("result");
      } catch (e: any) {
        console.error("AVV analysis failed", e);
        setError(e?.message ?? "Analyse fehlgeschlagen. Bitte erneut versuchen.");
        goTo("preview");
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
      {/* Spinner – uses nova design system class */}
      <div
        className="nova-spinner"
        style={{ width: 56, height: 56, margin: "0 auto 1.5rem" }}
        role="status"
        aria-label="KI-Analyse läuft"
      />

      <h2 style={{ margin: "0 0 0.5rem", color: tokens.colors.neutral[800], fontSize: "1.25rem", fontWeight: 600 }}>
        KI-Analyse läuft…
      </h2>
      <p style={{ margin: "0 0 0.5rem", color: tokens.colors.neutral[500], fontSize: 14 }}>
        Der Vertrag wird nach Art. 28, 32 und 44 ff. DSGVO geprüft.
      </p>
      <p style={{ margin: 0, color: tokens.colors.neutral[400], fontSize: 13 }}>
        {state.fileName} · {state.extractedText.length.toLocaleString("de-DE")} Zeichen
      </p>
    </div>
  );
}
