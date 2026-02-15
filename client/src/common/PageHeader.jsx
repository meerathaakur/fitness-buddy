import React from 'react'
import BackButton from './BackButton'

export default function PageHeader({
    title,
    subtitle,
    children,
    showBack = true,
    backTo,
    backLabel,
    showHome = false,
    className = ''
}) {
    return (
        <div className={`space-y-4 ${className}`}>
            {showBack && (
                <BackButton
                    to={backTo}
                    label={backLabel}
                    showHome={showHome}
                />
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                    {subtitle && (
                        <p className="text-gray-600 mt-1">{subtitle}</p>
                    )}
                </div>
                {children && (
                    <div className="flex items-center space-x-3">
                        {children}
                    </div>
                )}
            </div>
        </div>
    )
}