import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome, faUserGraduate, faChalkboardTeacher,
    faUsers, faClock, faBus, faMoneyBillWave, faBook, faWarehouse, faCog, faTimes, faGraduationCap
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ collapsed, showMobile, toggleMobileSidebar }) => {
    const { hasPermission } = useAuth();

    // Define menu items with required permissions
    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: faHome, permission: null },
        { name: 'Students', path: '/students', icon: faUserGraduate, permission: 'STUDENT_VIEW' },
        { name: 'Teachers', path: '/teachers', icon: faChalkboardTeacher, permission: 'TEACHER_VIEW' },
        { name: 'Staff Management', path: '/staff', icon: faUsers, permission: 'USER_MANAGE' },
        { name: 'Attendance', path: '/attendance', icon: faClock, permission: 'ATTENDANCE_VIEW' },
        { name: 'Fees & Finance', path: '/fees', icon: faMoneyBillWave, permission: 'FEE_VIEW' },
        { name: 'Examinations', path: '/exams', icon: faBook, permission: 'EXAM_VIEW' },
        { name: 'Transport', path: '/transport', icon: faBus, permission: 'TRANSPORT_VIEW' },
        { name: 'Inventory', path: '/inventory', icon: faWarehouse, permission: 'INVENTORY_VIEW' },
        { name: 'Settings', path: '/settings', icon: faCog, permission: 'ROLE_MANAGE' },
    ];

    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''} ${showMobile ? 'show' : ''}`}>
            <div className="sidebar-header">
                <div className="d-flex align-items-center gap-2 overflow-hidden">
                    <div className="brand-icon-wrapper">
                        <FontAwesomeIcon icon={faGraduationCap} className="text-primary" />
                    </div>
                    {!collapsed && (
                        <span className="sidebar-brand text-nowrap">
                            Smart<span className="text-primary fw-900">Pathshala</span>
                        </span>
                    )}
                </div>
                
                {/* Mobile Close Button */}
                <button 
                    className="btn btn-link d-lg-none text-muted p-0 ms-2" 
                    onClick={toggleMobileSidebar}
                    aria-label="Close Sidebar"
                >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
            </div>

            <div className="sidebar-nav">
                <ul className="flex-grow-1">
                    {menuItems.slice(0, -1).map((item, index) => {
                        if (item.permission && !hasPermission(item.permission)) {
                            return null;
                        }

                        return (
                            <li key={index} className="nav-item">
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                >
                                    <div className="nav-icon">
                                        <FontAwesomeIcon icon={item.icon} />
                                    </div>
                                    <span className="nav-text">{item.name}</span>
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>

                <div className="sidebar-footer">
                    {menuItems.slice(-1).map((item, index) => {
                        if (item.permission && !hasPermission(item.permission)) {
                            return null;
                        }

                        return (
                            <NavLink
                                key="settings"
                                to={item.path}
                                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                            >
                                <div className="nav-icon">
                                    <FontAwesomeIcon icon={item.icon} />
                                </div>
                                <span className="nav-text">{item.name}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
