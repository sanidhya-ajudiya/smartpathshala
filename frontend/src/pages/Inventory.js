import React, { useState, useEffect } from 'react';
import inventoryService from '../services/inventoryService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch, faWarehouse, faExchangeAlt, faBox, faHistory, faTags, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import PageHeader from '../components/UI/PageHeader';
import Card from '../components/UI/Card';
import Table from '../components/UI/Table';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Modal from '../components/UI/Modal';
import Badge from '../components/UI/Badge';
import Select from '../components/UI/Select';
import { showSuccess, showError, confirmDelete } from '../utils/sweetalert';

const Inventory = () => {
    const [activeTab, setActiveTab] = useState('items');
    const [items, setItems] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showItemModal, setShowItemModal] = useState(false);
    const [showTransModal, setShowTransModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Form States
    const [itemFormData, setItemFormData] = useState({
        name: '', category: '', quantity: 0, unit_price: 0, supplier: ''
    });

    const [transFormData, setTransFormData] = useState({
        item_id: '', type: 'IN', quantity: '', remarks: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            setLoading(true);
            if (activeTab === 'items') {
                const data = await inventoryService.getAllItems();
                setItems(data.data || []);
            } else {
                const data = await inventoryService.getTransactions();
                setTransactions(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            showError('Synchronization Error', 'Failed to retrieve repository records.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => setSearchTerm(e.target.value);

    const filteredItems = items.filter(i =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.supplier?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredTransactions = transactions.filter(t =>
        t.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.remarks?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleItemClose = () => {
        setShowItemModal(false);
        setCurrentItem(null);
        setItemFormData({ name: '', category: '', quantity: 0, unit_price: 0, supplier: '' });
    };

    const handleItemShow = (item = null) => {
        if (item) {
            setCurrentItem(item);
            setItemFormData({
                name: item.name || '',
                category: item.category || '',
                quantity: item.quantity || 0,
                unit_price: item.unit_price || 0,
                supplier: item.supplier || ''
            });
        }
        setShowItemModal(true);
    };

    const handleItemSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            if (currentItem) {
                await inventoryService.updateItem(currentItem.id, itemFormData);
                showSuccess('Updated!', 'Asset specifications have been successfully modified.');
            } else {
                await inventoryService.createItem(itemFormData);
                showSuccess('Registered!', 'New asset has been added to the repository catalog.');
            }
            fetchData();
            handleItemClose();
        } catch (error) {
            showError('Operation Failed', 'System encountered an error while saving the resource record.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleItemDelete = async (id) => {
        const result = await confirmDelete(
            'Confirm Asset Removal',
            'Are you sure you want to remove this resource from the repository? Inventory history will be preserved but the item will be deactivated.'
        );

        if (result.isConfirmed) {
            try {
                await inventoryService.deleteItem(id);
                showSuccess('Deleted', 'Asset record removed from the centralized database.');
                fetchData();
            } catch (error) {
                showError('Task Failed', 'System could not process the asset removal request.');
            }
        }
    };

    const handleTransClose = () => {
        setShowTransModal(false);
        setTransFormData({ item_id: '', type: 'IN', quantity: '', remarks: '', date: new Date().toISOString().split('T')[0] });
    };

    const handleTransSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            await inventoryService.recordTransaction(transFormData);
            showSuccess('Operation Executed', 'Strategic stock transformation recorded successfully.');
            fetchData();
            handleTransClose();
        } catch (error) {
            showError('Audit Error', 'Failed to synchronize stock operation with the ledger.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const itemColumns = [
        {
            header: 'Asset Designation',
            render: (row) => (
                <div className="d-flex align-items-center">
                    <div className="bg-info-soft text-info rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                        <FontAwesomeIcon icon={faBox} />
                    </div>
                    <div className="fw-bold text-dark">{row.name}</div>
                </div>
            )
        },
        {
            header: 'Classification',
            render: (row) => <Badge variant="secondary">{row.category || 'General'}</Badge>
        },
        {
            header: 'Stock Level',
            className: 'text-center',
            render: (row) => (
                <div className={`fw-bold ${row.quantity < 10 ? 'text-danger' : 'text-success'}`}>
                    {row.quantity}
                    {row.quantity < 10 && <FontAwesomeIcon icon={faWarehouse} className="ms-2 opacity-50" style={{ fontSize: '0.8rem' }} />}
                </div>
            )
        },
        {
            header: 'Unit Valuation',
            render: (row) => <div className="fw-semibold text-dark">₹{parseFloat(row.unit_price || 0).toLocaleString()}</div>
        },
        {
            header: 'Actions',
            className: 'text-end',
            render: (row) => (
                <div className="d-flex justify-content-end gap-2">
                    <Button variant="light" size="sm" onClick={() => handleItemShow(row)}>
                        <FontAwesomeIcon icon={faEdit} className="text-primary" />
                    </Button>
                    <Button variant="light" size="sm" onClick={() => handleItemDelete(row.id)}>
                        <FontAwesomeIcon icon={faTrash} className="text-danger" />
                    </Button>
                </div>
            )
        }
    ];

    const transColumns = [
        {
            header: 'Entry Date',
            render: (row) => (
                <div className="small fw-semibold text-muted">
                    {new Date(row.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
            )
        },
        {
            header: 'Asset Identifier',
            render: (row) => <div className="fw-bold text-dark">{row.item_name}</div>
        },
        {
            header: 'Nature',
            className: 'text-center',
            render: (row) => {
                const isIn = row.type === 'IN';
                return (
                    <Badge variant={isIn ? 'success' : 'danger'} soft={false}>
                        {isIn ? 'STOCK REPLENISHED' : 'STOCK DISPATCHED'}
                    </Badge>
                );
            }
        },
        {
            header: 'Volume',
            className: 'text-center',
            render: (row) => <div className="fw-bold text-dark">{row.quantity}</div>
        },
        {
            header: 'Remarks',
            render: (row) => <span className="small text-muted italic">{row.remarks || '—'}</span>
        }
    ];

    return (
        <div className="container-fluid">
            <PageHeader
                title="Central Repository"
                subtitle="Manage school assets, monitor stock levels, and track procurement logistics."
                breadcrumbs={[{ text: 'Inventory', link: '/inventory' }]}
                action={
                    <div className="d-flex gap-3">
                        <Button variant="light" className="border" icon={<FontAwesomeIcon icon={faExchangeAlt} />} onClick={() => setShowTransModal(true)}>
                            Stock Operation
                        </Button>
                        <Button icon={<FontAwesomeIcon icon={faPlus} />} onClick={() => handleItemShow()}>
                            Register Asset
                        </Button>
                    </div>
                }
            />

            <Card>
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
                    <div className="d-flex p-1 bg-light rounded-3" style={{ width: 'fit-content' }}>
                        <button
                            className={`btn btn-sm px-4 py-2 border-0 rounded-3 transition-all ${activeTab === 'items' ? 'bg-white shadow-sm fw-bold text-primary' : 'text-muted'}`}
                            onClick={() => setActiveTab('items')}
                        >
                            <FontAwesomeIcon icon={faBox} className="me-2" /> Resources
                        </button>
                        <button
                            className={`btn btn-sm px-4 py-2 border-0 rounded-3 transition-all ${activeTab === 'transactions' ? 'bg-white shadow-sm fw-bold text-primary' : 'text-muted'}`}
                            onClick={() => setActiveTab('transactions')}
                        >
                            <FontAwesomeIcon icon={faHistory} className="me-2" /> Ledger
                        </button>
                    </div>

                    <div className="position-relative" style={{ width: '300px' }}>
                        <Input
                            placeholder={`Search ${activeTab}...`}
                            value={searchTerm}
                            onChange={handleSearch}
                            className="mb-0"
                            icon={<FontAwesomeIcon icon={faSearch} />}
                        />
                    </div>
                </div>

                <Table
                    columns={activeTab === 'items' ? itemColumns : transColumns}
                    data={activeTab === 'items' ? filteredItems : filteredTransactions}
                    loading={loading}
                    emptyMessage={`No inventory records found in the current view.`}
                />
            </Card>

            <Modal
                show={showItemModal}
                onHide={handleItemClose}
                title={currentItem ? 'Revise Asset Registration' : 'New Asset Categorization'}
                size="lg"
            >
                <form onSubmit={handleItemSubmit}>
                    <div className="row">
                        <div className="col-12 mb-4 d-flex align-items-center">
                            <Badge variant="primary" className="me-3"><FontAwesomeIcon icon={faTags} /></Badge>
                            <h6 className="mb-0 fw-bold border-bottom pb-2 flex-grow-1">Asset Specifications</h6>
                        </div>
                        <div className="col-12">
                            <Input label="Asset Designation" value={itemFormData.name} onChange={(e) => setItemFormData({ ...itemFormData, name: e.target.value })} required placeholder="e.g. Laboratory Equipment" />
                        </div>
                        <div className="col-md-6">
                            <Input label="Classification" value={itemFormData.category} onChange={(e) => setItemFormData({ ...itemFormData, category: e.target.value })} placeholder="e.g. Science Dept" />
                        </div>
                        <div className="col-md-6">
                            <Input label="Unit Valuation (₹)" type="number" step="0.01" value={itemFormData.unit_price} onChange={(e) => setItemFormData({ ...itemFormData, unit_price: e.target.value })} />
                        </div>
                        <div className="col-md-6">
                            <Input label="Primary Supplier" value={itemFormData.supplier} onChange={(e) => setItemFormData({ ...itemFormData, supplier: e.target.value })} />
                        </div>
                        {!currentItem && (
                            <div className="col-md-6">
                                <Input label="Initial Stock Volume" type="number" value={itemFormData.quantity} onChange={(e) => setItemFormData({ ...itemFormData, quantity: e.target.value })} />
                            </div>
                        )}
                    </div>
                    <div className="d-flex justify-content-end gap-3 mt-4">
                        <Button variant="light" onClick={handleItemClose}>Cancel</Button>
                        <Button type="submit" loading={submitLoading}>Confirm Asset</Button>
                    </div>
                </form>
            </Modal>

            <Modal
                show={showTransModal}
                onHide={handleTransClose}
                title="Strategic Stock Operation"
            >
                <form onSubmit={handleTransSubmit}>
                    <div className="row">
                        <div className="col-12 mb-4 d-flex align-items-center">
                            <Badge variant="success" className="me-3"><FontAwesomeIcon icon={faShoppingCart} /></Badge>
                            <h6 className="mb-0 fw-bold border-bottom pb-2 flex-grow-1">Operation Context</h6>
                        </div>
                        <div className="col-12">
                            <Select
                                label="Target Asset"
                                value={transFormData.item_id}
                                onChange={(e) => setTransFormData({ ...transFormData, item_id: e.target.value })}
                                required
                                placeholder="Choose resource..."
                                options={items.map(i => ({
                                    label: `${i.name} (Available: ${i.quantity})`,
                                    value: i.id
                                }))}
                            />
                        </div>
                        <div className="col-md-6">
                            <Select
                                label="Operational Nature"
                                value={transFormData.type}
                                onChange={(e) => setTransFormData({ ...transFormData, type: e.target.value })}
                                options={[
                                    { label: 'Stock Inflow (+)', value: 'IN' },
                                    { label: 'Stock Outflow (-)', value: 'OUT' }
                                ]}
                            />
                        </div>
                        <div className="col-md-6">
                            <Input label="Volume" type="number" value={transFormData.quantity} onChange={(e) => setTransFormData({ ...transFormData, quantity: e.target.value })} required />
                        </div>
                        <div className="col-12">
                            <Input label="Record Date" type="date" value={transFormData.date} onChange={(e) => setTransFormData({ ...transFormData, date: e.target.value })} />
                        </div>
                        <div className="col-12">
                            <Input label="Internal Remarks" value={transFormData.remarks} onChange={(e) => setTransFormData({ ...transFormData, remarks: e.target.value })} rows={3} placeholder="Auditing details..." />
                        </div>
                    </div>
                    <div className="d-flex justify-content-end gap-3 mt-4">
                        <Button variant="light" onClick={handleTransClose}>Cancel</Button>
                        <Button type="submit" loading={submitLoading}>Execute Transformation</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Inventory;
