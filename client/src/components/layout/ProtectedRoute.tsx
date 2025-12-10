import { Navigate, Outlet } from 'react-router-dom';
import { db } from '../../mockDb';

export const ProtectedRoute = () => {
    // Check if manager is logged in (mock session)
    const manager = db.getManager();

    if (!manager) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
