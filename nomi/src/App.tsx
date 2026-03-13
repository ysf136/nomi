import { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import NomiChat from "./nomi/components/ChatAssistantFAB";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Footer from "./components/layout/Footer";
import useNovaShortcuts from "./hooks/useKeyboardShortcuts";

// Seiten
import Landing from "./Landing";
import Dashboard from "./features/dashboard/Dashboard";
import Projekte from "./features/projects/Projekte";
import Risikoanalysen from "./features/risk-analysis/Risikoanalysen";
import Berichte from "./features/reports/Berichte";
import Einstellungen from "./features/customer/Einstellungen";
import AiActWizard from "./features/compliance/AiActWizard";
import NewsPage from "./features/news/News";
import Demoanfordern from "./features/live-demo/Demoanfordern";
import GespraechVereinbaren from "./features/live-demo/GespraechVereinbaren";
import Login from "./Login";
import Register from "./Register";
import WelcomePage from "./WelcomePage";
import IncidentReport from "./features/incidents/IncidentReport";
import IncidentResult from "./features/incidents/IncidentResult";
import CustomerProfile from "./features/customer/CustomerProfile";
import Training from "./features/training/Training";
import LiveDemo from "./features/live-demo/LiveDemo";
import AvvCheck from "./features/compliance/AvvCheck";
import AvvReport from "./features/compliance/AvvReport";
import AvvWizard from "./features/compliance/avv-wizard/AvvWizard";
import AvvCaseList from "./features/compliance/AvvCaseList";
import NotFound from "./features/NotFound";
import Impressum from "./features/legal/Impressum";
import Datenschutz from "./features/legal/Datenschutz";
import AGB from "./features/legal/AGB";
import CookieBanner from "./components/common/CookieBanner";
import ApprovalQueue from "./features/approval/ApprovalQueue";
import ReviewPanel from "./features/approval/ReviewPanel";
import Verarbeitungstätigkeiten from "./features/customer/Verarbeitungstätigkeiten";

// Simple Auth
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { usePlanAccess } from "./hooks/usePlanAccess";

// Layout mit Navbar + Sidebar
interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const hideSidebarOn = new Set(["/", "/login", "/register", "/impressum", "/datenschutz", "/agb"]); 
  const hideNavbarOn = new Set(["/", "/login", "/register", "/impressum", "/datenschutz", "/agb"]); 
  const hideFooterOn = new Set(["/", "/login", "/register"]);
  const hideChatOn = new Set(["/", "/login", "/register"]);
  const isSidebarHidden = hideSidebarOn.has(location.pathname);
  const isNavbarHidden = hideNavbarOn.has(location.pathname);
  const isFooterHidden = hideFooterOn.has(location.pathname);
  const isChatHidden = hideChatOn.has(location.pathname);
// Aktiviere globale Keyboard Shortcuts
  useNovaShortcuts();

  return (
    <>
      {/* Skip to main content link für Screen Reader */}
      <a href="#main-content" className="skip-to-main">
        Zum Hauptinhalt springen
      </a>
      
      <div style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--nova-bg-gradient)",
        backgroundAttachment: "fixed",
        flexDirection: "column",
      }}>
        <div style={{ display: "flex", flex: 1 }}>
          {!isSidebarHidden && <Sidebar />}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            {!isNavbarHidden && <Navbar />}
            <main
              id="main-content"
              key={location.pathname}
              className="nova-page-enter"
              style={{ padding: isNavbarHidden ? 0 : 24, flex: 1 }}
            >
              {children}
            </main>
            {!isFooterHidden && <Footer />}
          </div>
        </div>
      </div>
      {!isChatHidden && <NomiChat />}
      <CookieBanner />
    </>
  );
}

// Guards
interface RouteGuardProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: RouteGuardProps) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RedirectIfAuthenticated({ children }: RouteGuardProps) {
  const { user } = useAuth();
  if (user) return <Navigate to="/welcome" replace />;
  return <>{children}</>;
}

/** Prüft, ob der Plan die Route erlaubt. Demo → /live-demo, fehlende Berechtigung → /welcome */
function PlanRoute({ children, route }: RouteGuardProps & { route: string }) {
  const { user } = useAuth();
  const { canAccessRoute, isDemo } = usePlanAccess();
  if (!user) return <Navigate to="/login" replace />;
  if (isDemo) return <Navigate to="/live-demo" replace />;
  if (!canAccessRoute(route)) return <Navigate to="/welcome" replace />;
  return <>{children}</>;
}

