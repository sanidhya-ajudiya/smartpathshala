import React from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * A wrapper component that only renders children if the logged-in user 
 * has the required permission.
 * 
 * @param {string} to - The permission required (e.g., 'STUDENT_CREATE')
 * @param {ReactNode} children - The content to hide/show
 * @param {ReactNode} fallback - Optional content to show if permission is denied
 */
const Restricted = ({ to, children, fallback = null }) => {
    const { hasPermission } = useAuth();

    if (!to) {
        return children;
    }

    if (hasPermission(to)) {
        return children;
    }

    return fallback;
};

export default Restricted;
