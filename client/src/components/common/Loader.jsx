import React from 'react'

export default function Loader({ 
  size = 'md', 
  color = 'primary',
  text,
  className = '',
  fullScreen = false,
  overlay = false
}) {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16'
  }

  const colors = {
    primary: 'border-blue-600',
    secondary: 'border-gray-600',
    white: 'border-white',
    success: 'border-green-600',
    warning: 'border-yellow-600',
    danger: 'border-red-600'
  }

  const spinner = (
    <div
      className={`
        ${sizes[size]} 
        border-2 border-gray-200 border-t-2 ${colors[color]}
        rounded-full animate-spin
        ${className}
      `}
    />
  )

  const content = (
    <div className="flex flex-col items-center space-y-3">
      {spinner}
      {text && (
        <p className="text-sm text-gray-600 font-medium">{text}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 flex items-center justify-center ${overlay ? 'bg-black bg-opacity-50' : 'bg-white'} z-50`}>
        {content}
      </div>
    )
  }

  if (text) {
    return content
  }

  return spinner
}

// Specific loader variants for common use cases
export const ButtonLoader = ({ size = 'sm', color = 'white' }) => (
  <Loader size={size} color={color} />
)

export const PageLoader = ({ text = 'Loading...' }) => (
  <Loader size="xl" text={text} fullScreen overlay />
)

export const InlineLoader = ({ text }) => (
  <div className="flex items-center space-x-2">
    <Loader size="sm" />
    {text && <span className="text-sm text-gray-600">{text}</span>}
  </div>
)