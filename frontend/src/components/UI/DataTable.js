import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch, faFileCsv, faSort, faSortUp, faSortDown,
    faChevronLeft, faChevronRight, faAngleDoubleLeft, faAngleDoubleRight
} from '@fortawesome/free-solid-svg-icons';
import Button from './Button';
import Input from './Input';
import Select from './Select';

const DataTable = ({
    columns,
    data,
    loading = false,
    emptyMessage = 'No records found.',
    title = '',
    actions = null,
    enableSearch = true,
    enableExport = true,
    pagination = true,
    itemsPerPageOptions = [10, 25, 50, 100]
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Handle Sorting
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Filter & Sort Data
    const processedData = useMemo(() => {
        let filtered = [...data];

        // 1. Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                Object.values(item).some(val =>
                    String(val).toLowerCase().includes(lowerTerm)
                )
            );
        }

        // 2. Sort
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return filtered;
    }, [data, searchTerm, sortConfig]);

    // Pagination Logic
    const totalPages = Math.ceil(processedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = pagination ? processedData.slice(startIndex, startIndex + itemsPerPage) : processedData;

    // Export to CSV
    const exportCSV = () => {
        const headers = columns.map(col => col.header).join(',');
        const rows = processedData.map(row =>
            columns.map(col => {
                let cellData = row[col.accessor];
                // Handle render functions or specific formatting if needed, simplified here
                if (typeof cellData === 'string' && cellData.includes(',')) {
                    cellData = `"${cellData}"`;
                }
                return cellData;
            }).join(',')
        );

        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${title || 'export'}_${new Date().toISOString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="card border-0 shadow-sm">
                <div className="card-body p-5 text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card border-0 shadow-sm animate-fade-in">
            {/* Header / Toolbar */}
            <div className="card-header bg-white border-bottom-0 py-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                <div className="d-flex align-items-center gap-3 w-100 flex-wrap">
                    {title && <h5 className="mb-0 fw-bold">{title}</h5>}
                    {itemsPerPageOptions.length > 0 && pagination && (
                        <div className="d-flex align-items-center">
                            <small className="text-muted me-2">Show</small>
                            <select
                                className="form-select form-select-sm border-0 bg-light fw-bold"
                                style={{ width: '70px' }}
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                            >
                                {itemsPerPageOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <div className="d-flex align-items-center gap-2 w-100 justify-content-md-end">
                    {enableSearch && (
                        <div className="position-relative" style={{ maxWidth: '250px', width: '100%' }}>
                            <input
                                type="text"
                                className="form-control form-control-sm ps-4 border-0 bg-light"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FontAwesomeIcon icon={faSearch} className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted small" />
                        </div>
                    )}
                    {enableExport && (
                        <Button variant="light" size="sm" onClick={exportCSV} title="Export CSV">
                            <FontAwesomeIcon icon={faFileCsv} className="text-success" />
                        </Button>
                    )}
                    {actions}
                </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                        <tr>
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    className={`border-0 py-3 px-3 fw-bold text-muted small text-uppercase ${col.sortable ? 'cursor-pointer hover-text-primary' : ''} ${col.className || ''}`}
                                    onClick={() => col.sortable && requestSort(col.accessor)}
                                    style={{ whiteSpace: 'nowrap' }}
                                >
                                    {col.header}
                                    {col.sortable && (
                                        <span className="ms-2">
                                            {sortConfig.key === col.accessor ? (
                                                sortConfig.direction === 'asc' ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />
                                            ) : (
                                                <FontAwesomeIcon icon={faSort} className="opacity-25" />
                                            )}
                                        </span>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row, rowIdx) => (
                                <tr key={row.id || rowIdx} className="transition-all">
                                    {columns.map((col, colIdx) => (
                                        <td key={colIdx} className={`px-3 py-3 border-bottom-soft ${col.className || ''}`}>
                                            {col.render ? col.render(row) : row[col.accessor]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-5 text-muted">
                                    <div className="opacity-50 mb-2">
                                        <FontAwesomeIcon icon={faSearch} size="2x" />
                                    </div>
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            {pagination && totalPages > 1 && (
                <div className="card-footer bg-white border-top-0 py-3 d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, processedData.length)} of {processedData.length} entries
                    </small>
                    <div className="btn-group">
                        <button
                            className="btn btn-sm btn-light border-0 text-muted"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                        >
                            <FontAwesomeIcon icon={faAngleDoubleLeft} />
                        </button>
                        <button
                            className="btn btn-sm btn-light border-0 text-muted"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        {[...Array(totalPages)].map((_, i) => {
                            // Logic to show limited page numbers (simplified here)
                            if (i + 1 === currentPage || i + 1 === 1 || i + 1 === totalPages || (i + 1 >= currentPage - 1 && i + 1 <= currentPage + 1)) {
                                return (
                                    <button
                                        key={i}
                                        className={`btn btn-sm border-0 ${currentPage === i + 1 ? 'btn-primary shadow-sm' : 'btn-light text-muted'}`}
                                        onClick={() => setCurrentPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                );
                            } else if (i + 1 === currentPage - 2 || i + 1 === currentPage + 2) {
                                return <span key={i} className="btn btn-sm btn-light border-0 disabled">...</span>;
                            }
                            return null;
                        })}
                        <button
                            className="btn btn-sm btn-light border-0 text-muted"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                        <button
                            className="btn btn-sm btn-light border-0 text-muted"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                            <FontAwesomeIcon icon={faAngleDoubleRight} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;
