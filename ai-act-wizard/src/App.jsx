import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import NomiChat from "./nomi/components/ChatAssistantFAB";

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
import WelcomePage from "./WelcomePage";
import IncidentReport from "./features/incidents/IncidentReport";
import IncidentResult from "./features/incidents/IncidentResult";
import CustomerProfile from "./features/customer/CustomerProfile";
import Training from "./features/training/Training";
import LiveDemo from "./features/live-demo/LiveDemo";
import AvvCheck from "./features/compliance/AvvCheck";
import AvvReport from "./features/compliance/AvvReport";

// Simple Auth
import { AuthProvider, useAuth } from "./auth/AuthContext";

// Layout mit Navbar + Sidebar
function Layout({ children }) {
  const location = useLocation();
  const hideSidebarOn = new Set(["/", "/welcome"]); // Landing & Welcome ohne Sidebar
  const hideNavbarOn = new Set(["/"]); // Landing hat eigene Navbar
  const isSidebarHidden = hideSidebarOn.has(location.pathname);
  const isNavbarHidden = hideNavbarOn.has(location.pathname);

  return (
    <>
      <div style={{ display: "flex", minHeight: "100vh", background: "#F8FAFC" }}>
        {!isSidebarHidden && <Sidebar />}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {!isNavbarHidden && <Navbar />}
          <main style={{ padding: isNavbarHidden ? 0 : 24 }}>{children}</main>
        </div>
      </div>
      <NomiChat />
    </>
  );
}

// Guards
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
function RedirectIfAuthenticated({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/welcome" replace />;
  return children;
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
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projekte"
            element={
              <ProtectedRoute>
                <Projekte />
              </ProtectedRoute>
            }
          />
          <Route
            path="/risikoanalysen"
            element={
              <ProtectedRoute>
                <Risikoanalysen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/berichte"
            element={
              <ProtectedRoute>
                <Berichte />
              </ProtectedRoute>
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
              <ProtectedRoute>
                <AiActWizard />
              </ProtectedRoute>
            }
          />

          {/* NEU: Vorfall melden & Bewertung */}
          <Route
            path="/vorfall-melden"
            element={
              <ProtectedRoute>
                <IncidentReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vorfall-bewertung"
            element={
              <ProtectedRoute>
                <IncidentResult />
              </ProtectedRoute>
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
              <ProtectedRoute>
                <Training />
              </ProtectedRoute>
            }
          />

          {/* NEU: AVV-Prüfung */}
          <Route
            path="/avv-check"
            element={
              <ProtectedRoute>
                <AvvCheck />
              </ProtectedRoute>
            }
          />
          <Route
            path="/avv-report"
            element={
              <ProtectedRoute>
                <AvvReport />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<div style={{ padding: 24 }}>Seite nicht gefunden</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}