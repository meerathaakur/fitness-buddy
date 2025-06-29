import React, { useState } from 'react'
import { MessageCircle, Calendar, MoreVertical, UserMinus, Star, MapPin, Clock, Activity, TrendingUp, Users } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Avatar from '../../components/common/Avatar'
import { toast } from '../../components/common/Toast'

export default function MyBuddies() {
  const [buddies, setBuddies] = useState([
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'New York, NY',
      fitnessLevel: 'intermediate',
      workoutPreferences: ['strength', 'cardio'],
      status: 'connected',
      lastWorkout: '2024-12-07',
      totalWorkouts: 15,
      rating: 4.8,
      isOnline: true,
      connectionDate: '2024-11-15',
      recentActivity: 'Completed Upper Body Strength workout',
      activityTime: '2 hours ago'
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Brooklyn, NY',
      fitnessLevel: 'advanced',
      workoutPreferences: ['strength', 'powerlifting'],
      status: 'connected',
      lastWorkout: '2024-12-06',
      totalWorkouts: 23,
      rating: 4.9,
      isOnline: false,
      connectionDate: '2024-10-20',
      recentActivity: 'Achieved new deadlift PR: 315 lbs!',
      activityTime: '5 hours ago'
    },
    {
      id: '3',
      name: 'Emma Davis',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Manhattan, NY',
      fitnessLevel: 'beginner',
      workoutPreferences: ['yoga', 'pilates'],
      status: 'connected',
      lastWorkout: '2024-12-08',
      totalWorkouts: 8,
      rating: 4.7,
      isOnline: true,
      connectionDate: '2024-12-01',
      recentActivity: 'Joined 30-Day Yoga Challenge',
      activityTime: '1 day ago'
    },
    {
      id: '4',
      name: 'David Kim',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Queens, NY',
      fitnessLevel: 'intermediate',
      workoutPreferences: ['running', 'cycling'],
      status: 'connected',
      lastWorkout: '2024-12-05',
      totalWorkouts: 18,
      rating: 4.6,
      isOnline: false,
      connectionDate: '2024-11-10',
      recentActivity: 'Completed 5K run in 22:30',
      activityTime: '3 days ago'
    }
  ])

  const [activeTab, setActiveTab] = useState('all')

  const recentActivities = [
    {
      id: 1,
      buddy: buddies[0],
      activity: 'Completed Upper Body Strength workout',
      time: '2 hours ago',
      type: 'workout'
    },
    {
      id: 2,
      buddy: buddies[1],
      activity: 'Achieved new deadlift PR: 315 lbs!',
      time: '5 hours ago',
      type: 'achievement'
    },
    {
      id: 3,
      buddy: buddies[2],
      activity: 'Joined 30-Day Yoga Challenge',
      time: '1 day ago',
      type: 'challenge'
    },
    {
      id: 4,
      buddy: buddies[3],
      activity: 'Completed 5K run in 22:30',
      time: '3 days ago',
      type: 'workout'
    },
    {
      id: 5,
      buddy: buddies[0],
      activity: 'Reached weight loss goal milestone',
      time: '2 days ago',
      type: 'goal'
    }
  ]

  const handleMessage = (buddy) => {
    toast.info(`Opening chat with ${buddy.name}`)
  }

  const handleScheduleWorkout = (buddy) => {
    toast.success(`Workout scheduled with ${buddy.name}`)
  }

  const handleRemoveBuddy = (buddyId) => {
    setBuddies(prev => prev.filter(b => b.id !== buddyId))
    toast.success('Buddy removed successfully')
  }

  const filteredBuddies = buddies.filter(buddy => {
    if (activeTab === 'online') return buddy.isOnline
    if (activeTab === 'recent') return new Date(buddy.lastWorkout) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return true
  })

  const tabs = [
    { id: 'all', label: 'All Buddies', count: buddies.length },
    { id: 'online', label: 'Online', count: buddies.filter(b => b.isOnline).length },
    { id: 'recent', label: 'Recent Activity', count: recentActivities.length }
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case 'workout': return <Activity className="w-4 h-4 text-blue-600" />
      case 'achievement': return <Star className="w-4 h-4 text-yellow-600" />
      case 'challenge': return <TrendingUp className="w-4 h-4 text-purple-600" />
      case 'goal': return <Clock className="w-4 h-4 text-green-600" />
      default: return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Fitness Buddies</h1>
          <p className="text-gray-600 mt-1">Manage your workout partners and connections</p>
        </div>
        <div className="text-sm text-gray-500">
          {buddies.length} total buddies
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Buddies</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{buddies.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Online Now</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{buddies.filter(b => b.isOnline).length}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Shared Workouts</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">42</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">4.8</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'recent' ? (
        /* Recent Activity Feed */
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <Avatar src={activity.buddy.avatar} alt={activity.buddy.name} size="md" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {getActivityIcon(activity.type)}
                    <span className="font-medium text-gray-900">{activity.buddy.name}</span>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                  <p className="text-gray-700">{activity.activity}</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleMessage(activity.buddy)}>
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        /* Buddies Grid */
        filteredBuddies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBuddies.map((buddy) => (
              <Card key={buddy.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar src={buddy.avatar} alt={buddy.name} size="lg" />
                      {buddy.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{buddy.name}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        {buddy.location}
                      </div>
                    </div>
                  </div>
                  <div className="relative group">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <div className="py-1">
                        <button
                          onClick={() => handleRemoveBuddy(buddy.id)}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <UserMinus className="w-4 h-4 mr-2" />
                          Remove Buddy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Recent Activity</span>
                  </div>
                  <p className="text-sm text-blue-800">{buddy.recentActivity}</p>
                  <p className="text-xs text-blue-600 mt-1">{buddy.activityTime}</p>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Fitness Level</span>
                    <span className="font-medium text-gray-900 capitalize">{buddy.fitnessLevel}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Workouts</span>
                    <span className="font-medium text-gray-900">{buddy.totalWorkouts}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium text-gray-900 ml-1">{buddy.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Workout</span>
                    <div className="flex items-center text-gray-900">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(buddy.lastWorkout).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Workout Preferences</p>
                  <div className="flex flex-wrap gap-1">
                    {buddy.workoutPreferences.map((pref, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize"
                      >
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleMessage(buddy)}
                    className="flex-1"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleScheduleWorkout(buddy)}
                    className="flex-1"
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    Schedule
                  </Button>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Connected since {new Date(buddy.connectionDate).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'online' ? 'No buddies online' : 'No buddies yet'}
              </h3>
              <p className="text-gray-600 mb-4">
                {activeTab === 'online' ? 'None of your buddies are currently online.' :
                 'Start connecting with other fitness enthusiasts to build your buddy network.'}
              </p>
              {activeTab === 'all' && (
                <Button>
                  Find Buddies
                </Button>
              )}
            </div>
          </Card>
        )
      )}
    </div>
  )
}