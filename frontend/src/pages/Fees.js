import React, { useState, useEffect } from 'react';
import feeService from '../services/feeService';
import studentService from '../services/studentService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch, faMoneyBillWave, faFileInvoiceDollar, faHandHoldingUsd, faHistory } from '@fortawesome/free-solid-svg-icons';
import PageHeader from '../components/UI/PageHeader';
import Card from '../components/UI/Card';
import Table from '../components/UI/Table';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Select from '../components/UI/Select';
import Modal from '../components/UI/Modal';
import Badge from '../components/UI/Badge';
import { showSuccess, showError, confirmDelete } from '../utils/sweetalert';

const Fees = () => {
    const [payments, setPayments] = useState([]);
    const [students, setStudents] = useState([]);
    const [feeStructures, setFeeStructures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentPayment, setCurrentPayment] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        student_id: '',
        fee_structure_id: '',
        amount_paid: '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'Cash',
        transaction_id: '',
        status: 'Paid'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [payData, studData, feeStructData] = await Promise.all([
                feeService.getAllPayments(),
                studentService.getAllStudents(),
                feeService.getFeeStructures()
            ]);
            setPayments(payData.data || []);
            setStudents(studData.data || []);
            setFeeStructures(feeStructData.data || []);
        } catch (error) {
            console.error('Error fetching fee data:', error);
            showError('Data Error', 'Failed to synchronize fee records.');
        } finally {
            setLoading(false);
        }
    };

    const fetchPayments = async () => {
        try {
            const data = await feeService.getAllPayments();
            setPayments(data.data || []);
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredPayments = payments.filter(payment =>
    (payment.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.roll_no?.includes(searchTerm) ||
        payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleClose = () => {
        setShowModal(false);
        setCurrentPayment(null);
        setFormData({
            student_id: '', fee_structure_id: '', amount_paid: '',
            payment_date: new Date().toISOString().split('T')[0],
            payment_method: 'Cash', transaction_id: '', status: 'Paid'
        });
    };

    const handleShow = (payment = null) => {
        if (payment) {
            setCurrentPayment(payment);
            setFormData({
                student_id: payment.student_id || '',
                fee_structure_id: payment.fee_structure_id || '',
                amount_paid: payment.amount_paid || '',
                payment_date: payment.payment_date ? payment.payment_date.split('T')[0] : '',
                payment_method: payment.payment_method || 'Cash',
                transaction_id: payment.transaction_id || '',
                status: payment.status || 'Paid'
            });
        }
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'fee_structure_id') {
            const structure = feeStructures.find(fs => fs.id === parseInt(value));
            if (structure) {
                setFormData(prev => ({ ...prev, amount_paid: structure.amount }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            if (currentPayment) {
                await feeService.updatePayment(currentPayment.id, formData);
                showSuccess('Updated!', 'Payment record has been successfully modified.');
            } else {
                await feeService.createPayment(formData);
                showSuccess('Collected!', 'New fee collection has been recorded.');
            }
            fetchPayments();
            handleClose();
        } catch (error) {
            showError('Submission Failed', 'System encountered an error while saving the financial record.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await confirmDelete(
            'Confirm Deletion',
            'Are you sure you want to delete this payment record? This transaction will be removed from the records.'
        );

        if (result.isConfirmed) {
            try {
                await feeService.deletePayment(id);
                showSuccess('Deleted', 'Fee record removed from the history.');
                fetchPayments();
            } catch (error) {
                showError('Task Failed', 'System could not process the payment removal request.');
            }
        }
    };

    const columns = [
        {
            header: 'Settlement Date',
            render: (row) => (
                <div className="small fw-semibold text-muted">
                    {new Date(row.payment_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
            )
        },
        {
            header: 'Student Associate',
            render: (row) => (
                <div className="d-flex align-items-center">
                    <div className="bg-success-soft text-success rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '35px', height: '35px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                        {row.first_name?.charAt(0)}
                    </div>
                    <div>
                        <div className="fw-bold text-dark">{row.first_name} {row.last_name}</div>
                        <div className="small text-muted">Roll: {row.roll_no} • {row.class_name}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Fee Category',
            render: (row) => <Badge variant="light">{row.fee_category || 'General'}</Badge>
        },
        {
            header: 'Amount Paid',
            render: (row) => <div className="fw-bold text-dark">₹{parseFloat(row.amount_paid).toLocaleString()}</div>
        },
        {
            header: 'Status',
            render: (row) => {
                let variant = 'success';
                if (row.status === 'Pending') variant = 'warning';
                if (row.status === 'Partial') variant = 'info';
                return <Badge variant={variant} soft={false}>{row.status}</Badge>;
            }
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
                title="Fee Management"
                subtitle="Track student fees, handle collections, and monitor revenue."
                breadcrumbs={[{ text: 'Fees', link: '/fees' }]}
                action={
                    <Button icon={<FontAwesomeIcon icon={faPlus} />} onClick={() => handleShow()}>
                        Add New Payment
                    </Button>
                }
            />

            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <Card bodyClassName="p-4 bg-primary text-white">
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <p className="text-white-50 small fw-bold text-uppercase mb-1">Total Collections</p>
                                <h2 className="fw-bold mb-0 text-white">₹{payments.reduce((acc, curr) => acc + parseFloat(curr.amount_paid || 0), 0).toLocaleString()}</h2>
                            </div>
                            <div className="bg-white bg-opacity-10 p-3 rounded-3">
                                <FontAwesomeIcon icon={faHandHoldingUsd} size="lg" />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <Card
                title="Transaction History"
                extra={
                    <div className="position-relative" style={{ width: '300px' }}>
                        <Input
                            placeholder="Search records..."
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
                    data={filteredPayments}
                    loading={loading}
                    emptyMessage="No financial records found mismatching your search."
                />
            </Card>

            <Modal
                show={showModal}
                onHide={handleClose}
                title={currentPayment ? 'Edit Payment Record' : 'Add Fee Collection'}
                size="lg"
            >
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-12 mb-4 d-flex align-items-center">
                            <Badge variant="success" className="me-3"><FontAwesomeIcon icon={faFileInvoiceDollar} /></Badge>
                            <h6 className="mb-0 fw-bold border-bottom pb-2 flex-grow-1">Payment Context</h6>
                        </div>
                        <div className="col-md-6">
                            <Select
                                label="Student Name"
                                name="student_id"
                                value={formData.student_id}
                                onChange={handleInputChange}
                                required
                                disabled={!!currentPayment}
                                placeholder="Select student..."
                                options={students.map(s => ({
                                    label: `${s.roll_no} - ${s.first_name} ${s.last_name} (${s.class_name})`,
                                    value: s.id
                                }))}
                            />
                        </div>
                        <div className="col-md-6">
                            <Select
                                label="Fee Structure"
                                name="fee_structure_id"
                                value={formData.fee_structure_id}
                                onChange={handleInputChange}
                                placeholder="Select category..."
                                options={feeStructures.map(fs => ({
                                    label: `${fs.category} (${fs.class_name}) - ₹${fs.amount}`,
                                    value: fs.id
                                }))}
                            />
                        </div>
                        <div className="col-12 mb-4 mt-3 d-flex align-items-center">
                            <Badge variant="info" className="me-3"><FontAwesomeIcon icon={faHistory} /></Badge>
                            <h6 className="mb-0 fw-bold border-bottom pb-2 flex-grow-1">Transaction Details</h6>
                        </div>
                        <div className="col-md-6">
                            <Input label="Amount Paid" type="number" name="amount_paid" value={formData.amount_paid} onChange={handleInputChange} required icon={<FontAwesomeIcon icon={faMoneyBillWave} />} step="0.01" />
                        </div>
                        <div className="col-md-6">
                            <Input label="Payment Date" type="date" name="payment_date" value={formData.payment_date} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-4">
                            <Select
                                label="Payment Method"
                                name="payment_method"
                                value={formData.payment_method}
                                onChange={handleInputChange}
                                options={[
                                    { label: 'Cash', value: 'Cash' },
                                    { label: 'Online', value: 'Online' },
                                    { label: 'Cheque', value: 'Cheque' },
                                    { label: 'UPI', value: 'UPI' }
                                ]}
                            />
                        </div>
                        <div className="col-md-4">
                            <Input label="Reference / Transaction ID" name="transaction_id" value={formData.transaction_id} onChange={handleInputChange} />
                        </div>
                        <div className="col-md-4">
                            <Select
                                label="Status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                options={[
                                    { label: 'Paid', value: 'Paid' },
                                    { label: 'Pending', value: 'Pending' },
                                    { label: 'Partial', value: 'Partial' }
                                ]}
                            />
                        </div>
                    </div>
                    <div className="d-flex justify-content-end gap-3 mt-4">
                        <Button variant="light" onClick={handleClose}>Cancel</Button>
                        <Button type="submit" loading={submitLoading}>
                            {currentPayment ? 'Update Record' : 'Add Payment'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Fees;
