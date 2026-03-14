import React, { useState, useEffect } from 'react';
import teacherService from '../services/teacherService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch, faChalkboardTeacher, faBriefcase, faGraduationCap, faPhoneAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import PageHeader from '../components/UI/PageHeader';
import Card from '../components/UI/Card';
import Table from '../components/UI/Table';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Modal from '../components/UI/Modal';
import Badge from '../components/UI/Badge';
import { showSuccess, showError, confirmDelete } from '../utils/sweetalert';

const Teachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentTeacher, setCurrentTeacher] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        department_id: '',
        qualification: '',
        joining_date: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            const data = await teacherService.getAllTeachers();
            setTeachers(data.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
            showError('Data Error', 'Failed to synchronize teacher directory.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredTeachers = teachers.filter(teacher =>
    (teacher.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.qualification?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleClose = () => {
        setShowModal(false);
        setCurrentTeacher(null);
        setFormData({
            first_name: '', last_name: '', department_id: '',
            qualification: '', joining_date: '', phone: '', address: ''
        });
    };

    const handleShow = (teacher = null) => {
        if (teacher) {
            setCurrentTeacher(teacher);
            setFormData({
                first_name: teacher.first_name || '',
                last_name: teacher.last_name || '',
                department_id: teacher.department_id || '',
                qualification: teacher.qualification || '',
                joining_date: teacher.joining_date ? teacher.joining_date.split('T')[0] : '',
                phone: teacher.phone || '',
                address: teacher.address || ''
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
            if (currentTeacher) {
                await teacherService.updateTeacher(currentTeacher.id, formData);
                showSuccess('Updated!', 'Teacher profile has been successfully modified.');
            } else {
                await teacherService.createTeacher(formData);
                showSuccess('Onboarded!', 'New teacher has been registered in the system.');
            }
            fetchTeachers();
            handleClose();
        } catch (error) {
            showError('Submission Failed', 'System encountered an error while saving the teacher record.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await confirmDelete(
            'Confirm Deletion',
            'Are you sure you want to delete this teacher record? This action will remove all academic history from the active directory.'
        );

        if (result.isConfirmed) {
            try {
                await teacherService.deleteTeacher(id);
                showSuccess('Deleted', 'Teacher record removed from the system.');
                fetchTeachers();
            } catch (error) {
                showError('Task Failed', 'System could not process the faculty removal request.');
            }
        }
    };

    const columns = [
        {
            header: 'Teacher',
            render: (row) => (
                <div className="d-flex align-items-center">
                    <div className="bg-info-soft text-info rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', fontWeight: 'bold' }}>
                        {row.first_name.charAt(0)}
                    </div>
                    <div>
                        <div className="fw-bold text-dark">{row.first_name} {row.last_name}</div>
                        <div className="small text-muted">Emp ID: {row.id}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Department',
            render: (row) => (
                <Badge variant="primary">
                    {row.department_name || `Dept ${row.department_id}`}
                </Badge>
            )
        },

        {
            header: 'Qualification',
            render: (row) => (
                <div className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faGraduationCap} className="text-muted me-2" />
                    <span className="small fw-semibold text-dark">{row.qualification || 'N/A'}</span>
                </div>
            )
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
                title="FACULTY ADMINISTRATION"
                subtitle="Centralized management for teaching staff, academic qualifications, and roles."
                breadcrumbs={[{ text: 'Teachers', link: '/teachers' }]}
                action={
                    <Button icon={<FontAwesomeIcon icon={faPlus} />} onClick={() => handleShow()}>
                        ONBOARD NEW FACULTY
                    </Button>
                }
            />

            <Card
                title="FACULTY REGISTRY"
                extra={
                    <div className="position-relative" style={{ width: '300px' }}>
                        <Input
                            placeholder="Search by faculty name..."
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
                    data={filteredTeachers}
                    loading={loading}
                    emptyMessage="No matching faculty records located."
                />
            </Card>

            <Modal
                show={showModal}
                onHide={handleClose}
                title={currentTeacher ? 'UPDATE FACULTY RECORD' : 'NEW FACULTY ONBOARDING'}
                size="lg"
            >
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-12 mb-4 d-flex align-items-center">
                            <Badge variant="primary" className="me-3 border-0"><FontAwesomeIcon icon={faBriefcase} /></Badge>
                            <h6 className="mb-0 fw-bold border-bottom pb-2 flex-grow-1 text-uppercase letter-spacing-1">Professional Profile</h6>
                        </div>
                        <div className="col-md-6">
                            <Input label="Faculty First Name" name="first_name" value={formData.first_name} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-6">
                            <Input label="Faculty Last Name" name="last_name" value={formData.last_name} onChange={handleInputChange} />
                        </div>
                        <div className="col-md-6">
                            <Input label="Primary Department" type="number" name="department_id" value={formData.department_id} onChange={handleInputChange} required />
                        </div>

                        <div className="col-md-6">
                            <Input label="Educational Qualification" name="qualification" value={formData.qualification} onChange={handleInputChange} placeholder="e.g. M.Sc. Mathematics" />
                        </div>
                        <div className="col-md-6">
                            <Input label="Appointment Date" type="date" name="joining_date" value={formData.joining_date} onChange={handleInputChange} />
                        </div>
                        <div className="col-md-6">
                            <Input label="Official Contact No" name="phone" value={formData.phone} onChange={handleInputChange} icon={<FontAwesomeIcon icon={faPhoneAlt} />} />
                        </div>
                        <div className="col-12">
                            <Input label="Residential Address" name="address" value={formData.address} onChange={handleInputChange} rows={2} />
                        </div>
                    </div>
                    <div className="d-flex justify-content-end gap-3 mt-4">
                        <Button variant="light" onClick={handleClose}>CLOSE</Button>
                        <Button type="submit" loading={submitLoading}>
                            {currentTeacher ? 'REVISE RECORD' : 'COMPLETE ONBOARDING'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Teachers;
