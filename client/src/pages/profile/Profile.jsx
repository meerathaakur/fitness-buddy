import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Edit, Settings, MapPin, Calendar, Trophy, Target, Users, TrendingUp, Camera, Share2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Card from '../../components/common/Card'
import Avatar from '../../components/common/Avatar'
import Button from '../../components/common/Button'
import { toast } from '../../components/common/Toast'

const Profile = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data for profile stats and activities
  const stats = [
    { label: 'Total Workouts', value: '127', icon: TrendingUp, color: 'text-blue-600' },
    { label: 'Fitness Buddies', value: '23', icon: Users, color: 'text-green-600' },
    { label: 'Goals Achieved', value: '8', icon: Target, color: 'text-purple-600' },
    { label: 'Challenges Won', value: '5', icon: Trophy, color: 'text-yellow-600' }
  ]

  const achievements = [
    {
      id: 1,
      title: 'First Workout',
      description: 'Completed your first workout',
      icon: '🏃‍♂️',
      date: '2024-01-15',
      rarity: 'common'
    },
    {
      id: 2,
      title: 'Goal Crusher',
      description: 'Achieved 5 fitness goals',
      icon: '🎯',
      date: '2024-03-20',
      rarity: 'rare'
    },
    {
      id: 3,
      title: 'Social Butterfly',
      description: 'Connected with 20 fitness buddies',
      icon: '👥',
      date: '2024-06-10',
      rarity: 'epic'
    },
    {
      id: 4,
      title: 'Consistency King',
      description: 'Worked out 30 days in a row',
      icon: '🔥',
      date: '2024-08-15',
      rarity: 'legendary'
    },
    {
      id: 5,
      title: 'Challenge Champion',
      description: 'Won 5 fitness challenges',
      icon: '🏆',
      date: '2024-11-01',
      rarity: 'epic'
    },
    {
      id: 6,
      title: 'Motivator',
      description: 'Helped 10 buddies reach their goals',
      icon: '💪',
      date: '2024-11-20',
      rarity: 'rare'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'workout',
      title: 'Completed Upper Body Strength',
      description: '45 minutes • 320 calories burned',
      date: '2024-12-08',
      icon: '💪'
    },
    {
      id: 2,
      type: 'goal',
      title: 'Reached goal milestone',
      description: 'Bench Press: 180/200 lbs (90%)',
      date: '2024-12-07',
      icon: '🎯'
    },
    {
      id: 3,
      type: 'buddy',
      title: 'New buddy connection',
      description: 'Connected with Sarah Johnson',
      date: '2024-12-06',
      icon: '👥'
    },
    {
      id: 4,
      type: 'challenge',
      title: 'Joined 30-Day Push-Up Challenge',
      description: 'Challenge starts December 15th',
      date: '2024-12-05',
      icon: '🏆'
    }
  ]

  const workoutHistory = [
    {
      id: 1,
      name: 'Upper Body Strength',
      type: 'Strength',
      duration: 45,
      calories: 320,
      date: '2024-12-08'
    },
    {
      id: 2,
      name: 'Morning Cardio',
      type: 'Cardio',
      duration: 30,
      calories: 280,
      date: '2024-12-07'
    },
    {
      id: 3,
      name: 'Yoga Flow',
      type: 'Yoga',
      duration: 60,
      calories: 180,
      date: '2024-12-06'
    },
    {
      id: 4,
      name: 'HIIT Training',
      type: 'HIIT',
      duration: 25,
      calories: 350,
      date: '2024-12-05'
    },
    {
      id: 5,
      name: 'Lower Body Strength',
      type: 'Strength',
      duration: 50,
      calories: 380,
      date: '2024-12-04'
    }
  ]

  const handleShare = () => {
    toast.success('Profile link copied to clipboard!')
  }

  const handleEditPhoto = () => {
    toast.info('Photo upload feature coming soon!')
  }

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50'
      case 'rare': return 'border-blue-300 bg-blue-50'
      case 'epic': return 'border-purple-300 bg-purple-50'
      case 'legendary': return 'border-yellow-300 bg-yellow-50'
      default: return 'border-gray-300 bg-gray-50'
    }
  }

  const getTypeIcon = (type) => {
    const icons = {
      strength: '💪',
      cardio: '🏃‍♂️',
      yoga: '🧘‍♀️',
      hiit: '🔥',
      pilates: '🤸‍♀️'
    }
    return icons[type.toLowerCase()] || '🏋️‍♂️'
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h2>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'activity', label: 'Activity' },
    { id: 'workouts', label: 'Workouts' }
  ]

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <Avatar 
              src={user.avatar} 
              alt={user.name}
              size="2xl"
            />
            <button
              onClick={handleEditPhoto}
              className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <div className="flex items-center space-x-4 mt-2 text-gray-600">
                  {user.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Joined {new Date(user.joinedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-4 sm:mt-0">
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Link to="/profile/edit">
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
                <Link to="/settings">
                  <Button>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </Link>
              </div>
            </div>

            {user.bio && (
              <p className="text-gray-700 mb-4">{user.bio}</p>
            )}

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">Fitness Level:</span>
                <span className="px-2 py-1 bg-primary-100 text-primary-800 text-sm rounded-full capitalize">
                  {user.fitnessLevel}
                </span>
              </div>
              
              {user.workoutPreferences?.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">Preferences:</span>
                  <div className="flex flex-wrap gap-1">
                    {user.workoutPreferences.slice(0, 3).map((pref, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize"
                      >
                        {pref}
                      </span>
                    ))}
                    {user.workoutPreferences.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{user.workoutPreferences.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
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
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">This Month</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Workouts Completed</span>
                <span className="font-semibold text-gray-900">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Duration</span>
                <span className="font-semibold text-gray-900">8h 45m</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Calories Burned</span>
                <span className="font-semibold text-gray-900">3,240</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current Streak</span>
                <span className="font-semibold text-gray-900">7 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Goals Progress</span>
                <span className="font-semibold text-gray-900">75%</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Achievements</h2>
            <p className="text-gray-600">{achievements.length} achievements unlocked</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={`p-6 border-2 ${getRarityColor(achievement.rarity)}`}>
                <div className="text-center">
                  <div className="text-4xl mb-3">{achievement.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                      achievement.rarity === 'common' ? 'bg-gray-100 text-gray-800' :
                      achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                      achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {achievement.rarity}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(achievement.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Feed</h2>
          <div className="space-y-6">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 pb-6 border-b border-gray-100 last:border-b-0">
                <div className="text-3xl">{activity.icon}</div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{activity.title}</h3>
                  <p className="text-gray-600 mt-1">{activity.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(activity.date).toLocaleDateString()} at {new Date(activity.date).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'workouts' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Workout History</h2>
            <Link to="/workouts">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {workoutHistory.map((workout) => (
              <div key={workout.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{getTypeIcon(workout.type)}</div>
                  <div>
                    <h3 className="font-medium text-gray-900">{workout.name}</h3>
                    <p className="text-sm text-gray-600">
                      {workout.type} • {workout.duration} min • {workout.calories} cal
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(workout.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

export default Profile