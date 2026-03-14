import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    const location = useLocation();

    // Close mobile sidebar on route change
    useEffect(() => {
        setShowMobileSidebar(false);
    }, [location]);

    const toggleSidebar = () => {
        if (window.innerWidth < 992) {
            setShowMobileSidebar(!showMobileSidebar);
        } else {
            setSidebarCollapsed(!sidebarCollapsed);
        }
    };

    return (
        <div className="app-container">
            {/* Mobile Overlay */}
            <div
                className={`sidebar-overlay ${showMobileSidebar ? 'show' : ''}`}
                onClick={() => setShowMobileSidebar(false)}
            ></div>

            <Sidebar 
                collapsed={sidebarCollapsed} 
                showMobile={showMobileSidebar} 
                toggleMobileSidebar={() => setShowMobileSidebar(false)} 
            />

            <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
                <Navbar toggleSidebar={toggleSidebar} />

                <main className="page-content">
                    <Outlet /> {/* Renders the nested routes */}
                </main>
            </div>
        </div>
    );
};

export default Layout;
