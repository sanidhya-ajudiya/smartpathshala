import React, { useState, useEffect } from 'react';
import transportService from '../services/transportService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch, faBus, faRoute, faMapMarkerAlt, faIdCard, faUsers } from '@fortawesome/free-solid-svg-icons';
import PageHeader from '../components/UI/PageHeader';
import Card from '../components/UI/Card';
import Table from '../components/UI/Table';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Modal from '../components/UI/Modal';
import Badge from '../components/UI/Badge';
import { showSuccess, showError, confirmDelete } from '../utils/sweetalert';

const Transport = () => {
    const [activeTab, setActiveTab] = useState('routes');
    const [routes, setRoutes] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentRoute, setCurrentRoute] = useState(null);
    const [currentVehicle, setCurrentVehicle] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Form States
    const [routeFormData, setRouteFormData] = useState({
        route_name: '', start_point: '', end_point: '', fare: ''
    });

    const [vehicleFormData, setVehicleFormData] = useState({
        vehicle_number: '', driver_name: '', driver_phone: '', capacity: ''
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            setLoading(true);
            if (activeTab === 'routes') {
                const data = await transportService.getAllRoutes();
                setRoutes(data.data || []);
            } else {
                const data = await transportService.getAllVehicles();
                setVehicles(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            showError('Data Error', 'Failed to synchronize transport records.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => setSearchTerm(e.target.value);

    const filteredRoutes = routes.filter(r =>
        r.route_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.start_point?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.end_point?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredVehicles = vehicles.filter(v =>
        v.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.driver_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleClose = () => {
        setShowModal(false);
        setCurrentRoute(null);
        setCurrentVehicle(null);
        setRouteFormData({ route_name: '', start_point: '', end_point: '', fare: '' });
        setVehicleFormData({ vehicle_number: '', driver_name: '', driver_phone: '', capacity: '' });
    };

    const handleShow = (item = null) => {
        if (activeTab === 'routes') {
            if (item) {
                setCurrentRoute(item);
                setRouteFormData({
                    route_name: item.route_name || '',
                    start_point: item.start_point || '',
                    end_point: item.end_point || '',
                    fare: item.fare || ''
                });
            }
        } else {
            if (item) {
                setCurrentVehicle(item);
                setVehicleFormData({
                    vehicle_number: item.vehicle_number || '',
                    driver_name: item.driver_name || '',
                    driver_phone: item.driver_phone || '',
                    capacity: item.capacity || ''
                });
            }
        }
        setShowModal(true);
    };

    const handleRouteSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            if (currentRoute) {
                await transportService.updateRoute(currentRoute.id, routeFormData);
                showSuccess('Updated!', 'Route information has been successfully modified.');
            } else {
                await transportService.createRoute(routeFormData);
                showSuccess('Created!', 'New transport route has been registered.');
            }
            fetchData();
            handleClose();
        } catch (error) {
            showError('Submission Failed', 'Could not save route information.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleVehicleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            if (currentVehicle) {
                await transportService.updateVehicle(currentVehicle.id, vehicleFormData);
                showSuccess('Updated!', 'Vehicle details have been successfully modified.');
            } else {
                await transportService.createVehicle(vehicleFormData);
                showSuccess('Created!', 'New vehicle has been added to the fleet.');
            }
            fetchData();
            handleClose();
        } catch (error) {
            showError('Submission Failed', 'Could not save vehicle details.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await confirmDelete(
            'Confirm Removal',
            `Are you sure you want to delete this ${activeTab === 'routes' ? 'route' : 'vehicle'}? This action is permanent.`
        );

        if (result.isConfirmed) {
            try {
                if (activeTab === 'routes') await transportService.deleteRoute(id);
                else await transportService.deleteVehicle(id);
                showSuccess('Deleted', 'Record removed from the ecosystem.');
                fetchData();
            } catch (error) {
                showError('Deletion Failed', 'System encountered an error while removing the record.');
            }
        }
    };

    const routeColumns = [
        {
            header: 'Route Identity',
            render: (row) => (
                <div className="d-flex align-items-center">
                    <div className="bg-primary-soft text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                        <FontAwesomeIcon icon={faRoute} />
                    </div>
                    <div className="fw-bold text-dark">{row.route_name}</div>
                </div>
            )
        },
        {
            header: 'Origins & Destinations',
            render: (row) => (
                <div className="small">
                    <div className="text-muted"><FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 opacity-50 text-success" />{row.start_point || 'N/A'}</div>
                    <div className="text-muted"><FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 opacity-50 text-danger" />{row.end_point || 'N/A'}</div>
                </div>
            )
        },
        {
            header: 'Service Fare',
            render: (row) => <div className="fw-bold text-dark">₹{parseFloat(row.fare || 0).toLocaleString()}</div>
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

    const vehicleColumns = [
        {
            header: 'Vehicle Info',
            render: (row) => (
                <div className="d-flex align-items-center">
                    <div className="bg-info-soft text-info rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                        <FontAwesomeIcon icon={faBus} />
                    </div>
                    <div>
                        <div className="fw-bold text-dark">{row.vehicle_number}</div>
                        <div className="small text-muted"><FontAwesomeIcon icon={faUsers} className="me-1" /> Cap: {row.capacity}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Assigned Driver',
            render: (row) => (
                <div className="small fw-semibold text-dark">
                    <FontAwesomeIcon icon={faIdCard} className="me-2 text-muted" />
                    {row.driver_name || 'Not Assigned'}
                </div>
            )
        },
        {
            header: 'Contact',
            render: (row) => <div className="small text-muted">{row.driver_phone || 'N/A'}</div>
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
                title="Transport & Logistics"
                subtitle="Monitor and organize institutional travel routes and vehicle fleet assets."
                breadcrumbs={[{ text: 'Transport', link: '/transport' }]}
                action={
                    <Button icon={<FontAwesomeIcon icon={faPlus} />} onClick={() => handleShow()}>
                        {activeTab === 'routes' ? 'Register New Route' : 'Add New Vehicle'}
                    </Button>
                }
            />

            <Card>
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
                    <div className="d-flex p-1 bg-light rounded-3" style={{ width: 'fit-content' }}>
                        <button
                            className={`btn btn-sm px-4 py-2 border-0 rounded-3 transition-all ${activeTab === 'routes' ? 'bg-white shadow-sm fw-bold text-primary' : 'text-muted'}`}
                            onClick={() => setActiveTab('routes')}
                        >
                            <FontAwesomeIcon icon={faRoute} className="me-2" /> Routes
                        </button>
                        <button
                            className={`btn btn-sm px-4 py-2 border-0 rounded-3 transition-all ${activeTab === 'vehicles' ? 'bg-white shadow-sm fw-bold text-primary' : 'text-muted'}`}
                            onClick={() => setActiveTab('vehicles')}
                        >
                            <FontAwesomeIcon icon={faBus} className="me-2" /> Vehicles
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
                    columns={activeTab === 'routes' ? routeColumns : vehicleColumns}
                    data={activeTab === 'routes' ? filteredRoutes : filteredVehicles}
                    loading={loading}
                    emptyMessage={`No ${activeTab} records found.`}
                />
            </Card>

            <Modal
                show={showModal}
                onHide={handleClose}
                title={activeTab === 'routes'
                    ? (currentRoute ? 'Modify Route' : 'Register New Route')
                    : (currentVehicle ? 'Modify Vehicle' : 'Register New Vehicle')
                }
            >
                {activeTab === 'routes' ? (
                    <form onSubmit={handleRouteSubmit}>
                        <div className="row">
                            <div className="col-12">
                                <Input label="Route Name" value={routeFormData.route_name} onChange={(e) => setRouteFormData({ ...routeFormData, route_name: e.target.value })} required />
                            </div>
                            <div className="col-md-6">
                                <Input label="Start Point" value={routeFormData.start_point} onChange={(e) => setRouteFormData({ ...routeFormData, start_point: e.target.value })} />
                            </div>
                            <div className="col-md-6">
                                <Input label="End Point" value={routeFormData.end_point} onChange={(e) => setRouteFormData({ ...routeFormData, end_point: e.target.value })} />
                            </div>
                            <div className="col-12">
                                <Input label="Fare (₹)" type="number" value={routeFormData.fare} onChange={(e) => setRouteFormData({ ...routeFormData, fare: e.target.value })} required step="0.01" />
                            </div>
                        </div>
                        <div className="d-flex justify-content-end gap-3 mt-4">
                            <Button variant="light" onClick={handleClose}>Cancel</Button>
                            <Button type="submit" loading={submitLoading}>Confirm</Button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleVehicleSubmit}>
                        <div className="row">
                            <div className="col-12">
                                <Input label="Vehicle Plate Number" value={vehicleFormData.vehicle_number} onChange={(e) => setVehicleFormData({ ...vehicleFormData, vehicle_number: e.target.value })} required />
                            </div>
                            <div className="col-12">
                                <Input label="Assigned Driver" value={vehicleFormData.driver_name} onChange={(e) => setVehicleFormData({ ...vehicleFormData, driver_name: e.target.value })} />
                            </div>
                            <div className="col-md-7">
                                <Input label="Driver Phone" value={vehicleFormData.driver_phone} onChange={(e) => setVehicleFormData({ ...vehicleFormData, driver_phone: e.target.value })} />
                            </div>
                            <div className="col-md-5">
                                <Input label="Seating Cap." type="number" value={vehicleFormData.capacity} onChange={(e) => setVehicleFormData({ ...vehicleFormData, capacity: e.target.value })} required />
                            </div>
                        </div>
                        <div className="d-flex justify-content-end gap-3 mt-4">
                            <Button variant="light" onClick={handleClose}>Cancel</Button>
                            <Button type="submit" loading={submitLoading}>Confirm</Button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default Transport;
