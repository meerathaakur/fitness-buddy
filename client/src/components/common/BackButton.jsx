import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'
import Button from './Button'

export default function BackButton({
    to,
    label,
    showHome = false,
    className = '',
    variant = 'ghost',
    size = 'sm'
}) {
    const navigate = useNavigate()
    const location = useLocation()

    // Don't show back button on dashboard (home page)
    if (location.pathname === '/dashboard') {
        return null
    }

    const handleBack = () => {
        if (to) {
            navigate(to)
        } else {
            // Check if there's history to go back to
            if (window.history.length > 1) {
                navigate(-1)
            } else {
                // Fallback to dashboard if no history
                navigate('/dashboard')
            }
        }
    }

    const handleHome = () => {
        navigate('/dashboard')
    }

    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <Button
                variant={variant}
                size={size}
                onClick={handleBack}
                className="flex items-center"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                {label || 'Back'}
            </Button>

            {showHome && location.pathname !== '/' && (
                <Button
                    variant="ghost"
                    size={size}
                    onClick={handleHome}
                    className="flex items-center"
                >
                    <Home className="w-4 h-4 mr-1" />
                    Home
                </Button>
            )}
        </div>
    )
}