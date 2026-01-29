import React from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { WorkoutProvider } from './contexts/WorkoutContext'
import { NotificationProvider } from './contexts/NotificationContext'
import AppRouter from './router/AppRouter'
import Toast from './components/common/Toast'
import { BuddyProvider } from './contexts/BuddiesContext'

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <BuddyProvider>
          <WorkoutProvider>
            <main className="flex-grow mx-auto">
              <AppRouter />
            </main>
            <Toast />
          </WorkoutProvider>
        </BuddyProvider>
      </AuthProvider>
    </NotificationProvider>
  )
}

export default App