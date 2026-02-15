import React from 'react'
import { Check } from 'lucide-react'

export default function Checkbox({ 
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  className = '',
  size = 'md',
  ...props 
}) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const checkSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  }

  return (
    <label className={`flex items-start space-x-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div
          className={`
            ${sizes[size]} 
            border-2 rounded transition-all duration-200
            ${checked 
              ? 'bg-blue-600 border-blue-600' 
              : 'bg-white border-gray-300 hover:border-gray-400'
            }
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            flex items-center justify-center
          `}
        >
          {checked && (
            <Check className={`${checkSizes[size]} text-white`} />
          )}
        </div>
      </div>
      
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <div className={`font-medium text-gray-900 ${disabled ? 'text-gray-500' : ''}`}>
              {label}
            </div>
          )}
          {description && (
            <div className={`text-sm text-gray-600 ${disabled ? 'text-gray-400' : ''}`}>
              {description}
            </div>
          )}
        </div>
      )}
    </label>
  )
}