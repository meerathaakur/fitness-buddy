import React, { createContext, useState } from 'react'
import {
  createWorkoutAPI,
  getUserWorkoutAPI,
  getWeeklyAnalyticsAPI,
  getMonthlyAnalyticsAPI,
  getWorkoutStatsAPI,
  getWorkoutAPI,
  updateWorkoutAPI,
  deleteWorkoutAPI,
  createGoalAPI,
  // findBuddyAPI,
  // getBuddyAPI,
  // sendBuddyRequestAPI,
  // responseToBuddyRequestAPI
} from '../api/all.api'

const WorkoutContext = createContext()

const getStoredToken = () => localStorage.getItem('token') || sessionStorage.getItem('token')

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([])
  const [token, setToken] = useState(getStoredToken())

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

  // -----WORKOUT API CALLS------
  // workoutData -->{title, images, duration, type, caloriesBurned, intensity, location, buddies, images, isPublic, exercises, workoutDate}
  const addWorkout = async (workoutData) => {
    try {
      const response = await fetch(createWorkoutAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(workoutData)
      })
      if (!response.ok) {
        return { success: response.ok }
      }

      const data = await response.json()
      console.log("addWorkout:::",data)
      // setWorkouts()
      return data; //{ success: response.ok, data: data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const getUserWorkouts = async () => {
    try {
      const response = await fetch(getUserWorkoutAPI, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        return { success: response.ok }
      }

      const data = await response.json()
      console.log("getUserWorkouts:::", data)
      return data
    } catch (error) {
      return { success: false, error: error.message }

    }

  }

  const getWeeklyAnalytics = async () => {
    try {
      const response = await fetch(getWeeklyAnalyticsAPI, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      if (!response.ok) {
        return { success: response.ok }
      }

      const data = await response.json()
      console.log("data:::",data)
      return data
    } catch (error) {
      return { success: false, error: error.message }

    }
  }

  const getMonthlyAnalytics = async () => {
    try {
      const response = await fetch(getMonthlyAnalyticsAPI, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      if (!response.ok) {
        return { success: response.ok }
      }

      const data = await response.json()
      console.log(data)
      return data
    } catch (error) {
      return { success: false, error: error.message }

    }
  }

  const getWorkoutStats = async () => {
    try {
      const response = await fetch(getWorkoutStatsAPI, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      if (!response.ok) {
        return { success: response.ok }
      }

      const data = await response.json()
      console.log(data)
      return data;
    } catch (error) {
      return { success: false, error: error.message }

    }
  }

  const getWorkoutById = async (id) => {
    try {
      const response = await fetch(`${getWorkoutAPI}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      if (!response.ok) {
        return { success: response.ok }
      }

      const data = await response.json()
      console.log(data)
      return data
    } catch (error) {
      return { success: false, error: error.message }

    }
  }

  // updates-->{title, type,duration,}
  const updateWorkout = async (id, updateData) => {

    try {
      const response = await fetch(`${updateWorkoutAPI}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      })
      if (!response.ok) {
        return { success: response.ok }
      }

      const data = await response.json()
      console.log(data)
      return data
    } catch (error) {
      return { success: false, error: error.message }

    }

  }

  const deleteWorkout = async (id) => {
    try {
      const response = await fetch(`${deleteWorkoutAPI}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      if (!response.ok) {
        return { success: false, status: response.status }
      }
      
      return { success: true, message:"Workout deleted successfully" }
    } catch (error) {
      return { success: false, error: error.message }

    }
  }

  // =====GOAL API CALLS=====
  const addGoal = async (goalData) => {
    try {
      const response = await fetch(createGoalAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(goalData)
      })
      if (!response.ok) {
        return { success: response.ok }
      }
      const data = await response.json()
      console.log("POST goalData:::", data)
      return data; //{ success: response.ok, data: data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // const updateGoal = (id, updates) => {

  // }

  // const deleteGoal = (id) => {

  // }



  const value = {
    workouts,
    goals,
    addWorkout,
    getUserWorkouts,
    getWeeklyAnalytics,
    getMonthlyAnalytics,
    getWorkoutStats,
    getWorkoutById,
    updateWorkout,
    deleteWorkout,
    addGoal,

  }

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  )
}

export { WorkoutContext }