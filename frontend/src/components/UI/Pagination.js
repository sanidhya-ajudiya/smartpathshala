import React from 'react';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    className = ''
}) => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <nav className={`d-flex justify-content-center mt-4 ${className}`}>
            <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link border-0 shadow-sm mx-1 rounded" onClick={() => onPageChange(currentPage - 1)}>
                        Previous
                    </button>
                </li>
                {pages.map(page => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <button
                            className={`page-link border-0 shadow-sm mx-1 rounded ${currentPage === page ? 'bg-primary text-white' : 'bg-white text-dark'}`}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </button>
                    </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link border-0 shadow-sm mx-1 rounded" onClick={() => onPageChange(currentPage + 1)}>
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
