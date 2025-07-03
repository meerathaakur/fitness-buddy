import React from 'react'
import { MessageCircle, UserPlus, MapPin, Star, Users, Calendar } from 'lucide-react'
import Avatar from '../common/Avatar'
import Button from '../common/Button'
import Badge from '../common/Badge'
import { toast } from '../common/Toast'

export default function BuddyCard({ 
  buddy, 
  onConnect, 
  onMessage, 
  showConnectButton = true,
  showMessageButton = true,
  variant = 'default' // 'default', 'compact', 'detailed'
}) {
  const handleConnect = () => {
    onConnect?.(buddy.id, buddy.name)
    toast.success(`Connection request sent to ${buddy.name}!`)
  }

  const handleMessage = () => {
    onMessage?.(buddy.id, buddy.name)
    toast.info(`Opening chat with ${buddy.name}...`)
  }

  const getButtonState = () => {
    if (buddy.status === 'connected') return 'connected'
    if (buddy.status === 'pending') return 'pending'
    return 'connect'
  }

  const renderConnectButton = () => {
    const state = getButtonState()
    
    switch (state) {
      case 'connected':
        return (
          <Button variant="outline" size="sm" disabled>
            <Users className="w-4 h-4 mr-2" />
            Connected
          </Button>
        )
      case 'pending':
        return (
          <Button variant="outline" size="sm" disabled>
            <UserPlus className="w-4 h-4 mr-2" />
            Request Sent
          </Button>
        )
      default:
        return (
          <Button size="sm" onClick={handleConnect}>
            <UserPlus className="w-4 h-4 mr-2" />
            Connect
          </Button>
        )
    }
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        <div className="relative">
          <Avatar src={buddy.avatar} alt={buddy.name} size="md" />
          {buddy.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{buddy.name}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="truncate">{buddy.location}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {showMessageButton && (
            <Button variant="ghost" size="sm" onClick={handleMessage}>
              <MessageCircle className="w-4 h-4" />
            </Button>
          )}
          {showConnectButton && renderConnectButton()}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <Avatar src={buddy.avatar} alt={buddy.name} size="lg" />
          {buddy.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {buddy.name}
            </h3>
            {buddy.matchPercentage && (
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-primary-600">
                  {buddy.matchPercentage}% match
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{buddy.location}</span>
            {buddy.distance && (
              <>
                <span className="mx-2">•</span>
                <span>{buddy.distance}</span>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-4 mb-3">
            <span className="text-sm text-gray-600">
              <span className="font-medium">Level:</span> {buddy.fitnessLevel}
            </span>
            {buddy.rating && (
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="text-sm text-gray-600">
                  {buddy.rating} ({buddy.reviewCount} reviews)
                </span>
              </div>
            )}
          </div>

          {buddy.mutualBuddies > 0 && (
            <div className="text-sm text-gray-600 mb-3">
              <span className="font-medium">{buddy.mutualBuddies}</span> mutual buddies
            </div>
          )}
          
          {buddy.workoutPreferences && buddy.workoutPreferences.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {buddy.workoutPreferences.map((type, index) => (
                <Badge key={index} variant="primary" size="sm">
                  {type}
                </Badge>
              ))}
            </div>
          )}
          
          {buddy.bio && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {buddy.bio}
            </p>
          )}

          {buddy.recentActivity && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Recent Activity</span>
              </div>
              <p className="text-sm text-blue-800">{buddy.recentActivity}</p>
              <p className="text-xs text-blue-600 mt-1">{buddy.activityTime}</p>
            </div>
          )}
          
          <div className="flex space-x-3">
            {showConnectButton && renderConnectButton()}
            {showMessageButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMessage}
                className="px-3"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}