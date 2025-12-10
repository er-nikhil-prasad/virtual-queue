import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { QueueView } from './pages/QueueView';

// New Pages
import { Login } from './pages/Login';
import { IndividualSignup } from './pages/onboarding/IndividualSignup';
import { TeamSignup } from './pages/onboarding/TeamSignup';

// Admin / Super Manager
import { SuperProtectedRoute } from './components/layout/SuperProtectedRoute';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CreateQueue } from './pages/super/CreateQueue';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Unified Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup/individual" element={<IndividualSignup />} />
        <Route path="/signup/team" element={<TeamSignup />} />

        {/* Manager (Individual or Team Assistant) Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        </Route>

        {/* Admin / Team Owner Routes */}
        <Route element={<SuperProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/create-queue" element={<CreateQueue />} />
        </Route>

        {/* Redirects for legacy routes */}
        <Route path="/manager/*" element={<Navigate to="/login" replace />} />
        <Route path="/super-admin/*" element={<Navigate to="/login" replace />} />

        {/* Public Queue View */}
        <Route path="/q/:queueId" element={<QueueView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
