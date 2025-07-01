// Enhanced form field component with validation and coastal theme
'use client';

import React, { useState } from 'react';

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea' | 'select' | 'date';
  value: string;
  onChange: (name: string, value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  validationRules?: ValidationRule[];
  options?: { value: string; label: string }[];
  rows?: number;
  icon?: React.ReactNode;
  hint?: string;
  className?: string;
  min?: string;
  max?: string;
  step?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  validationRules = [],
  options = [],
  rows = 3,
  icon,
  hint,
  className = '',
  min,
  max,
  step
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasBeenTouched, setHasBeenTouched] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateField = (fieldValue: string) => {
    const errors: string[] = [];
    
    if (required && !fieldValue.trim()) {
      errors.push(`${label} là bắt buộc`);
    }
    
    validationRules.forEach(rule => {
      if (fieldValue && !rule.test(fieldValue)) {
        errors.push(rule.message);
      }
    });
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newValue = e.target.value;
    onChange(name, newValue);
    
    if (hasBeenTouched) {
      validateField(newValue);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    setHasBeenTouched(true);
    validateField(value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const hasError = error || validationErrors.length > 0;
  const displayError = error || validationErrors[0];

  const getInputStyles = () => {
    const baseStyles = `
      w-full px-4 py-3 border rounded-lg font-roboto text-sm transition-all duration-200 
      focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
      ${icon ? 'pl-11' : ''}
    `;
    
    if (hasError && hasBeenTouched) {
      return `${baseStyles} border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50`;
    }
    
    if (value && !hasError) {
      return `${baseStyles} border-green-300 focus:border-green-500 focus:ring-green-500/20 bg-green-50/50`;
    }
    
    return `${baseStyles} border-[#E5F3FF] focus:border-[#2B5797] focus:ring-[#2B5797]/20 bg-white`;
  };
  const renderInput = () => {
    const inputProps = {
      id: name,
      name,
      value,
      onChange: handleChange,
      onBlur: handleBlur,
      onFocus: handleFocus,
      placeholder,
      disabled,
      className: getInputStyles(),
      'aria-describedby': hint ? `${name}-hint` : undefined,
      'aria-invalid': hasError && hasBeenTouched ? 'true' : 'false',
      ...(min && { min }),
      ...(max && { max }),
      ...(step && { step }),
    } as any;

    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...inputProps}
            rows={rows}
            className={`${inputProps.className} resize-none`}
          />
        );
      
      case 'select':
        return (
          <select {...inputProps}>
            <option value="">{placeholder || `Chọn ${label.toLowerCase()}`}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      default:
        return <input {...inputProps} type={type} />;
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      <label 
        htmlFor={name}
        className="block text-sm font-medium text-[#1A365D] font-rubik"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input Container */}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B]">
            {icon}
          </div>
        )}
        
        {renderInput()}
        
        {/* Validation Icon */}
        {hasBeenTouched && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {hasError ? (
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : value ? (
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : null}
          </div>
        )}
      </div>

      {/* Hint */}
      {hint && !hasError && (
        <p id={`${name}-hint`} className="text-xs text-[#64748B] font-roboto">
          {hint}
        </p>
      )}

      {/* Error Message */}
      {hasError && hasBeenTouched && (
        <p className="text-xs text-red-600 font-roboto flex items-center space-x-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{displayError}</span>
        </p>
      )}

      {/* Character Count for textarea */}
      {type === 'textarea' && value && (
        <div className="flex justify-end">
          <span className="text-xs text-[#64748B] font-roboto">
            {value.length} ký tự
          </span>
        </div>
      )}
    </div>
  );
};

export default FormField;
