import { useState, useCallback } from "react";
import type { AvvAssistantResult } from "../../../services/ai.provider";

// ── Step definitions ──────────────────────────────────────────

export const AVV_STEPS = [
  { label: "Upload", description: "PDF hochladen" },
  { label: "Vorschau", description: "Extraktion prüfen" },
  { label: "Analyse", description: "KI-Prüfung" },
  { label: "Ergebnis", description: "Bericht anzeigen" },
  { label: "Export", description: "Speichern & Export" },
] as const;

export type AvvStepName = "upload" | "preview" | "analyzing" | "result" | "export";

const STEP_ORDER: AvvStepName[] = ["upload", "preview", "analyzing", "result", "export"];

// ── State type ────────────────────────────────────────────────

export interface AvvWizardState {
  currentStep: AvvStepName;
  currentIndex: number;
  file: File | null;
  fileName: string;
  fileSizeKB: number;
  pageCount: number;
  extractedText: string;
  avvCaseId: string | null;
  analysisResult: AvvAssistantResult | null;
  error: string | null;
  isAnalyzing: boolean;
}

// ── Hook ──────────────────────────────────────────────────────

export function useAvvWizard() {
  const [state, setState] = useState<AvvWizardState>({
    currentStep: "upload",
    currentIndex: 0,
    file: null,
    fileName: "",
    fileSizeKB: 0,
    pageCount: 0,
    extractedText: "",
    avvCaseId: null,
    analysisResult: null,
    error: null,
    isAnalyzing: false,
  });

  const goTo = useCallback((step: AvvStepName) => {
    const index = STEP_ORDER.indexOf(step);
    setState((s) => ({ ...s, currentStep: step, currentIndex: index, error: null }));
  }, []);

  const goNext = useCallback(() => {
    setState((s) => {
      const nextIdx = Math.min(s.currentIndex + 1, STEP_ORDER.length - 1);
      return { ...s, currentStep: STEP_ORDER[nextIdx], currentIndex: nextIdx, error: null };
    });
  }, []);

  const goBack = useCallback(() => {
    setState((s) => {
      const prevIdx = Math.max(s.currentIndex - 1, 0);
      return { ...s, currentStep: STEP_ORDER[prevIdx], currentIndex: prevIdx, error: null };
    });
  }, []);

  const setFile = useCallback((file: File, extractedText: string, pageCount: number) => {
    setState((s) => ({
      ...s,
      file,
      fileName: file.name,
      fileSizeKB: Math.round(file.size / 1024),
      extractedText,
      pageCount,
      error: null,
    }));
  }, []);

  const setAvvCaseId = useCallback((id: string) => {
    setState((s) => ({ ...s, avvCaseId: id }));
  }, []);

  const setAnalysisResult = useCallback((result: AvvAssistantResult) => {
    setState((s) => ({ ...s, analysisResult: result, isAnalyzing: false }));
  }, []);

  const setAnalyzing = useCallback((v: boolean) => {
    setState((s) => ({ ...s, isAnalyzing: v, error: v ? null : s.error }));
  }, []);

  const setError = useCallback((error: string) => {
    setState((s) => ({ ...s, error, isAnalyzing: false }));
  }, []);

  const reset = useCallback(() => {
    setState({
      currentStep: "upload",
      currentIndex: 0,
      file: null,
      fileName: "",
      fileSizeKB: 0,
      pageCount: 0,
      extractedText: "",
      avvCaseId: null,
      analysisResult: null,
      error: null,
      isAnalyzing: false,
    });
  }, []);

  return {
    state,
    goTo,
    goNext,
    goBack,
    setFile,
    setAvvCaseId,
    setAnalysisResult,
    setAnalyzing,
    setError,
    reset,
  };
}
