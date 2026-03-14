import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal, Badge, Spinner, Alert } from 'react-bootstrap';
import { getAllRoles, updateRolePermissions, createRole, deleteRole } from '../services/roleService';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSave, faTrash, faShieldAlt, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const Roles = () => {
    const [roles, setRoles] = useState([]);
    const [allPermissions, setAllPermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newRole, setNewRole] = useState({ name: '', description: '' });
    const [message, setMessage] = useState({ type: '', text: '' });

    const { user } = useAuth();

    // Fetch Roles and Permissions
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getAllRoles();
            if (data.success) {
                setRoles(data.roles);
                setAllPermissions(data.allPermissions);
                // Select first role by default if none selected
                if (!selectedRole && data.roles.length > 0) {
                    // Default to second role if first is Super Admin (id=1) 
                    // or just first available
                    setSelectedRole(data.roles.find(r => r.id !== 1) || data.roles[0]);
                }
            }
        } catch (error) {
            setMessage({ type: 'danger', text: 'Failed to fetch roles.' });
        } finally {
            setLoading(false);
        }
    };

    // Group Permissions by Module
    const getGroupedPermissions = () => {
        const groups = {};
        allPermissions.forEach(perm => {
            const [module, action] = perm.name.split('_');
            if (!groups[module]) groups[module] = [];
            groups[module].push({ ...perm, action });
        });
        return groups;
    };

    const groupedPermissions = getGroupedPermissions();
    const modules = Object.keys(groupedPermissions).sort();

    // Handle Checkbox Change
    const handlePermissionChange = (permId) => {
        if (!selectedRole) return;

        let updatedRole = { ...selectedRole };
        // Ensure permission_ids is an array
        if (!updatedRole.permission_ids) updatedRole.permission_ids = [];

        if (updatedRole.permission_ids.includes(permId)) {
            updatedRole.permission_ids = updatedRole.permission_ids.filter(id => id !== permId);
        } else {
            updatedRole.permission_ids.push(permId);
        }
        setSelectedRole(updatedRole);

        // Update local roles state to reflect changes seamlessly
        setRoles(roles.map(r => r.id === updatedRole.id ? updatedRole : r));
    };

    const handleSavePermissions = async () => {
        if (!selectedRole) return;
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            await updateRolePermissions(selectedRole.id, selectedRole.permission_ids);
            setMessage({ type: 'success', text: 'Permissions updated successfully!' });
        } catch (error) {
            setMessage({ type: 'danger', text: 'Failed to update permissions.' });
        } finally {
            setSaving(false);
        }
    };

    const handleCreateRole = async () => {
        if (!newRole.name) return;
        try {
            const res = await createRole(newRole.name, newRole.description);
            if (res.success) {
                setMessage({ type: 'success', text: 'Role created successfully!' });
                setShowCreateModal(false);
                setNewRole({ name: '', description: '' });
                fetchData(); // Refresh list
            }
        } catch (error) {
            setMessage({ type: 'danger', text: 'Failed to create role.' });
        }
    };

    const handleDeleteRole = async (id) => {
        if (!window.confirm("Are you sure you want to delete this role?")) return;
        try {
            await deleteRole(id);
            setMessage({ type: 'success', text: 'Role deleted successfully!' });
            fetchData();
            if (selectedRole && selectedRole.id === id) setSelectedRole(null);
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to delete role.';
            setMessage({ type: 'danger', text: errorMsg });
        }
    };

    // Helper to find permission ID for a module+action
    const getPermId = (module, action) => {
        // Map UI "ADD" back to "CREATE" for database matching
        const dbAction = action === 'ADD' ? 'CREATE' : action;
        const perm = groupedPermissions[module]?.find(p => p.action === dbAction);
        return perm ? perm.id : null;
    };

    const isChecked = (permId) => {
        return selectedRole?.permission_ids?.includes(permId);
    };

    const actionColumns = ['VIEW', 'ADD', 'EDIT', 'DELETE'];

    return (
        <Container fluid className="p-4">
            <h2 className="mb-4 text-primary"><FontAwesomeIcon icon={faShieldAlt} /> User Roles & Permissions</h2>

            {message.text && <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>{message.text}</Alert>}

            <Row>
                {/* Roles List */}
                <Col md={3} className="mb-4">
                    <Card className="shadow-sm">
                        <Card.Header className="d-flex justify-content-between align-items-center bg-white">
                            <h5 className="mb-0">Roles</h5>
                            <Button variant="outline-primary" size="sm" onClick={() => setShowCreateModal(true)}>
                                <FontAwesomeIcon icon={faPlus} />
                            </Button>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="list-group list-group-flush">
                                {loading ? <div className="p-3 text-center"><Spinner animation="border" size="sm" /></div> :
                                    roles.map(role => (
                                        <button
                                            key={role.id}
                                            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${selectedRole?.id === role.id ? 'active' : ''}`}
                                            onClick={() => setSelectedRole(role)}
                                        >
                                            <span>{role.name}</span>
                                            {role.id !== 1 && (
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    className="text-danger opacity-50 hover-opacity-100"
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteRole(role.id); }}
                                                />
                                            )}
                                        </button>
                                    ))}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Permission Matrix */}
                <Col md={9}>
                    {selectedRole ? (
                        <Card className="shadow-sm">
                            <Card.Header className="d-flex justify-content-between align-items-center bg-white sticky-top" style={{ zIndex: 100 }}>
                                <h5 className="mb-0">Permissions for: <span className="text-primary">{selectedRole.name}</span></h5>
                                <Button
                                    variant="primary"
                                    onClick={handleSavePermissions}
                                    disabled={saving}
                                >
                                    {saving ? <Spinner animation="border" size="sm" /> : <><FontAwesomeIcon icon={faSave} /> Save Changes</>}
                                </Button>
                            </Card.Header>
                            <Card.Body>
                                <div className="table-responsive">
                                    <Table hover bordered className="align-middle">
                                        <thead className="bg-light">
                                            <tr>
                                                <th style={{ width: '20%' }}>Module</th>
                                                {actionColumns.map(action => (
                                                    <th key={action} className="text-center">
                                                        {action.charAt(0) + action.slice(1).toLowerCase()}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {modules.map(module => (
                                                <tr key={module}>
                                                    <td className="fw-bold text-capitalize">{module.toLowerCase()}</td>
                                                    {actionColumns.map(action => {
                                                        const permId = getPermId(module, action);
                                                        return (
                                                            <td key={action} className="text-center">
                                                                {permId ? (
                                                                    <Form.Check
                                                                        type="checkbox"
                                                                        checked={isChecked(permId)}
                                                                        onChange={() => handlePermissionChange(permId)}
                                                                        style={{ transform: 'scale(1.2)' }}
                                                                    />
                                                                ) : <span className="text-muted text-opacity-25">-</span>}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </Card.Body>
                        </Card>
                    ) : (
                        <div className="text-center p-5 text-muted">
                            <h5>Select a role to manage permissions</h5>
                        </div>
                    )}
                </Col>
            </Row>

            {/* Create Role Modal */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Role</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Role Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g. Accountant"
                                value={newRole.name}
                                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newRole.description}
                                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleCreateRole}>Create Role</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Roles;
