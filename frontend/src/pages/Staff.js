import React, { useState, useEffect } from 'react';
import staffService from '../services/staffService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch, faUserTie, faBriefcase, faMoneyBillWave, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import PageHeader from '../components/UI/PageHeader';
import Card from '../components/UI/Card';
import Table from '../components/UI/Table';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Modal from '../components/UI/Modal';
import Badge from '../components/UI/Badge';
import { showSuccess, showError, confirmDelete } from '../utils/sweetalert';

const Staff = () => {
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentStaff, setCurrentStaff] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        position: '',
        department_id: '',
        joining_date: '',
        phone: '',
        salary: ''
    });

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const data = await staffService.getAllStaff();
            setStaffList(data.data);
        } catch (error) {
            console.error('Error fetching staff:', error);
            showError('Data Error', 'Failed to synchronize staff directory.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredStaff = staffList.filter(staff =>
    (staff.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.position.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleClose = () => {
        setShowModal(false);
        setCurrentStaff(null);
        setFormData({
            first_name: '', last_name: '', position: '',
            department_id: '', joining_date: '', phone: '', salary: ''
        });
    };

    const handleShow = (staff = null) => {
        if (staff) {
            setCurrentStaff(staff);
            setFormData({
                first_name: staff.first_name || '',
                last_name: staff.last_name || '',
                position: staff.position || '',
                department_id: staff.department_id || '',
                joining_date: staff.joining_date ? staff.joining_date.split('T')[0] : '',
                phone: staff.phone || '',
                salary: staff.salary || ''
            });
        }
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            if (currentStaff) {
                await staffService.updateStaff(currentStaff.id, formData);
                showSuccess('Updated!', 'Staff profile has been successfully modified.');
            } else {
                await staffService.createStaff(formData);
                showSuccess('Onboarded!', 'New staff member has been registered in the system.');
            }
            fetchStaff();
            handleClose();
        } catch (error) {
            showError('Submission Failed', 'System encountered an error while saving the staff record.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await confirmDelete(
            'Confirm Deletion',
            'Are you sure you want to delete this staff record? This action will remove all administrative history from the registry.'
        );

        if (result.isConfirmed) {
            try {
                await staffService.deleteStaff(id);
                showSuccess('Deleted', 'Staff record removed from the database.');
                fetchStaff();
            } catch (error) {
                showError('Task Failed', 'System could not process the staff removal request.');
            }
        }
    };

    const columns = [
        {
            header: 'Staff Member',
            render: (row) => (
                <div className="d-flex align-items-center">
                    <div className="bg-primary-soft text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', fontWeight: 'bold' }}>
                        {row.first_name.charAt(0)}
                    </div>
                    <div>
                        <div className="fw-bold text-dark">{row.first_name} {row.last_name}</div>
                        <div className="small text-muted">ID: {row.id}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Admin Role',
            render: (row) => (
                <Badge variant="info">
                    {row.position}
                </Badge>
            )
        },
        {
            header: 'Department',
            render: (row) => <span className="small fw-semibold">{row.department_name || `Dept ${row.department_id}`}</span>
        },

        {
            header: 'Contact',
            render: (row) => (
                <div className="small">
                    <div className="fw-semibold text-muted"><FontAwesomeIcon icon={faPhoneAlt} className="me-2" />{row.phone || 'N/A'}</div>
                </div>
            )
        },
        {
            header: 'Actions',
            className: 'text-end',
            render: (row) => (
                <div className="d-flex justify-content-end gap-2">
                    <Button variant="light" size="sm" onClick={() => handleShow(row)}>
                        <FontAwesomeIcon icon={faEdit} className="text-primary" />
                    </Button>
                    <Button variant="light" size="sm" onClick={() => handleDelete(row.id)}>
                        <FontAwesomeIcon icon={faTrash} className="text-danger" />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="container-fluid">
            <PageHeader
                title="Staff Management"
                subtitle="Manage all teaching and non-teaching staff members."
                breadcrumbs={[{ text: 'Staff', link: '/staff' }]}
                action={
                    <Button icon={<FontAwesomeIcon icon={faPlus} />} onClick={() => handleShow()}>
                        Add New Staff
                    </Button>
                }
            />

            <Card
                title="Staff Directory"
                extra={
                    <div className="position-relative" style={{ width: '300px' }}>
                        <Input
                            placeholder="Search staff..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="mb-0"
                            icon={<FontAwesomeIcon icon={faSearch} />}
                        />
                    </div>
                }
            >
                <Table
                    columns={columns}
                    data={filteredStaff}
                    loading={loading}
                    emptyMessage="No staff records found matching your search."
                />
            </Card>

            <Modal
                show={showModal}
                onHide={handleClose}
                title={currentStaff ? 'Edit Staff Profile' : 'Add New Staff'}
                size="lg"
            >
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-12 mb-4 d-flex align-items-center">
                            <Badge variant="primary" className="me-3"><FontAwesomeIcon icon={faUserTie} /></Badge>
                            <h6 className="mb-0 fw-bold border-bottom pb-2 flex-grow-1">Administrative Profile</h6>
                        </div>
                        <div className="col-md-6">
                            <Input label="First Name" name="first_name" value={formData.first_name} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-6">
                            <Input label="Last Name" name="last_name" value={formData.last_name} onChange={handleInputChange} />
                        </div>
                        <div className="col-md-6">
                            <Input label="Position" name="position" value={formData.position} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-6">
                            <Input label="Department" type="number" name="department_id" value={formData.department_id} onChange={handleInputChange} />
                        </div>

                        <div className="col-md-6">
                            <Input label="Joining Date" type="date" name="joining_date" value={formData.joining_date} onChange={handleInputChange} />
                        </div>
                        <div className="col-md-6">
                            <Input label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} icon={<FontAwesomeIcon icon={faPhoneAlt} />} />
                        </div>
                        <div className="col-12">
                            <Input label="Salary" type="number" name="salary" value={formData.salary} onChange={handleInputChange} icon={<FontAwesomeIcon icon={faMoneyBillWave} />} step="0.01" />
                        </div>
                    </div>
                    <div className="d-flex justify-content-end gap-3 mt-4">
                        <Button variant="light" onClick={handleClose}>Cancel</Button>
                        <Button type="submit" loading={submitLoading}>
                            {currentStaff ? 'Save Updates' : 'Add Staff Member'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Staff;
