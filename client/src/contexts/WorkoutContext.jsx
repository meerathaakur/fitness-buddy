import React, { createContext, useState } from 'react'

const WorkoutContext = createContext()

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([
    {
      id: '1',
      title: 'Morning Strength Training',
      type: 'strength',
      duration: 45,
      calories: 320,
      date: '2024-12-08',
      completed: true,
      exercises: [
        { id: '1', name: 'Squats', sets: 3, reps: 12, weight: 135 },
        { id: '2', name: 'Bench Press', sets: 3, reps: 10, weight: 155 },
        { id: '3', name: 'Deadlifts', sets: 3, reps: 8, weight: 185 }
      ]
    },
    {
      id: '2',
      title: 'Evening Cardio',
      type: 'cardio',
      duration: 30,
      calories: 280,
      date: '2024-12-07',
      completed: true,
      exercises: [
        { id: '1', name: 'Treadmill Run', duration: 30, distance: 3.2 }
      ]
    }
  ])

  const [goals, setGoals] = useState([
    {
      id: '1',
      title: 'Lose 10 pounds',
      description: 'Lose 10 pounds by March 2025',
      targetValue: 10,
      currentValue: 3,
      unit: 'lbs',
      deadline: '2025-03-01',
      type: 'weight_loss',
      completed: false
    },
    {
      id: '2',
      title: 'Bench Press 200 lbs',
      description: 'Increase bench press to 200 lbs',
      targetValue: 200,
      currentValue: 155,
      unit: 'lbs',
      deadline: '2025-06-01',
      type: 'strength',
      completed: false
    }
  ])

  const [buddies, setBuddies] = useState([
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'New York, NY',
      fitnessLevel: 'intermediate',
      workoutPreferences: ['strength', 'cardio'],
      matchPercentage: 92,
      status: 'connected'
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Brooklyn, NY',
      fitnessLevel: 'advanced',
      workoutPreferences: ['strength', 'powerlifting'],
      matchPercentage: 85,
      status: 'pending'
    }
  ])

  const addWorkout = (workout) => {
    const newWorkout = {
      ...workout,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    }
    setWorkouts(prev => [newWorkout, ...prev])
  }

  const updateWorkout = (id, updates) => {
    setWorkouts(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w))
  }

  const deleteWorkout = (id) => {
    setWorkouts(prev => prev.filter(w => w.id !== id))
  }

  const addGoal = (goal) => {
    const newGoal = {
      ...goal,
      id: Date.now().toString()
    }
    setGoals(prev => [newGoal, ...prev])
  }

  const updateGoal = (id, updates) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g))
  }

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id))
  }

  const connectBuddy = (buddyId) => {
    setBuddies(prev => prev.map(b => 
      b.id === buddyId ? { ...b, status: 'connected' } : b
    ))
  }

  const value = {
    workouts,
    goals,
    buddies,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    addGoal,
    updateGoal,
    deleteGoal,
    connectBuddy
  }

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  )
}

export { WorkoutContext }