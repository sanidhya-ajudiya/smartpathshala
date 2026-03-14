import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faHome } from '@fortawesome/free-solid-svg-icons';

const PageHeader = ({ title, subtitle, breadcrumbs = [], action }) => {
    return (
        <div className="page-header d-md-flex align-items-center justify-content-between mb-5 mt-2 animate-up">
            <div>
                {/* Breadcrumbs */}
                <nav aria-label="breadcrumb" className="mb-2">
                    <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
                        <li className="breadcrumb-item">
                            <Link to="/" className="text-muted text-decoration-none">
                                <FontAwesomeIcon icon={faHome} className="me-1" />
                                Home
                            </Link>
                        </li>
                        {breadcrumbs.map((crumb, idx) => (
                            <li
                                key={idx}
                                className={`breadcrumb-item d-flex align-items-center ${idx === breadcrumbs.length - 1 ? 'active' : ''}`}
                                aria-current={idx === breadcrumbs.length - 1 ? 'page' : undefined}
                            >
                                <FontAwesomeIcon icon={faChevronRight} className="mx-2 text-muted" style={{ fontSize: '0.65rem' }} />
                                {idx === breadcrumbs.length - 1 ? (
                                    <span className="text-primary fw-semibold">{crumb.text}</span>
                                ) : (
                                    <Link to={crumb.link} className="text-muted text-decoration-none hover-primary">
                                        {crumb.text}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>

                <h1 className="display-6 mb-1">{title}</h1>
                {subtitle && <p className="text-muted lead mb-0 fs-6">{subtitle}</p>}
            </div>

            {action && (
                <div className="mt-4 mt-md-0">
                    {action}
                </div>
            )}
        </div>
    );
};

export default PageHeader;
