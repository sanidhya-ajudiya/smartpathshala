import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser, faEnvelope, faPhone, faMapMarkerAlt,
    faCalendarAlt, faShieldAlt, faEdit, faCamera,
    faKey, faBell, faCheckCircle, faCog, faFileAlt,
    faBook, faMoneyBillWave
} from '@fortawesome/free-solid-svg-icons';
import PageHeader from '../components/UI/PageHeader';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';

const Profile = () => {
    const { user, loading } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    const getRoleName = (roleId) => {
        switch (roleId) {
            case 1: return 'Super Admin';
            case 2: return 'Administrator';
            case 3: return 'Teacher';
            case 4: return 'Student';
            case 5: return 'Staff';
            default: return 'User';
        }
    };

    return (
        <div className="container-fluid animate-fade-in">
            <PageHeader
                title="My Profile"
                subtitle="Manage your personal details, secure your account, and view your professional summary."
                action={
                    <button className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm border-0 transition-all hover-up">
                        <FontAwesomeIcon icon={faEdit} />
                        <span>Edit Profile</span>
                    </button>
                }
            />

            <div className="row g-4 mt-2">
                {/* Left Column: Profile Card */}
                <div className="col-lg-4">
                    <Card className="border-0 shadow-sm text-center p-4">
                        <div className="position-relative d-inline-block mb-4">
                            <div className="rounded-circle overflow-hidden shadow-lg mx-auto" style={{ width: '150px', height: '150px', border: '5px solid #fff' }}>
                                <img
                                    src={`https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=random&size=150`}
                                    alt="Profile"
                                    className="w-100 h-100 object-fit-cover"
                                />
                            </div>
                            <button className="btn btn-primary btn-sm rounded-circle position-absolute bottom-0 end-0 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
                                <FontAwesomeIcon icon={faCamera} size="xs" />
                            </button>
                        </div>
                        <h4 className="fw-bold text-dark mb-1">{user?.first_name} {user?.last_name || user?.username}</h4>
                        <p className="text-muted mb-3">@{user?.username}</p>
                        <Badge variant="primary" className="px-3 py-2 rounded-pill mb-4 text-primary fw-bold">

                            {getRoleName(user?.role_id)}
                        </Badge>

                        <div className="d-flex justify-content-center gap-2 mt-2">
                            <div className="flex-fill p-3 rounded-3 bg-light border border-white">
                                <span className="d-block fw-bold text-dark h5 mb-0">12</span>
                                <span className="small text-muted fw-semibold">Tasks</span>
                            </div>
                            <div className="flex-fill p-3 rounded-3 bg-light border border-white">
                                <span className="d-block fw-bold text-dark h5 mb-0">8</span>
                                <span className="small text-muted fw-semibold">Events</span>
                            </div>
                            <div className="flex-fill p-3 rounded-3 bg-light border border-white">
                                <span className="d-block fw-bold text-dark h5 mb-0">95%</span>
                                <span className="small text-muted fw-semibold">Score</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="border-0 shadow-sm mt-4 p-4" title="Contact Information">
                        <div className="mb-4 d-flex align-items-center">
                            <div className="p-2 rounded-3 bg-primary-soft text-primary me-3">
                                <FontAwesomeIcon icon={faEnvelope} />
                            </div>
                            <div>
                                <small className="text-muted d-block fw-bold tracking-wider">EMAIL ADDRESS</small>
                                <span className="text-dark fw-semibold">{user?.email || 'N/A'}</span>
                            </div>
                        </div>
                        <div className="mb-4 d-flex align-items-center">
                            <div className="p-2 rounded-3 bg-info-soft text-info me-3">
                                <FontAwesomeIcon icon={faPhone} />
                            </div>
                            <div>
                                <small className="text-muted d-block fw-bold tracking-wider">PHONE NUMBER</small>
                                <span className="text-dark fw-semibold">{user?.phone || '+91 98765 43210'}</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="p-2 rounded-3 bg-warning-soft text-warning me-3">
                                <FontAwesomeIcon icon={faMapMarkerAlt} />
                            </div>
                            <div>
                                <small className="text-muted d-block fw-bold tracking-wider">LOCATION</small>
                                <span className="text-dark fw-semibold">Mumbai, India</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Information Tabs */}
                <div className="col-lg-8">
                    <Card className="border-0 shadow-sm overflow-hidden" bodyClassName="p-0">
                        {/* Tab Navigation */}
                        <div className="px-4 pt-2 border-bottom">
                            <ul className="nav nav-tabs custom-premium-tabs" id="profileTabs">

                                {['personal detail'].map((tab) => (
                                    <li className="nav-item" key={tab}>
                                        <button
                                            className={`nav-link ${activeTab === tab || (activeTab === 'overview' && tab === 'personal detail') ? 'active' : ''}`}
                                            onClick={() => setActiveTab('overview')}
                                        >
                                            {tab.toUpperCase()}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Tab Content */}
                        <div className="p-4">
                            {activeTab === 'overview' && (
                                <div className="animate-fade-in">
                                    <h5 className="fw-bold mb-4 text-dark">Personal Information</h5>
                                    <div className="row g-4">
                                        {[
                                            { label: 'Full Name', value: (user?.first_name || user?.last_name) ? `${user?.first_name || ''} ${user?.last_name || ''}`.trim() : (user?.username || 'John Doe'), icon: faUser },
                                            { label: 'Role Authority', value: getRoleName(user?.role_id), icon: faShieldAlt },
                                            { label: 'Joining Date', value: '12 Aug 2023', icon: faCalendarAlt },
                                            { label: 'ID Number', value: user?.role_id === 4 ? `STU-${new Date().getFullYear()}-045` : `EMP-${new Date().getFullYear()}-112`, icon: faShieldAlt },
                                            { label: 'Department', value: user?.role_id === 3 ? 'Mathematics' : 'Administration', icon: faCheckCircle },
                                            { label: 'Status', value: 'Active', icon: faCheckCircle, isStatus: true },
                                        ].map((item, i) => (
                                            <div className="col-md-6" key={i}>
                                                <div className="p-3 rounded-3 bg-light border border-white">
                                                    <div className="d-flex align-items-center mb-1">
                                                        <FontAwesomeIcon icon={item.icon} className="text-primary me-2 opacity-50 small" />
                                                        <small className="text-muted fw-bold tracking-wider">{item.label.toUpperCase()}</small>
                                                    </div>
                                                    {item.isStatus ? (
                                                        <Badge variant="success" className="px-3">{item.value}</Badge>
                                                    ) : (
                                                        <p className="mb-0 fw-bold text-dark">{item.value}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <h5 className="fw-bold mt-5 mb-4 text-dark">About Me</h5>
                                    <p className="text-muted leading-relaxed">
                                        {user?.role_id === 3 ?
                                            "Experienced faculty member specializing in advanced mathematics. Passionate about leveraging digital tools to enhance student learning outcomes and streamlining classroom management." :
                                            "Dedicated education professional focused on organizational excellence. Committed to maintaining a seamless administrative experience for faculty, students, and parents at Smart Pathshala."
                                        }
                                    </p>

                                    <div className="mt-5 p-4 rounded-4 bg-primary-soft border border-primary border-opacity-10 shadow-sm">
                                        <div className="d-flex align-items-center">
                                            <div className="p-3 rounded-circle bg-primary text-white me-4 shadow-sm">
                                                <FontAwesomeIcon icon={faShieldAlt} size="lg" />
                                            </div>
                                            <div>
                                                <h6 className="fw-bold mb-1 text-primary-emphasis">Account Security</h6>
                                                <p className="small text-muted mb-0">Your account is fully verified and protected by system-wide security policies.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}



                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile;
