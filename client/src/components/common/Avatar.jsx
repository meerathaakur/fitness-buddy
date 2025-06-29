import React from 'react'

export default function Avatar({ src, alt, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20'
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-medium">
          {alt?.charAt(0)?.toUpperCase() || '?'}
        </div>
      )}
    </div>
  )
}