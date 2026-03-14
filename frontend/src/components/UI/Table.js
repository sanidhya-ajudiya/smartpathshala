import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInbox } from '@fortawesome/free-solid-svg-icons';

const Table = ({
    columns = [],
    data = [],
    loading = false,
    emptyMessage = 'No records found.',
    onRowClick,
    hover = true,
    className = ''
}) => {
    return (
        <div className={`table-container ${className}`}>
            <div className="table-responsive d-none d-md-block">
                <table className={`table ${hover ? 'table-hover' : ''}`}>
                    <thead>
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} style={col.style || {}} className={col.className || ''}>
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-5">
                                    <div className="spinner-grow text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-5">
                                    <div className="text-muted opacity-50 mb-3">
                                        <FontAwesomeIcon icon={faInbox} size="3x" />
                                    </div>
                                    <h6 className="text-muted">{emptyMessage}</h6>
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIdx) => (
                                <tr key={rowIdx} onClick={() => onRowClick && onRowClick(row)} style={{ cursor: onRowClick ? 'pointer' : 'default' }}>
                                    {columns.map((col, colIdx) => (
                                        <td key={colIdx} className={col.className || ''}>
                                            {col.render ? col.render(row) : row[col.accessor]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile View: Stacked Cards */}
            <div className="d-md-none">
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-grow text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : data.length === 0 ? (
                    <div className="text-center py-5 bg-white rounded shadow-sm">
                        <div className="text-muted opacity-50 mb-3">
                            <FontAwesomeIcon icon={faInbox} size="3x" />
                        </div>
                        <h6 className="text-muted">{emptyMessage}</h6>
                    </div>
                ) : (
                    data.map((row, rowIdx) => (
                        <div key={rowIdx} className="card border-0 shadow-sm mb-3" onClick={() => onRowClick && onRowClick(row)}>
                            <div className="card-body p-3">
                                {columns.map((col, colIdx) => (
                                    <div key={colIdx} className="mb-2 d-flex justify-content-between align-items-center">
                                        <span className="small text-muted fw-bold text-uppercase">{col.header}</span>
                                        <div className="text-end">
                                            {col.render ? col.render(row) : row[col.accessor]}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Table;
