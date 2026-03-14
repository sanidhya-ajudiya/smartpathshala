import React from 'react';

const Select = ({
    label,
    name,
    value,
    onChange,
    options = [],
    required = false,
    className = '',
    error = '',
    placeholder = 'Select option',
    ...props
}) => {
    return (
        <div className={`form-group mb-3 ${className}`}>
            {label && <label className="form-label small fw-bold text-muted">{label}{required && ' *'}</label>}
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className={`form-select bg-light border-0 py-3 px-3 mt-1 ${error ? 'is-invalid' : ''}`}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((opt, idx) => (
                    <option key={idx} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <div className="invalid-feedback d-block mt-1">{error}</div>}
        </div>
    );
};

export default Select;
