/**
 * ProtectedRoute — Re-export aus AuthContext.
 *
 * Hinweis: Die eigentliche Route-Guard-Logik befindet sich inline in App.tsx
 * (ProtectedRoute, PlanRoute, EnterpriseRoute). Diese Datei existiert
 * als Konvention und Re-Export.
 */
export { useAuth } from "./AuthContext";
export type { PlanId, RoleId } from "./AuthContext";
