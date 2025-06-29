import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { WorkoutProvider } from './contexts/WorkoutContext'
import {NotificationProvider} from './contexts/NotificationContext'
import AppRouter from './router/AppRouter'
import Toast from './components/common/Toast'
// import Navbar from './components/common/Navbar'
// import Footer from './components/Footer'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <NotificationProvider>
        <AuthProvider>
          <WorkoutProvider>
              <main className="flex-grow mx-auto">
                <AppRouter />
              </main>
              <Toast />
          </WorkoutProvider>
        </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App