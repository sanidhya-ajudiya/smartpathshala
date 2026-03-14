import React, { useState, useEffect } from 'react';
import attendanceService from '../services/attendanceService';
import studentService from '../services/studentService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch, faCalendarCheck, faFilter, faFileAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import PageHeader from '../components/UI/PageHeader';
import Card from '../components/UI/Card';
import Table from '../components/UI/Table';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Select from '../components/UI/Select';
import Modal from '../components/UI/Modal';
import Badge from '../components/UI/Badge';
import { showSuccess, showError, confirmDelete } from '../utils/sweetalert';

const Attendance = () => {
    const [attendanceList, setAttendanceList] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        student_id: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
        remarks: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [attData, studData] = await Promise.all([
                attendanceService.getAllAttendance(),
                studentService.getAllStudents()
            ]);
            setAttendanceList(attData.data);
            setStudents(studData.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            showError('Data Error', 'Failed to synchronize attendance records.');
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendance = async () => {
        try {
            const data = await attendanceService.getAllAttendance();
            setAttendanceList(data.data);
        } catch (error) {
            console.error('Error fetching attendance:', error);
        }
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredAttendance = attendanceList.filter(record =>
    (record.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.roll_no?.includes(searchTerm))
    );

    const handleClose = () => {
        setShowModal(false);
        setCurrentRecord(null);
        setFormData({
            student_id: '',
            date: new Date().toISOString().split('T')[0],
            status: 'Present',
            remarks: ''
        });
    };

    const handleShow = (record = null) => {
        if (record) {
            setCurrentRecord(record);
            setFormData({
                student_id: record.student_id,
                date: record.date.split('T')[0],
                status: record.status,
                remarks: record.remarks || ''
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
            if (currentRecord) {
                await attendanceService.updateAttendance(currentRecord.id, formData);
                showSuccess('Updated!', 'Attendance record has been successfully modified.');
            } else {
                await attendanceService.markAttendance(formData);
                showSuccess('Recorded!', 'Attendance entry has been successfully recorded.');
            }
            fetchAttendance();
            handleClose();
        } catch (error) {
            showError('Submission Failed', error.response?.data?.message || 'System encountered an error while saving the record.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await confirmDelete(
            'Confirm Deletion',
            'Are you sure you want to delete this attendance record? This will remove the entry from student history.'
        );

        if (result.isConfirmed) {
            try {
                await attendanceService.deleteAttendance(id);
                showSuccess('Deleted', 'Attendance record removed from the registry.');
                fetchAttendance();
            } catch (error) {
                showError('Task Failed', 'System could not process the deletion request.');
            }
        }
    };

    const columns = [
        {
            header: 'Date',
            accessor: 'date',
            render: (row) => (
                <div className="fw-semibold text-dark">
                    {new Date(row.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
            )
        },
        {
            header: 'Student',
            render: (row) => (
                <div className="d-flex align-items-center">
                    <div className="bg-primary-soft text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '35px', height: '35px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                        {row.first_name.charAt(0)}
                    </div>
                    <div>
                        <div className="fw-bold text-dark">{row.first_name} {row.last_name}</div>
                        <div className="small text-muted">Roll: {row.roll_no}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Class',
            render: (row) => (
                <Badge variant="light">
                    {row.class_name ? `${row.class_name} • ${row.section_name}` : 'N/A'}
                </Badge>
            )
        },
        {
            header: 'Status',
            render: (row) => {
                let variant = 'success';
                if (row.status === 'Absent') variant = 'danger';
                if (row.status === 'Late') variant = 'warning';
                if (row.status === 'Half Day') variant = 'info';
                return <Badge variant={variant} soft={false}>{row.status}</Badge>;
            }
        },
        {
            header: 'Remarks',
            render: (row) => <span className="small text-muted italic">{row.remarks || '—'}</span>
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
                title="Attendance Management"
                subtitle="Track student attendance and manage daily records."
                breadcrumbs={[{ text: 'Attendance', link: '/attendance' }]}
                action={
                    <Button icon={<FontAwesomeIcon icon={faPlus} />} onClick={() => handleShow()}>
                        Add Attendance
                    </Button>
                }
            />

            <Card
                title="Attendance List"
                extra={
                    <div className="d-flex gap-3 align-items-center">
                        <div className="position-relative" style={{ width: '250px' }}>
                            <Input
                                placeholder="Search logs..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="mb-0"
                                icon={<FontAwesomeIcon icon={faSearch} />}
                            />
                        </div>
                        <Button variant="light" className="border">
                            <FontAwesomeIcon icon={faFilter} className="me-2" />
                            Filters
                        </Button>
                    </div>
                }
            >
                <Table
                    columns={columns}
                    data={filteredAttendance}
                    loading={loading}
                    emptyMessage="No attendance records found."
                />
            </Card>

            <Modal
                show={showModal}
                onHide={handleClose}
                title={currentRecord ? 'Edit Attendance Record' : 'Add Attendance Entry'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-12">
                            <Select
                                label="Student Name"
                                name="student_id"
                                value={formData.student_id}
                                onChange={handleInputChange}
                                required
                                disabled={!!currentRecord}
                                placeholder="Select student..."
                                options={students.map(s => ({
                                    label: `${s.roll_no} - ${s.first_name} ${s.last_name} (${s.class_name})`,
                                    value: s.id
                                }))}
                            />
                        </div>
                        <div className="col-md-6">
                            <Input label="Attendance Date" type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-6">
                            <Select
                                label="Status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                required
                                options={[
                                    { label: 'Present', value: 'Present' },
                                    { label: 'Absent', value: 'Absent' },
                                    { label: 'Late', value: 'Late' },
                                    { label: 'Half Day', value: 'Half Day' }
                                ]}
                            />
                        </div>
                        <div className="col-12">
                            <Input label="Remarks" name="remarks" value={formData.remarks} onChange={handleInputChange} rows={3} placeholder="Any specific observations..." />
                        </div>
                    </div>
                    <div className="d-flex justify-content-end gap-3 mt-4">
                        <Button variant="light" onClick={handleClose}>Cancel</Button>
                        <Button type="submit" loading={submitLoading}>
                            {currentRecord ? 'Update Record' : 'Save Attendance'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Attendance;
