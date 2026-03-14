import React from 'react';
import { Modal as RbModal } from 'react-bootstrap';

const Modal = ({ show, onHide, title, children, footer, size = 'md', centered = true }) => {
    return (
        <RbModal show={show} onHide={onHide} centered={centered} size={size} contentClassName="border-0 shadow-lg overflow-hidden">
            <RbModal.Header closeButton className="bg-light border-0 py-3 px-4">
                <RbModal.Title className="fw-bold text-primary h5 mb-0">
                    {title}
                </RbModal.Title>
            </RbModal.Header>
            <RbModal.Body className="p-4">
                {children}
            </RbModal.Body>
            {footer && (
                <RbModal.Footer className="bg-light border-0 py-3 px-4">
                    {footer}
                </RbModal.Footer>
            )}
        </RbModal>
    );
};

export default Modal;