/** Enterprise-only Route (z.B. Freigaben) */
function EnterpriseRoute({ children }: RouteGuardProps) {
  const { user } = useAuth();
  const { isEnterprise } = usePlanAccess();
  if (!user) return <Navigate to="/login" replace />;
  if (!isEnterprise) return <Navigate to="/welcome" replace />;
  return <>{children}</>;
}

function AppShell() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Öffentlich */}
          <Route path="/" element={<Landing />} />
          <Route path="/live-demo" element={<LiveDemo />} />
          <Route
            path="/login"
            element={
              <RedirectIfAuthenticated>
                <Login />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path="/register"
            element={
              <RedirectIfAuthenticated>
                <Register />
              </RedirectIfAuthenticated>
            }
          />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="/agb" element={<AGB />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/demoanfordern" element={<Demoanfordern />} />
          <Route path="/Gespraech-vereinbaren" element={<GespraechVereinbaren />} />

          {/* Nach Login */}
          <Route
            path="/welcome"
            element={
              <ProtectedRoute>
                <WelcomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PlanRoute route="/dashboard">
                <Dashboard />
              </PlanRoute>
            }
          />
          <Route
            path="/projekte"
            element={
              <PlanRoute route="/projekte">
                <Projekte />
              </PlanRoute>
            }
          />
          <Route
            path="/risikoanalysen"
            element={
              <PlanRoute route="/risikoanalysen">
                <Risikoanalysen />
              </PlanRoute>
            }
          />
          <Route
            path="/berichte"
            element={
              <PlanRoute route="/berichte">
                <Berichte />
              </PlanRoute>
            }
          />
          <Route
            path="/approvals"
            element={
              <EnterpriseRoute>
                <ApprovalQueue />
              </EnterpriseRoute>
            }
          />
          <Route
            path="/approvals/:id"
            element={
              <EnterpriseRoute>
                <ReviewPanel />
              </EnterpriseRoute>
            }
          />
          <Route
            path="/einstellungen"
            element={
              <ProtectedRoute>
                <Einstellungen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-act"
            element={
              <PlanRoute route="/ai-act">
                <AiActWizard />
              </PlanRoute>
            }
          />

          {/* NEU: Vorfall melden & Bewertung */}
          <Route
            path="/vorfall-melden"
            element={
              <PlanRoute route="/vorfall-melden">
                <IncidentReport />
              </PlanRoute>
            }
          />
          <Route
            path="/vorfall-bewertung"
            element={
              <PlanRoute route="/vorfall-melden">
                <IncidentResult />
              </PlanRoute>
            }
          />

          {/* NEU: Kundenprofil */}
          <Route
            path="/customer-profile"
            element={
              <ProtectedRoute>
                <CustomerProfile />
              </ProtectedRoute>
            }
          />

          {/* NEU: Datenschutzschulungen */}
          <Route
            path="/schulungen"
            element={
              <PlanRoute route="/schulungen">
                <Training />
              </PlanRoute>
            }
          />

          {/* NEU: AVV-Prüfung */}
          <Route
            path="/avv-check"
            element={
              <PlanRoute route="/avv-wizard">
                <AvvCheck />
              </PlanRoute>
            }
          />
          <Route
            path="/avv-wizard"
            element={
              <PlanRoute route="/avv-wizard">
                <AvvWizard />
              </PlanRoute>
            }
          />
          <Route
            path="/avv-cases"
            element={
              <PlanRoute route="/avv-cases">
                <AvvCaseList />
              </PlanRoute>
            }
          />
          <Route
            path="/avv-report"
            element={
              <PlanRoute route="/avv-wizard">
                <AvvReport />
              </PlanRoute>
            }
          />
          <Route
            path="/avv-report/:caseId"
            element={
              <PlanRoute route="/avv-wizard">
                <AvvReport />
              </PlanRoute>
            }
          />

          {/* NEU: Verzeichnis der Verarbeitungstätigkeiten */}
          <Route
            path="/verarbeitungstätigkeiten"
            element={
              <PlanRoute route="/verarbeitungstätigkeiten">
                <Verarbeitungstätigkeiten />
              </PlanRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ErrorBoundary>
  );
}
