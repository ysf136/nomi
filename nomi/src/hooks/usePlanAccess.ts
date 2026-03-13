/**
 * NOVA — Plan-basierte Zugriffskontrolle
 *
 * Definiert, welche Routen / Features welchem Plan zur Verfügung stehen.
 * Demo: Nur Vorschau (Live-Demo), kein eigenes Arbeiten.
 * Pro:  Alle Kernfunktionen außer Human-in-the-Loop (Freigaben).
 * Enterprise: Alles inkl. Freigaben, Reviewer-Dashboard, Audit-Trail.
 */

import { useAuth, type PlanId } from "../auth/AuthContext";

/** Sidebar-Routen, die ein Plan sehen darf. */
const PLAN_ROUTES: Record<PlanId, Set<string>> = {
  demo: new Set([
    "/dashboard",
    "/einstellungen",
  ]),
  pro: new Set([
    "/dashboard",
    "/vorfall-melden",
    "/ai-act",
    "/avv-wizard",
    "/avv-cases",
    "/verarbeitungstätigkeiten",
    "/berichte",
    "/schulungen",
    "/projekte",
    "/risikoanalysen",
    "/einstellungen",
  ]),
  enterprise: new Set([
    "/dashboard",
    "/vorfall-melden",
    "/ai-act",
    "/avv-wizard",
    "/avv-cases",
    "/verarbeitungstätigkeiten",
    "/berichte",
    "/schulungen",
    "/projekte",
    "/risikoanalysen",
    "/approvals",
    "/einstellungen",
  ]),
};

/** Routen, die IMMER erlaubt sind (unabhängig vom Plan). */
const ALWAYS_ALLOWED = new Set([
  "/welcome",
  "/live-demo",
  "/einstellungen",
  "/customer-profile",
]);

export function usePlanAccess() {
  const { user } = useAuth();
  const plan: PlanId = user?.plan ?? "demo";

  /** Darf der User diese Sidebar-Route sehen? */
  function canAccessRoute(route: string): boolean {
    if (ALWAYS_ALLOWED.has(route)) return true;
    return PLAN_ROUTES[plan]?.has(route) ?? false;
  }

  /** Ist der User im Demo-Plan? */
  const isDemo = plan === "demo";
  const isPro = plan === "pro";
  const isEnterprise = plan === "enterprise";

  /** Hat der User Zugriff auf Human-in-the-Loop Funktionen? */
  const hasHumanInTheLoop = plan === "enterprise";

  /** Hat der User Zugriff auf Reviewer/Admin Features? */
  const isReviewer = user?.role === "reviewer" || user?.role === "admin";

  return {
    plan,
    isDemo,
    isPro,
    isEnterprise,
    hasHumanInTheLoop,
    isReviewer,
    canAccessRoute,
  };
}
