import { Navigate, Outlet } from 'react-router-dom';
import { getSuperManager } from '../../services/queueService';

export const SuperProtectedRoute = () => {
    const sm = getSuperManager();

    if (!sm) {
        return <Navigate to="/super-admin/login" replace />;
    }

    return <Outlet />;
};
