import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { WalletContext } from './WalletContext';

const ProtectedRoute = ({ children, roles }) => {
    const { account, role } = useContext(WalletContext);

    if (!account) {
        // User is not signed in
        return <Navigate to="/" />;
    }

    if (roles && !roles.includes(role)) {
        // User does not have the required role
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default ProtectedRoute;
