import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { QueueView } from './pages/QueueView';
import { ManagerLogin } from './pages/manager/ManagerLogin';
import { ManagerSignup } from './pages/manager/ManagerSignup';
import { SuperProtectedRoute } from './components/layout/SuperProtectedRoute';
import { SuperLogin } from './pages/super/SuperLogin';
import { SuperSignup } from './pages/super/SuperSignup';
import { SuperDashboard } from './pages/super/SuperDashboard';
import { CreateQueue } from './pages/super/CreateQueue';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Manager Routes */}
        <Route path="/manager" element={<Navigate to="/manager/login" replace />} />
        <Route path="/manager/login" element={<ManagerLogin />} />
        <Route path="/manager/signup" element={<ManagerSignup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        </Route>

        {/* Super Manager / Business Owner Routes */}
        <Route path="/super-admin" element={<Navigate to="/super-admin/login" replace />} />
        <Route path="/super-admin/login" element={<SuperLogin />} />
        <Route path="/super-admin/signup" element={<SuperSignup />} />

        <Route element={<SuperProtectedRoute />}>
          <Route path="/super-admin/dashboard" element={<SuperDashboard />} />
          <Route path="/super-admin/create-queue" element={<CreateQueue />} />
        </Route>

        {/* Other Routes */}
        <Route path="/q/:queueId" element={<QueueView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
