import React from 'react'
import { Link } from 'react-router-dom'
import { Plus, TrendingUp, Users, Target, Trophy, Calendar, Flame } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Avatar from '../../components/common/Avatar'
import { useAuth } from '../../hooks/useAuth'

export default function Dashboard() {
  const { user } = useAuth()

  const stats = [
    { label: 'Workouts This Week', value: '4', icon: TrendingUp, color: 'text-blue-600' },
    { label: 'Active Buddies', value: '12', icon: Users, color: 'text-green-600' },
    { label: 'Goals Completed', value: '3', icon: Target, color: 'text-purple-600' },
    { label: 'Challenges Won', value: '2', icon: Trophy, color: 'text-yellow-600' }
  ]

  const recentWorkouts = [
    { id: 1, name: 'Morning Strength', type: 'Strength', duration: '45 min', calories: 320, date: '2024-12-08' },
    { id: 2, name: 'Evening Cardio', type: 'Cardio', duration: '30 min', calories: 280, date: '2024-12-07' },
    { id: 3, name: 'Yoga Flow', type: 'Yoga', duration: '60 min', calories: 180, date: '2024-12-06' }
  ]

  const upcomingWorkouts = [
    { id: 1, name: 'Leg Day', time: '6:00 PM', buddy: 'Sarah Johnson' },
    { id: 2, name: 'Morning Run', time: '7:00 AM', buddy: 'Mike Chen' }
  ]

  return (
    <div className="space-y-6 mt-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your fitness journey</p>
        </div>
        <Link to="/workouts">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Log Workout
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Workouts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Workouts</h2>
            <Link to="/workouts" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentWorkouts.map((workout) => (
              <div key={workout.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{workout.name}</p>
                    <p className="text-sm text-gray-600">{workout.type} • {workout.duration}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{workout.calories} cal</p>
                  <p className="text-xs text-gray-500">{workout.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Workouts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Workouts</h2>
            <Link to="/buddies" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Schedule more
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingWorkouts.map((workout) => (
              <div key={workout.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{workout.name}</p>
                    <p className="text-sm text-gray-600">with {workout.buddy}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{workout.time}</p>
                  <p className="text-xs text-gray-500">Today</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">This Week's Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">4/5</p>
            <p className="text-sm text-gray-600">Workouts Completed</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-3">
              <Flame className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">1,240</p>
            <p className="text-sm text-gray-600">Calories Burned</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
              <Target className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">80%</p>
            <p className="text-sm text-gray-600">Goal Progress</p>
          </div>
        </div>
      </Card>
    </div>
  )
}