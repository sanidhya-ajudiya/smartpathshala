import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCog, faUserShield, faSchool, faBell, faDatabase,
    faPalette, faShieldAlt, faEnvelope, faGlobe, faSave,
    faHistory, faCheckCircle, faToggleOn, faToggleOff, faTrashAlt,
    faSearch, faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import PageHeader from '../components/UI/PageHeader';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Select from '../components/UI/Select';
import Badge from '../components/UI/Badge';
import { showSuccess, showError, confirmAction } from '../utils/sweetalert';
import roleService from '../services/roleService';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [saving, setSaving] = useState(false);

    // RBAC State
    const [roles, setRoles] = useState([]);
    const [allPermissions, setAllPermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [userSearchResults, setUserSearchResults] = useState([]);

    useEffect(() => {
        if (activeTab === 'roles') {
            fetchRoles();
        }
    }, [activeTab]);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            showSuccess('Orchestration Sync', 'System preferences and institutional configurations have been synchronized successfully across all nodes.');
        }, 1500);
    };

    const fetchRoles = async () => {
        try {
            const data = await roleService.getAllRoles();
            setRoles(data.roles);
            setAllPermissions(data.allPermissions);
            if (data.roles.length > 0 && !selectedRole) {
                // Default to Admin or first role
                const adminRole = data.roles.find(r => r.name === 'Admin') || data.roles[0];
                setSelectedRole(adminRole);
            }
        } catch (error) {
            console.error(error);
            showError('Sync Error', 'Failed to load roles and permissions.');
        }
    };

    const handlePermissionToggle = async (permissionId) => {
        if (!selectedRole) return;

        // Calculate new permissions
        const isHas = selectedRole.permission_ids.includes(permissionId);
        let newPermissions;

        if (isHas) {
            newPermissions = selectedRole.permission_ids.filter(id => id !== permissionId);
        } else {
            newPermissions = [...selectedRole.permission_ids, permissionId];
        }

        // Optimistic Update
        const updatedRole = { ...selectedRole, permission_ids: newPermissions };
        setRoles(roles.map(r => r.id === selectedRole.id ? updatedRole : r));
        setSelectedRole(updatedRole);

        try {
            await roleService.updateRolePermissions(selectedRole.id, newPermissions);
            // showSuccess('Updated', 'Permission matrix updated.'); 
        } catch (error) {
            fetchRoles(); // Revert on error
            showError('Update Failed', 'Could not save permission change.');
        }
    };

    const handleUserSearch = async (e) => {
        const query = e.target.value;
        setUserSearchQuery(query);
        if (query.length > 2) {
            try {
                const data = await roleService.searchUsers(query);
                setUserSearchResults(data.users);
            } catch (error) {
                console.error(error);
            }
        } else {
            setUserSearchResults([]);
        }
    };

    const handlePromoteUser = async (user, roleId) => {
        const roleName = roles.find(r => r.id === roleId)?.name || 'Role';

        const result = await confirmAction(
            'Change User Role',
            `Are you sure you want to assign the role of ${roleName} to ${user.username}?`,
            'Yes, Assign'
        );

        if (result.isConfirmed) {
            try {
                await roleService.updateUserRole(user.id, roleId);
                showSuccess('Role Assigned', `${user.username} is now a ${roleName}.`);
                setUserSearchQuery('');
                setUserSearchResults([]);
            } catch (error) {
                showError('Action Failed', 'Could not update user role.');
            }
        }
    };

    const sideMenuItems = [
        { id: 'general', label: 'Institutional Identity', icon: faSchool },
        { id: 'roles', label: 'Roles & Permissions', icon: faUserShield },
        { id: 'security', label: 'Security Protocols', icon: faShieldAlt },
        { id: 'notifications', label: 'Alert Matrix', icon: faBell },
        { id: 'appearance', label: 'Visual Aesthetics', icon: faPalette },
        { id: 'database', label: 'Data Intelligence', icon: faDatabase }
    ];

    return (
        <div className="container-fluid">
            <PageHeader
                title="System Orchestration"
                subtitle="Fine-tune institutional parameters, security protocols, and global configurations."
                breadcrumbs={[{ text: 'Settings', link: '/settings' }]}
                action={
                    <Button
                        icon={!saving && <FontAwesomeIcon icon={faSave} />}
                        onClick={handleSave}
                        loading={saving}
                    >
                        {saving ? 'Synchronizing...' : 'Save Configuration'}
                    </Button>
                }
            />

            <div className="row g-4">
                {/* Sidebar Navigation */}
                <div className="col-lg-3">
                    <Card bodyClassName="p-2">
                        <div className="nav flex-column nav-pills">
                            {sideMenuItems.map(item => (
                                <button
                                    key={item.id}
                                    className={`btn w-100 text-start d-flex align-items-center mb-1 px-3 py-2 border-0 rounded-3 transition-all ${activeTab === item.id ? 'bg-primary text-white shadow-sm fw-bold' : 'bg-transparent text-muted'}`}
                                    onClick={() => setActiveTab(item.id)}
                                >
                                    <FontAwesomeIcon icon={item.icon} className={`me-3 ${activeTab === item.id ? 'text-white' : 'text-primary'}`} style={{ width: '20px' }} />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </Card>

                    <Card bodyClassName="p-4 mt-4 bg-primary text-white overflow-hidden position-relative shadow-premium">
                        <div className="position-relative z-1">
                            <h6 className="fw-bold mb-3 opacity-75 text-uppercase small tracking-wider">System Integrity</h6>
                            <div className="d-flex align-items-center mb-3">
                                <FontAwesomeIcon icon={faCheckCircle} className="me-2 text-success" />
                                <span className="small">Engine Version: 2.4.0-Stable</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <FontAwesomeIcon icon={faHistory} className="me-2 opacity-75" />
                                <span className="small">Last sync: 12m ago</span>
                            </div>
                        </div>
                        <FontAwesomeIcon icon={faCog} className="position-absolute opacity-10" style={{ fontSize: '8rem', right: '-1rem', bottom: '-1rem' }} />
                    </Card>
                </div>

                {/* Content Area */}
                <div className="col-lg-9">
                    <Card bodyClassName="p-4 p-md-5">
                        {activeTab === 'general' && (
                            <div className="animate-up">
                                <div className="d-flex align-items-center mb-4 pb-2 border-bottom">
                                    <div className="bg-primary-soft text-primary p-3 rounded-3 me-4">
                                        <FontAwesomeIcon icon={faSchool} size="lg" />
                                    </div>
                                    <div>
                                        <h4 className="fw-bold mb-0 text-dark">Institutional Identity</h4>
                                        <p className="text-muted small mb-0">Configure official name, credentials and locale preferences.</p>
                                    </div>
                                </div>

                                <form>
                                    <div className="row g-4 mt-2">
                                        <div className="col-md-6">
                                            <Input label="Educational Institution Name" defaultValue="SmartPathshala International" />
                                        </div>
                                        <div className="col-md-6">
                                            <Input label="Academic Accreditation ID" defaultValue="SP-EDU-2024-X1" />
                                        </div>
                                        <div className="col-12">
                                            <Input label="Official Registry Email" type="email" defaultValue="administration@smartpathshala.edu" icon={<FontAwesomeIcon icon={faEnvelope} />} />
                                        </div>
                                        <div className="col-12">
                                            <Input label="Physical Campus Address" rows={3} defaultValue="Academic Heights, Knowledge Park, Sector 42, New Delhi, India" />
                                        </div>
                                        <div className="col-md-4">
                                            <Select label="Primary Locale" defaultValue="en" options={[
                                                { label: 'English (Global)', value: 'en' },
                                                { label: 'Hindi (India)', value: 'hi' }
                                            ]} />
                                        </div>
                                        <div className="col-md-4">
                                            <Select label="Temporal Zone" defaultValue="ist" options={[
                                                { label: '(GMT+05:30) Mumbai', value: 'ist' },
                                                { label: '(GMT+00:00) UTC', value: 'utc' }
                                            ]} />
                                        </div>
                                        <div className="col-md-4">
                                            <Select label="Currency Notation" defaultValue="inr" options={[
                                                { label: 'INR (₹)', value: 'inr' },
                                                { label: 'USD ($)', value: 'usd' }
                                            ]} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'roles' && (
                            <div className="animate-up">
                                <div className="d-flex align-items-center mb-4 pb-2 border-bottom">
                                    <div className="bg-success-soft text-success p-3 rounded-3 me-4">
                                        <FontAwesomeIcon icon={faUserShield} size="lg" />
                                    </div>
                                    <div>
                                        <h4 className="fw-bold mb-0 text-dark">RBAC Configuration</h4>
                                        <p className="text-muted small mb-0">Manage system roles, granular permissions, and user promotions.</p>
                                    </div>
                                </div>

                                {/* Role Selector */}
                                <div className="d-flex gap-2 mb-4 overflow-auto pb-2">
                                    {roles.map(role => (
                                        <button
                                            key={role.id}
                                            className={`btn btn-sm fw-bold px-3 py-2 rounded-pill ${selectedRole?.id === role.id ? 'btn-dark' : 'btn-light text-muted'}`}
                                            onClick={() => setSelectedRole(role)}
                                        >
                                            {role.name}
                                        </button>
                                    ))}
                                </div>

                                {selectedRole && (
                                    <div className="row g-4">
                                        <div className="col-md-8">
                                            <h6 className="fw-bold text-uppercase small text-muted mb-3 border-bottom pb-2">
                                                Permissions Matrix for {selectedRole.name}
                                            </h6>
                                            <div className="card bg-light border-0 p-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                                <div className="row g-3">
                                                    {allPermissions.map(perm => (
                                                        <div key={perm.id} className="col-md-6">
                                                            <div className="form-check form-switch cursor-pointer">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id={`perm-${perm.id}`}
                                                                    checked={selectedRole.permission_ids.includes(perm.id)}
                                                                    onChange={() => handlePermissionToggle(perm.id)}
                                                                />
                                                                <label className="form-check-label small fw-semibold" htmlFor={`perm-${perm.id}`}>
                                                                    {perm.name}
                                                                    <div className="small text-muted fw-normal" style={{ fontSize: '0.7rem' }}>
                                                                        {perm.description}
                                                                    </div>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <h6 className="fw-bold text-uppercase small text-muted mb-3 border-bottom pb-2">
                                                Promote Users to {selectedRole.name}
                                            </h6>
                                            <div className="card border-light shadow-sm p-3">
                                                <Input
                                                    label="Search User"
                                                    placeholder="Username, First Name..."
                                                    value={userSearchQuery}
                                                    onChange={handleUserSearch}
                                                    icon={<FontAwesomeIcon icon={faSearch} />}
                                                />

                                                {userSearchResults.length > 0 && (
                                                    <div className="list-group mt-2">
                                                        {userSearchResults.map(u => (
                                                            <div key={u.id} className="list-group-item d-flex justify-content-between align-items-center p-2 border-0 bg-light mb-1 rounded-2">
                                                                <div>
                                                                    <div className="fw-bold small">{u.username}</div>
                                                                    <div className="text-muted" style={{ fontSize: '0.65rem' }}>{u.first_name} {u.last_name}</div>
                                                                </div>
                                                                {u.role_id !== selectedRole.id && (
                                                                    <button
                                                                        className="btn btn-xs btn-primary py-1 px-2 rounded-2"
                                                                        onClick={() => handlePromoteUser(u, selectedRole.id)}
                                                                    >
                                                                        <FontAwesomeIcon icon={faUserPlus} />
                                                                    </button>
                                                                )}
                                                                {u.role_id === selectedRole.id && (
                                                                    <span className="badge bg-success-soft text-success"><FontAwesomeIcon icon={faCheckCircle} /></span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="mt-3 p-3 bg-warning-soft rounded-3">
                                                    <div className="small fw-bold text-warning-emphasis mb-1">
                                                        <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
                                                        Caution
                                                    </div>
                                                    <p className="small text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                                                        Assigning the <strong>{selectedRole.name}</strong> role will immediately grant all associated permissions defined on the left.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="animate-up">
                                <div className="d-flex align-items-center mb-4 pb-2 border-bottom">
                                    <div className="bg-warning-soft text-warning p-3 rounded-3 me-4">
                                        <FontAwesomeIcon icon={faShieldAlt} size="lg" />
                                    </div>
                                    <div>
                                        <h4 className="fw-bold mb-0 text-dark">Security Protocols</h4>
                                        <p className="text-muted small mb-0">Advanced protection mechanisms and access controls.</p>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    {[
                                        { title: 'Multi-Factor Authentication (MFA)', desc: 'Secondary verification for all administrative accounts.', enabled: true },
                                        { title: 'Password Entropy Check', desc: 'Require complex credentials for all faculty and staff.', enabled: true },
                                        { title: 'Session Auto-Invalidation', desc: 'Terminate idle administrative sessions after 30 minutes.', enabled: false },
                                        { title: 'Data Encryption at Rest', desc: 'Advanced AES-256 bit encryption for all database records.', enabled: true }
                                    ].map((policy, idx) => (
                                        <div key={idx} className={`d-flex align-items-center justify-content-between py-4 ${idx !== 0 ? 'border-top' : ''}`}>
                                            <div>
                                                <h6 className="fw-bold text-dark mb-1">{policy.title}</h6>
                                                <p className="text-muted small mb-0">{policy.desc}</p>
                                            </div>
                                            <div style={{ cursor: 'pointer' }}>
                                                <FontAwesomeIcon
                                                    icon={policy.enabled ? faToggleOn : faToggleOff}
                                                    className={policy.enabled ? 'text-primary' : 'text-muted'}
                                                    size="2x"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="animate-up">
                                <div className="d-flex align-items-center mb-4 pb-2 border-bottom">
                                    <div className="bg-info-soft text-info p-3 rounded-3 me-4">
                                        <FontAwesomeIcon icon={faBell} size="lg" />
                                    </div>
                                    <div>
                                        <h4 className="fw-bold mb-0 text-dark">Alert Matrix</h4>
                                        <p className="text-muted small mb-0">Communication channels for critical system events.</p>
                                    </div>
                                </div>

                                <div className="table-responsive mt-3">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th className="border-0 bg-light rounded-start ps-4">Event Categorization</th>
                                                <th className="border-0 bg-light text-center">Email</th>
                                                <th className="border-0 bg-light text-center">SMS</th>
                                                <th className="border-0 bg-light text-center rounded-end pe-4">Push</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { event: 'New Enrollment Success', email: true, sms: false, push: true },
                                                { event: 'Fee Payment Reminders', email: true, sms: true, push: true },
                                                { event: 'Exam Schedule Updates', email: true, sms: false, push: true },
                                                { event: 'Critical Inventory Alerts', email: true, sms: true, push: false }
                                            ].map((row, idx) => (
                                                <tr key={idx}>
                                                    <td className="ps-4 fw-semibold text-dark">{row.event}</td>
                                                    <td className="text-center"><input type="checkbox" className="form-check-input" defaultChecked={row.email} /></td>
                                                    <td className="text-center"><input type="checkbox" className="form-check-input" defaultChecked={row.sms} /></td>
                                                    <td className="text-center pe-4"><input type="checkbox" className="form-check-input" defaultChecked={row.push} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {['appearance', 'database'].includes(activeTab) && (
                            <div className="animate-up text-center py-5">
                                <div className="opacity-10 mb-4">
                                    <FontAwesomeIcon icon={faCog} size="5x" spin />
                                </div>
                                <h5 className="text-muted fw-bold">Optimization in Progress</h5>
                                <p className="text-muted small">Controls for "{activeTab.toUpperCase()}" are being refined for the next deployment.</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Settings;
