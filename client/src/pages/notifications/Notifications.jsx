import React, { useState } from 'react'
import { Bell, Search, Filter, Check, CheckCheck, Trash2, Users, MessageCircle, Trophy, Calendar, Target, Star, Settings, MoreVertical } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Avatar from '../../components/common/Avatar'
import { toast } from '../../components/common/Toast'

export default function Notifications() {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'buddy_request',
            title: 'New Buddy Request',
            message: 'Sarah Johnson wants to connect with you',
            time: '5 minutes ago',
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            unread: true,
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
            icon: Users,
            actionable: true,
            actions: ['Accept', 'Decline']
        },
        {
            id: 2,
            type: 'workout_reminder',
            title: 'Workout Reminder',
            message: 'Your scheduled workout with Mike starts in 30 minutes',
            time: '25 minutes ago',
            timestamp: new Date(Date.now() - 25 * 60 * 1000),
            unread: true,
            icon: Calendar,
            actionable: true,
            actions: ['View Details', 'Reschedule']
        },
        {
            id: 3,
            type: 'challenge_update',
            title: 'Challenge Update',
            message: 'You moved up to 5th place in the 30-Day Push-Up Challenge!',
            time: '2 hours ago',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            unread: false,
            icon: Trophy,
            actionable: true,
            actions: ['View Leaderboard']
        },
        {
            id: 4,
            type: 'message',
            title: 'New Message',
            message: 'Emma: "Great workout today! Same time tomorrow?"',
            time: '4 hours ago',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
            unread: false,
            avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
            icon: MessageCircle,
            actionable: true,
            actions: ['Reply', 'View Chat']
        },
        {
            id: 5,
            type: 'goal_milestone',
            title: 'Goal Milestone',
            message: 'Congratulations! You\'re 80% towards your weight loss goal',
            time: '1 day ago',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            unread: false,
            icon: Target,
            actionable: true,
            actions: ['View Progress']
        },
        {
            id: 6,
            type: 'buddy_accepted',
            title: 'Buddy Request Accepted',
            message: 'David Kim accepted your buddy request',
            time: '1 day ago',
            timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
            unread: false,
            avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
            icon: Users,
            actionable: true,
            actions: ['Send Message', 'Schedule Workout']
        },
        {
            id: 7,
            type: 'achievement',
            title: 'New Achievement Unlocked',
            message: 'You earned the "Consistency King" badge for working out 7 days in a row!',
            time: '2 days ago',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            unread: false,
            icon: Star,
            actionable: true,
            actions: ['View Badge', 'Share Achievement']
        },
        {
            id: 8,
            type: 'workout_completed',
            title: 'Workout Completed',
            message: 'Mike Chen completed the workout you scheduled together',
            time: '3 days ago',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            unread: false,
            avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
            icon: Trophy,
            actionable: false
        },
        {
            id: 9,
            type: 'challenge_invite',
            title: 'Challenge Invitation',
            message: 'You\'ve been invited to join the "Holiday Fitness Challenge"',
            time: '4 days ago',
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            unread: false,
            icon: Trophy,
            actionable: true,
            actions: ['Join Challenge', 'View Details']
        },
        {
            id: 10,
            type: 'system',
            title: 'App Update Available',
            message: 'New features and improvements are available. Update now!',
            time: '1 week ago',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            unread: false,
            icon: Settings,
            actionable: true,
            actions: ['Update Now']
        }
    ])

    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState('all')
    const [sortBy, setSortBy] = useState('newest')
    const [selectedNotifications, setSelectedNotifications] = useState(new Set())
    const [showBulkActions, setShowBulkActions] = useState(false)

    const notificationTypes = [
        { value: 'all', label: 'All Notifications' },
        { value: 'buddy_request', label: 'Buddy Requests' },
        { value: 'message', label: 'Messages' },
        { value: 'workout_reminder', label: 'Workout Reminders' },
        { value: 'challenge_update', label: 'Challenge Updates' },
        { value: 'goal_milestone', label: 'Goal Milestones' },
        { value: 'achievement', label: 'Achievements' },
        { value: 'system', label: 'System' }
    ]

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' },
        { value: 'unread', label: 'Unread First' },
        { value: 'type', label: 'By Type' }
    ]

    // Filter and sort notifications
    const filteredNotifications = notifications
        .filter(notification => {
            const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                notification.message.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesFilter = filterType === 'all' || notification.type === filterType
            return matchesSearch && matchesFilter
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'oldest':
                    return a.timestamp - b.timestamp
                case 'unread':
                    if (a.unread && !b.unread) return -1
                    if (!a.unread && b.unread) return 1
                    return b.timestamp - a.timestamp
                case 'type':
                    return a.type.localeCompare(b.type)
                default: // newest
                    return b.timestamp - a.timestamp
            }
        })

    const unreadCount = notifications.filter(n => n.unread).length
    const selectedCount = selectedNotifications.size

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
        const colors = {
            buddy_request: 'border-l-blue-500',
            buddy_accepted: 'border-l-blue-500',
            workout_reminder: 'border-l-green-500',
            workout_completed: 'border-l-green-500',
            challenge_update: 'border-l-yellow-500',
            challenge_invite: 'border-l-yellow-500',
            message: 'border-l-purple-500',
            goal_milestone: 'border-l-red-500',
            achievement: 'border-l-orange-500',
            system: 'border-l-gray-500'
        }
        return colors[type] || 'border-l-gray-500'
    }

    const getTypeLabel = (type) => {
        const labels = {
            buddy_request: 'Buddy Request',
            buddy_accepted: 'Buddy Accepted',
            workout_reminder: 'Workout',
            workout_completed: 'Workout',
            challenge_update: 'Challenge',
            challenge_invite: 'Challenge',
            message: 'Message',
            goal_milestone: 'Goal',
            achievement: 'Achievement',
            system: 'System'
        }
        return labels[type] || type
    }

    const handleMarkAsRead = (notificationId) => {
        setNotifications(prev => prev.map(n =>
            n.id === notificationId ? { ...n, unread: false } : n
        ))
        toast.success('Marked as read')
    }

    const handleMarkAsUnread = (notificationId) => {
        setNotifications(prev => prev.map(n =>
            n.id === notificationId ? { ...n, unread: true } : n
        ))
        toast.success('Marked as unread')
    }

    const handleDelete = (notificationId) => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
        setSelectedNotifications(prev => {
            const newSet = new Set(prev)
            newSet.delete(notificationId)
            return newSet
        })
        toast.success('Notification deleted')
    }

    const handleSelectNotification = (notificationId) => {
        setSelectedNotifications(prev => {
            const newSet = new Set(prev)
            if (newSet.has(notificationId)) {
                newSet.delete(notificationId)
            } else {
                newSet.add(notificationId)
            }
            setShowBulkActions(newSet.size > 0)
            return newSet
        })
    }

    const handleSelectAll = () => {
        if (selectedNotifications.size === filteredNotifications.length) {
            setSelectedNotifications(new Set())
            setShowBulkActions(false)
        } else {
            setSelectedNotifications(new Set(filteredNotifications.map(n => n.id)))
            setShowBulkActions(true)
        }
    }

    const handleBulkMarkAsRead = () => {
        setNotifications(prev => prev.map(n =>
            selectedNotifications.has(n.id) ? { ...n, unread: false } : n
        ))
        setSelectedNotifications(new Set())
        setShowBulkActions(false)
        toast.success(`Marked ${selectedCount} notifications as read`)
    }

    const handleBulkDelete = () => {
        setNotifications(prev => prev.filter(n => !selectedNotifications.has(n.id)))
        setSelectedNotifications(new Set())
        setShowBulkActions(false)
        toast.success(`Deleted ${selectedCount} notifications`)
    }

    const handleMarkAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
        toast.success('All notifications marked as read')
    }

    const handleAction = (notification, action) => {
        switch (action) {
            case 'Accept':
                toast.success(`Accepted buddy request from ${notification.message.split(' ')[0]}`)
                handleMarkAsRead(notification.id)
                break
            case 'Decline':
                toast.info(`Declined buddy request from ${notification.message.split(' ')[0]}`)
                handleDelete(notification.id)
                break
            case 'Reply':
            case 'View Chat':
                toast.info('Opening chat...')
                break
            case 'View Details':
            case 'View Leaderboard':
            case 'View Progress':
            case 'View Badge':
                toast.info('Opening details...')
                break
            case 'Join Challenge':
                toast.success('Joined challenge!')
                handleMarkAsRead(notification.id)
                break
            case 'Schedule Workout':
                toast.info('Opening workout scheduler...')
                break
            case 'Send Message':
                toast.info('Opening message composer...')
                break
            default:
                toast.info(`Action: ${action}`)
        }
    }

    const formatRelativeTime = (timestamp) => {
        const now = new Date()
        const diff = now - timestamp
        const minutes = Math.floor(diff / (1000 * 60))
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))

        if (minutes < 60) {
            return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
        } else if (hours < 24) {
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`
        } else if (days < 7) {
            return `${days} day${days !== 1 ? 's' : ''} ago`
        } else {
            return timestamp.toLocaleDateString()
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-600 mt-1">
                        {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    {unreadCount > 0 && (
                        <Button variant="outline" onClick={handleMarkAllAsRead}>
                            <CheckCheck className="w-4 h-4 mr-2" />
                            Mark All Read
                        </Button>
                    )}
                    <Button variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{notifications.length}</p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100">
                            <Bell className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Unread</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{unreadCount}</p>
                        </div>
                        <div className="p-3 rounded-full bg-red-100">
                            <Bell className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Today</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {notifications.filter(n => n.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-green-100">
                            <Calendar className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">This Week</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {notifications.filter(n => n.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-purple-100">
                            <Trophy className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search notifications..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input pl-10 w-full"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="input lg:w-48"
                        >
                            {notificationTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="input lg:w-40"
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </Card>

            {/* Bulk Actions */}
            {showBulkActions && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-blue-900">
                                {selectedCount} notification{selectedCount !== 1 ? 's' : ''} selected
                            </span>
                            <Button size="sm" variant="outline" onClick={handleBulkMarkAsRead}>
                                <Check className="w-4 h-4 mr-2" />
                                Mark as Read
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleBulkDelete}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                                setSelectedNotifications(new Set())
                                setShowBulkActions(false)
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </Card>
            )}

            {/* Notifications List */}
            <Card className="overflow-hidden">
                {/* List Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedNotifications.size === filteredNotifications.length && filteredNotifications.length > 0}
                                    onChange={handleSelectAll}
                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Select All ({filteredNotifications.length})
                                </span>
                            </label>
                        </div>
                        <div className="text-sm text-gray-500">
                            Showing {filteredNotifications.length} of {notifications.length} notifications
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="divide-y divide-gray-200">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 border-l-4 hover:bg-gray-50 transition-colors ${getNotificationColor(notification.type)} ${notification.unread ? 'bg-blue-50' : ''
                                    }`}
                            >
                                <div className="flex items-start space-x-4">
                                    {/* Checkbox */}
                                    <label className="flex items-center mt-1 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedNotifications.has(notification.id)}
                                            onChange={() => handleSelectNotification(notification.id)}
                                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                        />
                                    </label>

                                    {/* Icon/Avatar */}
                                    <div className="flex-shrink-0 mt-1">
                                        {getNotificationIcon(notification)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <p className={`text-sm font-medium ${notification.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                                                        {notification.title}
                                                    </p>
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                        {getTypeLabel(notification.type)}
                                                    </span>
                                                    {notification.unread && (
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                    <span>{formatRelativeTime(notification.timestamp)}</span>
                                                    <span>•</span>
                                                    <span>{notification.timestamp.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center space-x-2 ml-4">
                                                {/* Notification Actions */}
                                                {notification.actionable && notification.actions && (
                                                    <div className="flex space-x-2">
                                                        {notification.actions.slice(0, 2).map((action, index) => (
                                                            <Button
                                                                key={index}
                                                                size="sm"
                                                                variant={index === 0 ? 'default' : 'outline'}
                                                                onClick={() => handleAction(notification, action)}
                                                            >
                                                                {action}
                                                            </Button>
                                                        ))}
                                                        {notification.actions.length > 2 && (
                                                            <div className="relative group">
                                                                <Button size="sm" variant="ghost">
                                                                    <MoreVertical className="w-4 h-4" />
                                                                </Button>
                                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                                                    <div className="py-1">
                                                                        {notification.actions.slice(2).map((action, index) => (
                                                                            <button
                                                                                key={index}
                                                                                onClick={() => handleAction(notification, action)}
                                                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                            >
                                                                                {action}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Management Actions */}
                                                <div className="relative group">
                                                    <Button size="sm" variant="ghost">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                                        <div className="py-1">
                                                            {notification.unread ? (
                                                                <button
                                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                >
                                                                    <Check className="w-4 h-4 mr-2" />
                                                                    Mark as Read
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleMarkAsUnread(notification.id)}
                                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                >
                                                                    <Bell className="w-4 h-4 mr-2" />
                                                                    Mark as Unread
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleDelete(notification.id)}
                                                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bell className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm || filterType !== 'all'
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'You\'re all caught up! New notifications will appear here.'
                                }
                            </p>
                            {(searchTerm || filterType !== 'all') && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchTerm('')
                                        setFilterType('all')
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    )
}