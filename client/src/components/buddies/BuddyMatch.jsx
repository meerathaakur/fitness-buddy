import React, { useState } from 'react'
import { Heart, X, Star, MapPin, Users, Zap, Target, Calendar } from 'lucide-react'
import Avatar from '../common/Avatar'
import Button from '../common/Button'
import Badge from '../common/Badge'
import Card from '../common/Card'
import { toast } from '../common/Toast'

export default function BuddyMatch({ 
  buddy, 
  onLike, 
  onPass, 
  onSuperLike,
  showMatchDetails = true 
}) {
  const [isLiking, setIsLiking] = useState(false)
  const [isPassing, setIsPassing] = useState(false)

  const handleLike = async () => {
    setIsLiking(true)
    try {
      await onLike?.(buddy.id)
      toast.success(`You liked ${buddy.name}!`)
    } catch (error) {
      toast.error('Failed to like buddy')
      console.error('Like error:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const handlePass = async () => {
    setIsPassing(true)
    try {
      await onPass?.(buddy.id)
      toast.info(`Passed on ${buddy.name}`)
    } catch (error) {
      toast.error('Failed to pass buddy')
      console.error('Pass error:', error)
    } finally {
      setIsPassing(false)
    }
  }

  const handleSuperLike = async () => {
    try {
      await onSuperLike?.(buddy.id)
      toast.success(`Super liked ${buddy.name}! ⭐`)
    } catch (error) {
      toast.error('Failed to super like buddy')
      console.error('Super like error:', error)
    }
  }

  const getMatchReasons = () => {
    const reasons = []
    
    if (buddy.sharedGoals?.length > 0) {
      reasons.push(`${buddy.sharedGoals.length} shared fitness goals`)
    }
    
    if (buddy.sharedWorkouts?.length > 0) {
      reasons.push(`Both enjoy ${buddy.sharedWorkouts.join(', ')}`)
    }
    
    if (buddy.similarSchedule) {
      reasons.push('Similar workout schedule')
    }
    
    if (buddy.nearbyLocation) {
      reasons.push('Lives nearby')
    }
    
    if (buddy.sameFitnessLevel) {
      reasons.push('Same fitness level')
    }
    
    return reasons
  }

  const matchReasons = getMatchReasons()

  return (
    <Card className="max-w-sm mx-auto overflow-hidden">
      {/* Profile Image */}
      <div className="relative">
        <img
          src={buddy.avatar}
          alt={buddy.name}
          className="w-full h-80 object-cover"
        />
        
        {/* Match Percentage Overlay */}
        <div className="absolute top-4 right-4">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            {buddy.matchPercentage}% Match
          </div>
        </div>
        
        {/* Online Status */}
        {buddy.isOnline && (
          <div className="absolute top-4 left-4">
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
              Online
            </div>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{buddy.name}</h2>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{buddy.location}</span>
              {buddy.distance && (
                <>
                  <span className="mx-2">•</span>
                  <span className="text-sm">{buddy.distance}</span>
                </>
              )}
            </div>
          </div>
          
          {buddy.rating && (
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium ml-1">{buddy.rating}</span>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{buddy.age || '25'}</div>
            <div className="text-xs text-gray-500">Age</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 capitalize">{buddy.fitnessLevel}</div>
            <div className="text-xs text-gray-500">Level</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{buddy.workoutFrequency || '4x'}</div>
            <div className="text-xs text-gray-500">Per Week</div>
          </div>
        </div>

        {/* Bio */}
        {buddy.bio && (
          <p className="text-gray-700 text-sm mb-4 line-clamp-3">
            {buddy.bio}
          </p>
        )}

        {/* Workout Preferences */}
        {buddy.workoutPreferences && buddy.workoutPreferences.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Workout Preferences</h4>
            <div className="flex flex-wrap gap-2">
              {buddy.workoutPreferences.slice(0, 4).map((type, index) => (
                <Badge key={index} variant="primary" size="sm">
                  {type}
                </Badge>
              ))}
              {buddy.workoutPreferences.length > 4 && (
                <Badge variant="outline" size="sm">
                  +{buddy.workoutPreferences.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Match Details */}
        {showMatchDetails && matchReasons.length > 0 && (
          <div className="mb-4 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
            <div className="flex items-center mb-2">
              <Zap className="w-4 h-4 text-pink-600 mr-2" />
              <h4 className="text-sm font-medium text-pink-900">Why you match</h4>
            </div>
            <ul className="space-y-1">
              {matchReasons.slice(0, 3).map((reason, index) => (
                <li key={index} className="text-xs text-pink-800 flex items-center">
                  <div className="w-1 h-1 bg-pink-600 rounded-full mr-2"></div>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mutual Connections */}
        {buddy.mutualBuddies > 0 && (
          <div className="mb-4 flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <span>{buddy.mutualBuddies} mutual connections</span>
          </div>
        )}

        {/* Recent Activity */}
        {buddy.recentActivity && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-1">
              <Calendar className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-900">Recent Activity</span>
            </div>
            <p className="text-sm text-blue-800">{buddy.recentActivity}</p>
            <p className="text-xs text-blue-600 mt-1">{buddy.activityTime}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-center space-x-4">
          {/* Pass Button */}
          <Button
            variant="outline"
            size="lg"
            onClick={handlePass}
            disabled={isPassing || isLiking}
            className="w-14 h-14 rounded-full border-2 border-gray-300 hover:border-red-300 hover:bg-red-50 p-0"
          >
            <X className="w-6 h-6 text-gray-600 hover:text-red-600" />
          </Button>

          {/* Super Like Button */}
          <Button
            variant="outline"
            size="lg"
            onClick={handleSuperLike}
            disabled={isPassing || isLiking}
            className="w-12 h-12 rounded-full border-2 border-blue-300 hover:border-blue-400 hover:bg-blue-50 p-0"
          >
            <Star className="w-5 h-5 text-blue-600" />
          </Button>

          {/* Like Button */}
          <Button
            size="lg"
            onClick={handleLike}
            disabled={isPassing || isLiking}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 p-0"
          >
            <Heart className="w-6 h-6 text-white" />
          </Button>
        </div>

        {/* Action Labels */}
        <div className="flex items-center justify-center space-x-8 mt-2">
          <span className="text-xs text-gray-500">Pass</span>
          <span className="text-xs text-blue-600">Super</span>
          <span className="text-xs text-pink-600">Like</span>
        </div>
      </div>
    </Card>
  )
}