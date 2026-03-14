import Swal from 'sweetalert2';
import 'animate.css';

/**
 * Custom SweetAlert utility with Modern & Classic styling
 */

const toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    showClass: {
        popup: 'animate__animated animate__fadeInRight animate__faster'
    },
    hideClass: {
        popup: 'animate__animated animate__fadeOutRight animate__faster'
    }
});

export const showToast = (icon, title) => {
    toast.fire({
        icon: icon,
        title: title
    });
};

export const showSuccess = (title, message) => {
    return Swal.fire({
        icon: 'success',
        title: title || 'Success!',
        text: message,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        showClass: {
            popup: 'animate__animated animate__zoomIn animate__faster'
        },
        hideClass: {
            popup: 'animate__animated animate__zoomOut animate__faster'
        },
        customClass: {
            popup: 'modern-alert-popup',
            title: 'modern-alert-title',
            icon: 'modern-alert-icon'
        }
    });
};

export const showError = (title, message) => {
    return Swal.fire({
        icon: 'error',
        title: title || 'Error!',
        text: message,
        confirmButtonColor: '#0c0032',
        showClass: {
            popup: 'animate__animated animate__headShake animate__faster'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOut animate__faster'
        }
    });
};

export const confirmDelete = (title, text) => {
    return Swal.fire({
        title: title || 'Are you sure?',
        text: text || "This action cannot be undone!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff1744',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        showClass: {
            popup: 'animate__animated animate__fadeInDown animate__faster'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp animate__faster'
        },
        customClass: {
            popup: 'modern-alert-popup',
            confirmButton: 'rounded-pill px-4',
            cancelButton: 'rounded-pill px-4'
        }
    });
};

export const confirmAction = (title, text, confirmText = 'Confirm') => {
    return Swal.fire({
        title: title || 'Are you sure?',
        text: text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0c0032',
        cancelButtonColor: '#64748b',
        confirmButtonText: confirmText,
        cancelButtonText: 'Cancel',
        showClass: {
            popup: 'animate__animated animate__fadeInDown animate__faster'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp animate__faster'
        },
        customClass: {
            popup: 'modern-alert-popup',
            confirmButton: 'rounded-pill px-4',
            cancelButton: 'rounded-pill px-4'
        }
    });
};

export default {
    showToast,
    showSuccess,
    showError,
    confirmDelete,
    confirmAction
};
