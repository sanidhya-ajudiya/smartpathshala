import React, { useState, useEffect } from 'react';
import examService from '../services/examService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch, faFileAlt, faCalendarAlt, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import PageHeader from '../components/UI/PageHeader';
import Card from '../components/UI/Card';
import Table from '../components/UI/Table';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Modal from '../components/UI/Modal';
import Badge from '../components/UI/Badge';
import { showSuccess, showError, confirmDelete } from '../utils/sweetalert';

const Exams = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentExam, setCurrentExam] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        start_date: '',
        end_date: '',
        class_id: ''
    });

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            setLoading(true);
            const data = await examService.getAllExams();
            setExams(data.data || []);
        } catch (error) {
            console.error('Error fetching exams:', error);
            showError('Data Error', 'Failed to synchronize examination records.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredExams = exams.filter(exam =>
        exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.class_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleClose = () => {
        setShowModal(false);
        setCurrentExam(null);
        setFormData({ name: '', start_date: '', end_date: '', class_id: '' });
    };

    const handleShow = (exam = null) => {
        if (exam) {
            setCurrentExam(exam);
            setFormData({
                name: exam.name || '',
                start_date: exam.start_date ? exam.start_date.split('T')[0] : '',
                end_date: exam.end_date ? exam.end_date.split('T')[0] : '',
                class_id: exam.class_id || ''
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
            if (currentExam) {
                await examService.updateExam(currentExam.id, formData);
                showSuccess('Updated!', 'The examination protocol has been successfully modified.');
            } else {
                await examService.createExam(formData);
                showSuccess('Created!', 'A new academic assessment cycle has been initialized.');
            }
            fetchExams();
            handleClose();
        } catch (error) {
            showError('Update Failed', 'System encountered an error while saving the exam record.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await confirmDelete(
            'Confirm Removal',
            'Are you sure you want to delete this examination cycle? All associated scheduling will be lost.'
        );

        if (result.isConfirmed) {
            try {
                await examService.deleteExam(id);
                showSuccess('Deleted', 'Examination cycle has been removed from the registry.');
                fetchExams();
            } catch (error) {
                showError('Task Failed', 'System could not process the deletion request.');
            }
        }
    };

    const columns = [
        {
            header: 'Assessment Designation',
            render: (row) => (
                <div className="d-flex align-items-center">
                    <div className="bg-warning-soft text-warning rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', fontWeight: 'bold' }}>
                        {row.name.charAt(0)}
                    </div>
                    <div>
                        <div className="fw-bold text-dark">{row.name}</div>
                        <div className="small text-muted">Internal Ref: #{row.id}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Target Class',
            render: (row) => (
                <Badge variant="primary">
                    {row.class_name || `Academic Class ${row.class_id}`}
                </Badge>
            )
        },
        {
            header: 'Commencement',
            render: (row) => (
                <div className="small fw-semibold text-muted">
                    <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-primary opacity-50" />
                    {row.start_date ? new Date(row.start_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Pending'}
                </div>
            )
        },
        {
            header: 'Conclusion',
            render: (row) => (
                <div className="small fw-semibold text-muted">
                    <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-danger opacity-50" />
                    {row.end_date ? new Date(row.end_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Pending'}
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
                title="Academic Evaluations"
                subtitle="Orchestrate examination cycles, scheduling, and academic performance tracking."
                breadcrumbs={[{ text: 'Exams', link: '/exams' }]}
                action={
                    <Button icon={<FontAwesomeIcon icon={faPlus} />} onClick={() => handleShow()}>
                        Initialize New Exam
                    </Button>
                }
            />

            <Card
                title="Examination Schedule"
                extra={
                    <div className="position-relative" style={{ width: '300px' }}>
                        <Input
                            placeholder="Search cycles..."
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
                    data={filteredExams}
                    loading={loading}
                    emptyMessage="No examination records found."
                />
            </Card>

            <Modal
                show={showModal}
                onHide={handleClose}
                title={currentExam ? 'Revise Examination Protocol' : 'New Academic Assessment'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-12 mb-4 d-flex align-items-center">
                            <Badge variant="primary" className="me-3"><FontAwesomeIcon icon={faClipboardList} /></Badge>
                            <h6 className="mb-0 fw-bold border-bottom pb-2 flex-grow-1">Assessment Configuration</h6>
                        </div>
                        <div className="col-12">
                            <Input label="Exam Name" name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g. Annual Finals 2024" />
                        </div>
                        <div className="col-md-6">
                            <Input label="Target Class ID" type="number" name="class_id" value={formData.class_id} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-6">
                            <Input label="Commencement Date" type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} />
                        </div>
                        <div className="col-md-6">
                            <Input label="Conclusion Date" type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="d-flex justify-content-end gap-3 mt-4">
                        <Button variant="light" onClick={handleClose}>Cancel</Button>
                        <Button type="submit" loading={submitLoading}>
                            {currentExam ? 'Update Protocol' : 'Confirm Cycle'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Exams;
