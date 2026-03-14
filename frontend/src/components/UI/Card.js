import React from 'react';

const Card = ({ children, title, subtitle, extra, className = '', bodyClassName = '', headerClassName = '' }) => {
    return (
        <div className={`card border-0 shadow-md ${className}`}>
            {(title || subtitle || extra) && (
                <div className={`card-header bg-white border-0 pt-4 px-4 d-flex align-items-center justify-content-between ${headerClassName}`}>
                    <div>
                        {title && <h5 className="fw-bold mb-0">{title}</h5>}
                        {subtitle && <p className="text-muted small mb-0 mt-1">{subtitle}</p>}
                    </div>
                    {extra && <div className="card-extra">{extra}</div>}
                </div>
            )}
            <div className={`card-body px-4 pb-4 ${bodyClassName}`}>
                {children}
            </div>
        </div>
    );
};

export default Card;
