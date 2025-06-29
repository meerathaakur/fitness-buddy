import React, { useState } from 'react'
import { Search, MapPin, Filter, Heart, MessageCircle, Star, UserPlus } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Avatar from '../../components/common/Avatar'
import PageHeader from '../../components/common/PageHeader'
import { toast } from '../../components/common/Toast'

export default function BuddyFinder() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    location: '',
    fitnessLevel: '',
    workoutType: '',
    distance: '10'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [connectedBuddies, setConnectedBuddies] = useState(new Set())
  const [pendingRequests, setPendingRequests] = useState(new Set())

  // Mock buddy data
  const buddies = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'New York, NY',
      distance: '2.3 miles',
      fitnessLevel: 'Intermediate',
      workoutTypes: ['Strength', 'Cardio', 'Yoga'],
      rating: 4.8,
      reviewCount: 24,
      bio: 'Fitness enthusiast who loves morning workouts and trying new fitness challenges!',
      matchPercentage: 92,
      isOnline: true,
      mutualBuddies: 3
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Brooklyn, NY',
      distance: '4.1 miles',
      fitnessLevel: 'Advanced',
      workoutTypes: ['Strength', 'Powerlifting', 'CrossFit'],
      rating: 4.9,
      reviewCount: 31,
      bio: 'Powerlifter and CrossFit enthusiast. Always looking for new training partners!',
      matchPercentage: 85,
      isOnline: false,
      mutualBuddies: 1
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Manhattan, NY',
      distance: '1.8 miles',
      fitnessLevel: 'Beginner',
      workoutTypes: ['Yoga', 'Pilates', 'Walking'],
      rating: 4.6,
      reviewCount: 18,
      bio: 'New to fitness and looking for supportive workout buddies to start this journey!',
      matchPercentage: 78,
      isOnline: true,
      mutualBuddies: 0
    },
    {
      id: '4',
      name: 'David Kim',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Queens, NY',
      distance: '6.2 miles',
      fitnessLevel: 'Intermediate',
      workoutTypes: ['Running', 'Cycling', 'Swimming'],
      rating: 4.7,
      reviewCount: 22,
      bio: 'Triathlete training for my next competition. Love outdoor activities and endurance sports!',
      matchPercentage: 88,
      isOnline: true,
      mutualBuddies: 2
    },
    {
      id: '5',
      name: 'Jessica Park',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Bronx, NY',
      distance: '8.5 miles',
      fitnessLevel: 'Advanced',
      workoutTypes: ['HIIT', 'Boxing', 'Dance'],
      rating: 4.9,
      reviewCount: 35,
      bio: 'High-energy workouts are my thing! Boxing instructor looking for training partners.',
      matchPercentage: 81,
      isOnline: false,
      mutualBuddies: 1
    }
  ]

  const handleConnect = (buddyId, buddyName) => {
    setPendingRequests(prev => new Set([...prev, buddyId]))
    toast.success(`Connection request sent to ${buddyName}!`)
  }

  const handleMessage = (buddyId, buddyName) => {
    toast.info(`Opening chat with ${buddyName}...`)
  }

  const filteredBuddies = buddies.filter(buddy => {
    const matchesSearch = buddy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buddy.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buddy.workoutTypes.some(type => type.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesLocation = !filters.location || buddy.location.toLowerCase().includes(filters.location.toLowerCase())
    const matchesFitnessLevel = !filters.fitnessLevel || buddy.fitnessLevel.toLowerCase() === filters.fitnessLevel.toLowerCase()
    const matchesWorkoutType = !filters.workoutType || buddy.workoutTypes.some(type => type.toLowerCase().includes(filters.workoutType.toLowerCase()))

    return matchesSearch && matchesLocation && matchesFitnessLevel && matchesWorkoutType
  })

  const getButtonState = (buddyId) => {
    if (connectedBuddies.has(buddyId)) return 'connected'
    if (pendingRequests.has(buddyId)) return 'pending'
    return 'connect'
  }

  const renderConnectButton = (buddy) => {
    const state = getButtonState(buddy.id)

    switch (state) {
      case 'connected':
        return (
          <Button variant="outline" className="flex-1" disabled>
            <UserPlus className="w-4 h-4 mr-2" />
            Connected
          </Button>
        )
      case 'pending':
        return (
          <Button variant="outline" className="flex-1" disabled>
            <UserPlus className="w-4 h-4 mr-2" />
            Request Sent
          </Button>
        )
      default:
        return (
          <Button
            onClick={() => handleConnect(buddy.id, buddy.name)}
            className="flex-1"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Connect
          </Button>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Find Workout Buddies"
        subtitle="Connect with fitness enthusiasts in your area"
        backTo="/dashboard"
        showHome={true}
      />

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, location, or workout type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:w-auto"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="City, State"
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fitness Level
                </label>
                <select
                  value={filters.fitnessLevel}
                  onChange={(e) => setFilters(prev => ({ ...prev, fitnessLevel: e.target.value }))}
                  className="input"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Workout Type
                </label>
                <input
                  type="text"
                  placeholder="e.g., Strength, Cardio"
                  value={filters.workoutType}
                  onChange={(e) => setFilters(prev => ({ ...prev, workoutType: e.target.value }))}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distance (miles)
                </label>
                <select
                  value={filters.distance}
                  onChange={(e) => setFilters(prev => ({ ...prev, distance: e.target.value }))}
                  className="input"
                >
                  <option value="5">Within 5 miles</option>
                  <option value="10">Within 10 miles</option>
                  <option value="25">Within 25 miles</option>
                  <option value="50">Within 50 miles</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Found {filteredBuddies.length} workout {filteredBuddies.length === 1 ? 'buddy' : 'buddies'}
        </p>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Sort by:</span>
          <select className="border border-gray-300 rounded px-2 py-1 text-sm">
            <option>Match Percentage</option>
            <option>Distance</option>
            <option>Rating</option>
            <option>Recently Active</option>
          </select>
        </div>
      </div>

      {/* Buddy Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBuddies.map((buddy) => (
          <Card key={buddy.id} className="p-6 hover:shadow-lg transition-shadow">
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
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-primary-600">
                      {buddy.matchPercentage}% match
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{buddy.location} • {buddy.distance}</span>
                </div>

                <div className="flex items-center space-x-4 mb-3">
                  <span className="text-sm text-gray-600">
                    <span className="font-medium">Level:</span> {buddy.fitnessLevel}
                  </span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-600">
                      {buddy.rating} ({buddy.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                {buddy.mutualBuddies > 0 && (
                  <div className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">{buddy.mutualBuddies}</span> mutual buddies
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-3">
                  {buddy.workoutTypes.map((type, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                    >
                      {type}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {buddy.bio}
                </p>

                <div className="flex space-x-3">
                  {renderConnectButton(buddy)}
                  <Button
                    variant="outline"
                    onClick={() => handleMessage(buddy.id, buddy.name)}
                    className="px-3"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredBuddies.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No buddies found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or filters to find more workout partners.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('')
              setFilters({
                location: '',
                fitnessLevel: '',
                workoutType: '',
                distance: '10'
              })
            }}
          >
            Clear Filters
          </Button>
        </Card>
      )}
    </div>
  )
}