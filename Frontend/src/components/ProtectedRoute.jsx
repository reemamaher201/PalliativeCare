import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element, allowedRoles, ...rest }) => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userType)) {
        return <Navigate to="/login" replace />; // أو صفحة أخرى مثل /unauthorized
    }

    return <Route {...rest} element={<Element />} />;
};

export default ProtectedRoute;