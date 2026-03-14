import React from 'react';

const Badge = ({ children, variant = 'primary', className = '', soft = true }) => {
    const badgeClass = soft ? `badge-soft-${variant}` : `bg-${variant}`;

    return (
        <span className={`badge ${badgeClass} px-3 py-2 rounded-3 border ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
