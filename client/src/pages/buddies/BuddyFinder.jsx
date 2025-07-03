import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import BuddyList from '../../components/buddies/BuddyList'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import { toast } from '../../components/common/Toast'

export default function BuddyFinder() {
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
      workoutPreferences: ['Strength', 'Cardio', 'Yoga'],
      rating: 4.8,
      reviewCount: 24,
      bio: 'Fitness enthusiast who loves morning workouts and trying new fitness challenges!',
      matchPercentage: 92,
      isOnline: true,
      mutualBuddies: 3,
      status: 'available'
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Brooklyn, NY',
      distance: '4.1 miles',
      fitnessLevel: 'Advanced',
      workoutPreferences: ['Strength', 'Powerlifting', 'CrossFit'],
      rating: 4.9,
      reviewCount: 31,
      bio: 'Powerlifter and CrossFit enthusiast. Always looking for new training partners!',
      matchPercentage: 85,
      isOnline: false,
      mutualBuddies: 1,
      status: 'available'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Manhattan, NY',
      distance: '1.8 miles',
      fitnessLevel: 'Beginner',
      workoutPreferences: ['Yoga', 'Pilates', 'Walking'],
      rating: 4.6,
      reviewCount: 18,
      bio: 'New to fitness and looking for supportive workout buddies to start this journey!',
      matchPercentage: 78,
      isOnline: true,
      mutualBuddies: 0,
      status: 'available'
    },
    {
      id: '4',
      name: 'David Kim',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Queens, NY',
      distance: '6.2 miles',
      fitnessLevel: 'Intermediate',
      workoutPreferences: ['Running', 'Cycling', 'Swimming'],
      rating: 4.7,
      reviewCount: 22,
      bio: 'Triathlete training for my next competition. Love outdoor activities and endurance sports!',
      matchPercentage: 88,
      isOnline: true,
      mutualBuddies: 2,
      status: 'available'
    },
    {
      id: '5',
      name: 'Jessica Park',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Bronx, NY',
      distance: '8.5 miles',
      fitnessLevel: 'Advanced',
      workoutPreferences: ['HIIT', 'Boxing', 'Dance'],
      rating: 4.9,
      reviewCount: 35,
      bio: 'High-energy workouts are my thing! Boxing instructor looking for training partners.',
      matchPercentage: 81,
      isOnline: false,
      mutualBuddies: 1,
      status: 'available'
    }
  ]

  const handleConnect = (buddyId, buddyName) => {
    setPendingRequests(prev => new Set([...prev, buddyId]))
    // Update buddy status
    const updatedBuddies = buddies.map(buddy => 
      buddy.id === buddyId ? { ...buddy, status: 'pending' } : buddy
    )
    toast.success(`Connection request sent to ${buddyName}!`)
  }

  const handleMessage = (buddyId, buddyName) => {
    toast.info(`Opening chat with ${buddyName}...`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader 
        title="Find Workout Buddies"
        subtitle="Connect with fitness enthusiasts in your area"
        backTo="/dashboard"
        showHome={true}
      >
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Quick Match
        </Button>
      </PageHeader>

      {/* Buddy List */}
      <BuddyList
        buddies={buddies}
        onConnect={handleConnect}
        onMessage={handleMessage}
        title="Recommended Buddies"
        emptyMessage="No workout buddies found"
      />
    </div>
  )
}