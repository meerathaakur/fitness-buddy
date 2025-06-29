import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Search, User, Settings, LogOut, MessageCircle, Users, Trophy, Calendar } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Avatar from './Avatar'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'buddy_request',
      title: 'New Buddy Request',
      message: 'Sarah Johnson wants to connect with you',
      time: '5 minutes ago',
      unread: true,
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      icon: Users
    },
    {
      id: 2,
      type: 'workout_reminder',
      title: 'Workout Reminder',
      message: 'Your scheduled workout with Mike starts in 30 minutes',
      time: '25 minutes ago',
      unread: true,
      icon: Calendar
    },
    {
      id: 3,
      type: 'challenge_update',
      title: 'Challenge Update',
      message: 'You moved up to 5th place in the 30-Day Push-Up Challenge!',
      time: '2 hours ago',
      unread: false,
      icon: Trophy
    },
    {
      id: 4,
      type: 'message',
      title: 'New Message',
      message: 'Emma: "Great workout today! Same time tomorrow?"',
      time: '4 hours ago',
      unread: false,
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      icon: MessageCircle
    },
    {
      id: 5,
      type: 'goal_milestone',
      title: 'Goal Milestone',
      message: 'Congratulations! You\'re 80% towards your weight loss goal',
      time: '1 day ago',
      unread: false,
      icon: Trophy
    }
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  const getNotificationIcon = (notification) => {
    if (notification.avatar) {
      return <Avatar src={notification.avatar} alt="User" size="sm" />
    }
    const Icon = notification.icon
    return (
      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary-600" />
      </div>
    )
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'buddy_request': return 'border-l-blue-500'
      case 'workout_reminder': return 'border-l-green-500'
      case 'challenge_update': return 'border-l-yellow-500'
      case 'message': return 'border-l-purple-500'
      case 'goal_milestone': return 'border-l-red-500'
      default: return 'border-l-gray-500'
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center space-x-4">

            <Link to="/dashboard" className="text-2xl font-bold text-primary-600">
            <img src="/fitness.png" alt="FitnessBuddy" className='w-8 inline mr-2' />

              FitnessBuddy
            </Link>
          </div>

          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search workouts, buddies, challenges..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button className="text-sm text-primary-600 hover:text-primary-700">
                          Mark all as read
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-l-4 hover:bg-gray-50 cursor-pointer ${getNotificationColor(notification.type)} ${
                            notification.unread ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            {getNotificationIcon(notification)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className={`text-sm font-medium ${notification.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                                  {notification.title}
                                </p>
                                {notification.unread && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No notifications yet</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 border-t border-gray-200">
                    <Link 
                      to="/notifications" 
                      className="block text-center text-sm text-primary-600 hover:text-primary-700"
                      onClick={() => setShowNotifications(false)}
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
                <Avatar src={user?.avatar} alt={user?.name} size="sm" />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                  <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}