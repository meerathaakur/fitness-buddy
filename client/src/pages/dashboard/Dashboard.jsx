import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  TrendingUp,
  Users,
  Target,
  Trophy,
  Calendar,
  Flame,
  Clock,
  Dumbbell,
  Zap
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Avatar from '../../components/common/Avatar'
import { useAuth } from '../../hooks/useAuth'
import { getUserAnalyticsAPI } from '../../api/all.api'
import { PageLoader } from '../../components/common/Loader'



export default function Dashboard() {
  const { user, loading } = useAuth()
  const [goal, setGoal] = useState({
    active: 0,
    completed: 0,
    completionRate: 0,
    total: 0
  })
  const [streak, setStreak] = useState({
    current: 0,
    max: 0
  })
  const [weeklyProgress, setWeeklyProgress] = useState([])
  const [workout, setWorkOut] = useState({
    byType: {},
    total: 0,
    totalCalories: 0,
    totalDuration: 0
  })
  // console.log(user, loading)
  async function getUserAnalysisData(validation) {
    const response = await fetch(getUserAnalyticsAPI, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validation}`
      }
    })

    if (!response.ok) {
      throw new Error("Failed to fetch Analytic Data:", response.status)
    }

    const data = await response.json()
    setGoal((prev) => ({ ...prev, ...data.goals }));
    setStreak((prev) => ({ ...prev, ...data.streaks }));
    setWorkOut((prev) => ({ ...prev, ...data.workouts }));
    setWeeklyProgress(data.weeklyProgress || []);
    // console.log(data)
  }
  useEffect(() => {
    const token = localStorage.getItem("token")
    const session = sessionStorage.getItem("token")
    const validation = token ? token : session
    getUserAnalysisData(validation)
  }, [])



  function capitalizeFirst(str) {
    if (!str) return ""
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  if (loading) {
    return <PageLoader />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {capitalizeFirst(user?.name?.split(' ')[0])}! 👋
          </h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your fitness journey</p>
        </div>
        
      </div>
      <div>
        {/* Streaks */}
        <Card className="p-4 flex flex-col items-center">
          <div className='flex'>
            <h2 className="text-lg md:text-xl lg:text-xl font-semibold mr-2">Streaks</h2>
            <Zap className="w-8 h-8 text-yellow-500 ml-2" />
          </div>
          <div className='flex justify-around item-center w-full'>
            <p className="text-blue-800 font-semibold">Current: {streak.current} 🔥</p>
            <p className="text-yellow-700 font-semibold">Max: {streak.max} 🏆</p>
          </div>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Workouts */}
        <Card className="p-4 flex flex-col items-center ">
          <Dumbbell className="w-8 h-8 text-blue-600 mb-2" />
          <h2 className="text-lg md:text-xl lg:text-xl font-semibold text-blue-700">Workouts</h2>
          <div className='w-full'>

            <p className="text-gray-600">Total: {workout.total}</p>
            <p className="text-gray-600">Duration: {workout.totalDuration} min</p>
            <p className="text-gray-600">Calories: {workout.totalCalories}</p>
            {Object.keys(workout.byType).length > 0 && (
              <div>
                {Object.entries(workout.byType).map(([type, count]) => (
                  <p className='text-gray-600' key={type}>
                    {capitalizeFirst(type)}: {count}
                  </p>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Goals */}
        <Card className="p-4 flex flex-col items-center">
          <Target className="w-8 h-8 text-green-600 mb-2" />
          <h2 className="text-lg md:text-xl lg:text-xl font-semibold text-green-700">Goals</h2>
          <div className='w-full'>
            <p className="text-gray-600">Total: {goal.total}</p>
            <p className="text-gray-600">Active: {goal.active}</p>
            <p className="text-gray-600">Completed: {goal.completed}</p>
            <p className="text-gray-600">
              Completion Rate: {goal.completionRate}%
            </p>
          </div>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card className="p-4 flex flex-col items-center">
        <Calendar className="w-8 h-8 text-purple-600 mb-2" />
        <h2 className="text-lg md:text-xl lg:text-xl font-semibold mb-2 text-blue-900">Weekly Progress</h2>
        <ul className="text-gray-600 text-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {weeklyProgress.map((week, i) => (
            <li key={i} className="mb-2 border-b pb-2">
              <strong>{week.week}</strong>
              {Object.entries(week).map(([key, value]) => (
                key !== "week" && ( // skip the "week" label since you already show it
                  <p key={key}>
                    {key}: {value}
                  </p>
                )
              ))}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}