import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = '',
    onClick,
    type = 'button',
    className = '',
    disabled = false,
    icon = null,
    loading = false
}) => {
    const variantClass = variant ? `btn-${variant}` : 'btn-primary';
    const sizeClass = size ? `btn-${size}` : '';

    return (
        <button
            type={type}
            className={`btn ${variantClass} ${sizeClass} ${className} ${loading ? 'disabled' : ''}`}
            onClick={onClick}
            disabled={disabled || loading}
        >
            {loading ? (
                <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Loading...
                </>
            ) : (
                <>
                    {icon && <span className="me-2">{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;
