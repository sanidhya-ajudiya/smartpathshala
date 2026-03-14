import React, { useState, useEffect } from 'react';
import studentService from '../services/studentService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch, faUserGraduate, faPhoneAlt, faUserShield, faCalendarAlt, faIdCard } from '@fortawesome/free-solid-svg-icons';
import PageHeader from '../components/UI/PageHeader';
import Card from '../components/UI/Card';
import DataTable from '../components/UI/DataTable';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Select from '../components/UI/Select';
import Modal from '../components/UI/Modal';
import Badge from '../components/UI/Badge';
import { showSuccess, showError, confirmDelete } from '../utils/sweetalert';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        roll_no: '',
        class_id: '',
        section_id: '',
        dob: '',
        gender: '',
        address: '',
        phone: '',
        guardian_name: '',
        guardian_phone: '',
        admission_date: ''
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const data = await studentService.getAllStudents();
            setStudents(data.data);
        } catch (error) {
            console.error('Error fetching students:', error);
            showError('Sync Error', 'Failed to synchronize student directory.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setCurrentStudent(null);
        setFormData({
            first_name: '', last_name: '', roll_no: '', class_id: '',
            section_id: '', dob: '', gender: '', address: '',
            phone: '', guardian_name: '', guardian_phone: '', admission_date: ''
        });
    };

    const handleShow = (student = null) => {
        if (student) {
            setCurrentStudent(student);
            setFormData({
                first_name: student.first_name || '',
                last_name: student.last_name || '',
                roll_no: student.roll_no || '',
                class_id: student.class_id || '',
                section_id: student.section_id || '',
                dob: student.dob ? student.dob.split('T')[0] : '',
                gender: student.gender || '',
                address: student.address || '',
                phone: student.phone || '',
                guardian_name: student.guardian_name || '',
                guardian_phone: student.guardian_phone || '',
                admission_date: student.admission_date ? student.admission_date.split('T')[0] : ''
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
            if (currentStudent) {
                await studentService.updateStudent(currentStudent.id, formData);
                showSuccess('Updated!', 'Student profile has been successfully modified.');
            } else {
                await studentService.createStudent(formData);
                showSuccess('Enrolled!', 'New student has been registered in the school system.');
            }
            fetchStudents();
            handleClose();
        } catch (error) {
            showError('Task Failed', 'System encountered an error while saving the student record.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await confirmDelete(
            'Confirm Deletion',
            'Are you sure you want to delete this student\'s record? This action is permanent and will remove all academic history.'
        );

        if (result.isConfirmed) {
            try {
                await studentService.deleteStudent(id);
                showSuccess('Deleted', 'Student record removed from the centralized database.');
                fetchStudents();
            } catch (error) {
                showError('Deletion Failed', 'System could not process the student removal request.');
            }
        }
    };

    const columns = [
        {
            header: 'Roll No',
            accessor: 'roll_no',
            sortable: true,
            render: (row) => <span className="fw-bold text-primary">#{row.roll_no}</span>
        },
        {
            header: 'Student Name',
            accessor: 'first_name', // Used for default sorting/searching
            sortable: true,
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
            header: 'Class',
            accessor: 'class_id',
            sortable: true,
            render: (row) => (
                <Badge variant="info">
                    {row.class_name || `Grade ${row.class_id}`}
                </Badge>
            )
        },
        {
            header: 'Contact',
            accessor: 'phone',
            render: (row) => (
                <div>
                    <div className="small fw-semibold"><FontAwesomeIcon icon={faPhoneAlt} className="me-2 text-muted" />{row.phone || 'N/A'}</div>
                    <div className="small text-muted mt-1"><FontAwesomeIcon icon={faUserShield} className="me-2 text-muted" />{row.guardian_name || 'N/A'}</div>
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
                title="STUDENT DIRECTORY"
                subtitle="Comprehensive registry of all active pupils and their background profiles."
                breadcrumbs={[{ text: 'Students', link: '/students' }]}
                action={
                    <Button icon={<FontAwesomeIcon icon={faPlus} />} onClick={() => handleShow()}>
                        ENROLL NEW STUDENT
                    </Button>
                }
            />

            <DataTable
                columns={columns}
                data={students}
                loading={loading}
                title="REGISTERED STUDENT RECORDS"
                enableSearch={true}
                enableExport={true}
                pagination={true}
                emptyMessage="No student matching records located."
            />

            <Modal
                show={showModal}
                onHide={handleClose}
                title={currentStudent ? 'EDIT STUDENT PROFILE' : 'STUDENT ENROLLMENT FORM'}
                size="lg"
            >
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-12 mb-4 d-flex align-items-center">
                            <Badge variant="primary" className="me-3 border-0"><FontAwesomeIcon icon={faIdCard} /></Badge>
                            <h6 className="mb-0 fw-bold border-bottom pb-2 flex-grow-1 text-uppercase letter-spacing-1">Personal Details</h6>
                        </div>
                        <div className="col-md-6">
                            <Input label="Student First Name" name="first_name" value={formData.first_name} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-6">
                            <Input label="Student Last Name" name="last_name" value={formData.last_name} onChange={handleInputChange} />
                        </div>
                        <div className="col-md-4">
                            <Input label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleInputChange} />
                        </div>
                        <div className="col-md-4">
                            <Select
                                label="Gender Type"
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                options={[
                                    { label: 'Male', value: 'Male' },
                                    { label: 'Female', value: 'Female' },
                                    { label: 'Other', value: 'Other' }
                                ]}
                            />
                        </div>
                        <div className="col-md-4">
                            <Input label="Primary Phone" name="phone" value={formData.phone} onChange={handleInputChange} icon={<FontAwesomeIcon icon={faPhoneAlt} />} />
                        </div>
                        <div className="col-12 mb-4 mt-3 d-flex align-items-center">
                            <Badge variant="info" className="me-3 border-0"><FontAwesomeIcon icon={faCalendarAlt} /></Badge>
                            <h6 className="mb-0 fw-bold border-bottom pb-2 flex-grow-1 text-uppercase letter-spacing-1">Academic & Guardian Information</h6>
                        </div>
                        <div className="col-md-4">
                            <Input label="Enrollment ID / Roll No." name="roll_no" value={formData.roll_no} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-4">
                            <Input label="Assigned Grade" type="number" name="class_id" value={formData.class_id} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-4">
                            <Input label="Enrollment Date" type="date" name="admission_date" value={formData.admission_date} onChange={handleInputChange} />
                        </div>
                        <div className="col-md-6">
                            <Input label="Parent / Guardian Name" name="guardian_name" value={formData.guardian_name} onChange={handleInputChange} />
                        </div>
                        <div className="col-md-6">
                            <Input label="Guardian Contact No" name="guardian_phone" value={formData.guardian_phone} onChange={handleInputChange} />
                        </div>
                        <div className="col-12">
                            <Input label="Residential Address" name="address" value={formData.address} onChange={handleInputChange} rows={2} />
                        </div>
                    </div>
                    <div className="d-flex justify-content-end gap-3 mt-4">
                        <Button variant="light" onClick={handleClose}>CLOSE</Button>
                        <Button type="submit" loading={submitLoading}>
                            {currentStudent ? 'UPDATE RECORD' : 'CONFIRM ENROLLMENT'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Students;
