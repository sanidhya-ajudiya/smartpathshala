import React from 'react';

const Input = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder,
    required = false,
    className = '',
    error = '',
    icon = null,
    rows = null,
    ...props
}) => {
    const InputTag = rows ? 'textarea' : 'input';

    return (
        <div className={`form-group mb-3 ${className}`}>
            {label && <label className="form-label small fw-bold text-muted">{label}{required && ' *'}</label>}
            <div className="position-relative">
                {icon && (
                    <div className="position-absolute text-muted" style={{ left: '1rem', top: rows ? '1rem' : '50%', transform: rows ? 'none' : 'translateY(-50%)' }}>
                        {icon}
                    </div>
                )}
                <InputTag
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    rows={rows}
                    className={`form-control bg-light border-0 py-3 px-3 ${icon ? 'ps-5' : ''} ${error ? 'is-invalid' : ''}`}
                    style={rows ? { minHeight: '100px' } : {}}
                    {...props}
                />
            </div>
            {error && <div className="invalid-feedback d-block mt-1">{error}</div>}
        </div>
    );
};

export default Input;
