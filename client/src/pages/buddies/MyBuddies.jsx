import React, { useState } from 'react'
import { MessageCircle, Calendar, MoreVertical, UserMinus, Star, MapPin, Clock, Activity, TrendingUp, Users } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Avatar from '../../components/common/Avatar'
import BuddyList from '../../components/buddies/BuddyList'
import PageHeader from '../../components/common/PageHeader'
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

  const handleMessage = (buddyId, buddyName) => {
    toast.info(`Opening chat with ${buddyName}`)
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
      <PageHeader 
        title="My Fitness Buddies"
        subtitle="Manage your workout partners and connections"
        backTo="/dashboard"
        showHome={true}
      >
        <div className="text-sm text-gray-500">
          {buddies.length} total buddies
        </div>
      </PageHeader>

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
                  <Button size="sm" variant="outline" onClick={() => handleMessage(activity.buddy.id, activity.buddy.name)}>
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        /* Buddies List */
        <BuddyList
          buddies={filteredBuddies}
          onConnect={() => {}}
          onMessage={handleMessage}
          showConnectButton={false}
          title=""
          emptyMessage="No buddies found"
          variant="detailed"
        />
      )}
    </div>
  )
}