import React, { createContext, useEffect, useState } from 'react'
import { createWorkoutAPI } from '../api/all.api'

const WorkoutContext = createContext()

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([])

  // useEffect(()=>{
  //   const token = localStorage.getItem("token")
  //   const session = sessionStorage.getItem("token")
  //   const validation = token ? token : session
  //   if(validation){
  //     setWorkouts()
  //   }

  // },[])

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
  // workoutData -->{title, images, duration, type, caloriesBurned, intensity, location, buddies, images, isPublic, exercises, workoutDate}
  const addWorkout = async (workoutData) => {
    try {
      const token = localStorage.getItem("token")
      const session = sessionStorage.getItem("token")
      const validation = token ? token : session
      const response = await fetch(createWorkoutAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${validation}`
        },
        body: JSON.stringify(workoutData)
      })
      if (!response.ok) {
        return { success: response.ok }
      }

      const data = await response.json()
      console.log(data)
      setWorkouts()
      return { success: response.ok, data: data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // const getUserWorkouts = () => {

  // }

  // const getWeeklyAnalytics=()=>{

  // }

  // const getMonthlyAnalytics=()=>{

  // }

  // const getWorkoutStats=()=>{

  // }

  // const getWorkoutById=()=>{

  // }

  // updates-->{title, type,duration,}
  // const updateWorkout = (id, updates) => {

  // }

  // const deleteWorkout = (id) => {

  // }


  // Buddies
  // const addGoal = (goal) => {

  // }

  // const updateGoal = (id, updates) => {

  // }

  // const deleteGoal = (id) => {

  // }

  // const connectBuddy = (buddyId) => {

  // }

  const value = {
    workouts,
    goals,
    buddies,
    addWorkout,
    // updateWorkout,
    // deleteWorkout,
    // addGoal,
    // updateGoal,
    // deleteGoal,
    // connectBuddy,
  }

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  )
}

export { WorkoutContext }