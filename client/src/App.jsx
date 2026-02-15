import React from 'react'
import { AuthProvider } from './module/auth/AuthContext'
import { WorkoutProvider } from './module/workouts/WorkoutContext'
import AppRouter from './router/AppRouter'
import { NotificationProvider } from './module/notifications/NotificationContext'
import Toast from './common/Toast'
import { BuddyProvider } from './module/buddies/BuddiesContext'

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