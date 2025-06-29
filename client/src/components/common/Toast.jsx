import React, { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

let toastId = 0
const toasts = []
let setToastsCallback = null

export const toast = {
  success: (message) => addToast(message, 'success'),
  error: (message) => addToast(message, 'error'),
  info: (message) => addToast(message, 'info'),
  warning: (message) => addToast(message, 'warning')
}

const addToast = (message, type) => {
  const id = ++toastId
  const newToast = { id, message, type }
  toasts.push(newToast)

  if (setToastsCallback) {
    setToastsCallback([...toasts])
  }

  setTimeout(() => {
    removeToast(id)
  }, 5000)
}

const removeToast = (id) => {
  const index = toasts.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.splice(index, 1)
    if (setToastsCallback) {
      setToastsCallback([...toasts])
    }
  }
}

export default function Toast() {
  const [toastList, setToastList] = useState([])

  useEffect(() => {
    setToastsCallback = setToastList
    return () => {
      setToastsCallback = null
    }
  }, [])

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle
  }

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toastList.map((toast) => {
        const Icon = icons[toast.type]
        return (
          <div
            key={toast.id}
            className={`flex items-center p-4 rounded-lg border shadow-lg max-w-sm animate-slide-up ${colors[toast.type]}`}
          >
            <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 flex-shrink-0 hover:opacity-70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}