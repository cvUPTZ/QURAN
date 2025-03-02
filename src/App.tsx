import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";

// Lazy load components
const AttendancePage = lazy(
  () => import("./components/attendance/AttendancePage"),
);
const QuranTrackingPage = lazy(
  () => import("./components/quran/QuranTrackingPage"),
);
const ReportsPage = lazy(() => import("./components/reports/ReportsPage"));
const SettingsPage = lazy(() => import("./components/settings/SettingsPage"));
const ParentDashboard = lazy(
  () => import("./components/parents/ParentDashboard"),
);
const CommunicationHub = lazy(
  () => import("./components/communication/CommunicationHub"),
);

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/quran-tracking" element={<QuranTrackingPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/parent-dashboard" element={<ParentDashboard />} />
          <Route path="/communication" element={<CommunicationHub />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
