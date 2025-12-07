import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { SuperManagerDashboard } from './pages/SuperManagerDashboard';
import { QueueView } from './pages/QueueView';
import { ManagerLogin } from './pages/manager/ManagerLogin';
import { ManagerSignup } from './pages/manager/ManagerSignup';

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

        {/* Other Routes */}
        <Route path="/super-admin" element={<SuperManagerDashboard />} />
        <Route path="/q/:queueId" element={<QueueView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
