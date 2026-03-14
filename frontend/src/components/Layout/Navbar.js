import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSignOutAlt, faUserCircle, faSearch, faBell, faEnvelope, faQuestionCircle, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

import { confirmAction } from '../../utils/sweetalert';

const Navbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const result = await confirmAction(
            'Logout',
            'Are you sure you want to end your current session and sign out of the system?',
            'Logout'
        );

        if (result.isConfirmed) {
            logout();
            navigate('/login');
        }
    };

    const getRoleName = (roleId) => {
        switch (roleId) {
            case 1: return 'SUPER ADMIN';
            case 2: return 'ADMINISTRATOR';
            case 3: return 'FACULTY';
            case 4: return 'STUDENT';
            case 5: return 'STAFF';
            default: return 'USER';
        }
    };

    return (
        <nav className="navbar">
            <div className="d-flex align-items-center gap-3">
                {/* Desktop Toggle */}
                <button className="btn btn-link link-dark border-0 shadow-none p-1 d-none d-lg-block" onClick={toggleSidebar}>
                    <FontAwesomeIcon icon={faBars} size="lg" />
                </button>

                {/* Mobile Brand & Toggle */}
                <div className="d-flex align-items-center gap-3 d-lg-none">
                    <FontAwesomeIcon icon={faBars} size="lg" className="text-muted cursor-pointer" onClick={toggleSidebar} />
                    <span className="fw-bold text-dark" style={{ letterSpacing: '-0.5px', fontSize: '1.2rem' }}>
                        Smart<span className="text-primary fw-900">Pathshala</span>
                    </span>
                </div>

                {/* Search Bar */}
                <div className="search-wrapper d-none d-md-flex">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search IDs, records, or faculty..."
                    />
                </div>
            </div>

            {/* Right Side Actions */}
            <div className="nav-actions">

                <div className="vr my-2 mx-2 opacity-10"></div>

                {/* User Dropdown */}
                <div className="dropdown">
                    <div
                        className="d-flex align-items-center gap-3 cursor-pointer p-1 pe-2 rounded-pill hover-bg-light transition-all"
                        role="button"
                        id="userNavDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="text-end d-none d-lg-block">
                            <span className="d-block fw-bold text-dark small mb-0">{user ? (user.username || 'User').toUpperCase() : 'GUEST'}</span>
                            <span className="text-muted d-block" style={{ fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.05em' }}>
                                {user ? getRoleName(user.role_id) : 'VISITOR'}
                            </span>
                        </div>
                        <div className="position-relative">
                            <FontAwesomeIcon icon={faUserCircle} size="2x" className="text-primary opacity-75 shadow-sm rounded-circle" />
                            <div className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle" style={{ width: '10px', height: '10px' }}></div>
                        </div>
                        <FontAwesomeIcon icon={faChevronDown} size="xs" className="text-muted d-none d-sm-block" />
                    </div>

                    <ul className="dropdown-menu dropdown-menu-end border-0 shadow-premium mt-3 p-2" aria-labelledby="userNavDropdown" style={{ borderRadius: '14px', minWidth: '220px' }}>
                        <li>
                            <div className="px-3 py-2 mb-2 border-bottom">
                                <span className="small text-muted fw-bold">SESSION CONTROL</span>
                            </div>
                        </li>
                        <li><Link className="dropdown-item py-2 rounded-2 fw-semibold px-3" to="/profile"><FontAwesomeIcon icon={faUserCircle} className="me-2 text-muted" /> VIEW PROFILE</Link></li>

                        <li><hr className="dropdown-divider opacity-10" /></li>
                        <li>
                            <button className="dropdown-item py-2 rounded-2 fw-semibold px-3 text-danger" onClick={handleLogout}>
                                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> SIGN OUT
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
