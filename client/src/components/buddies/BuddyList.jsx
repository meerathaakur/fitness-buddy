import React, { useState } from 'react'
import { Search, Filter, Users, Grid, List } from 'lucide-react'
import BuddyCard from './BuddyCard.jsx'
import Input from '../common/Input.jsx'
import Select from '../common/Select.jsx'
import Button from '../common/Button.jsx'
import Card from '../common/Card.jsx'

export default function BuddyList({
  buddies = [],
  onConnect,
  onMessage,
  showSearch = true,
  showFilters = true,
  title = "Fitness Buddies",
  emptyMessage = "No buddies found",
  variant = 'default' // 'default', 'compact'
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    location: '',
    fitnessLevel: '',
    workoutType: '',
    distance: '10'
  })
  const [viewMode, setViewMode] = useState('grid') // 'grid', 'list'
  const [sortBy, setSortBy] = useState('match') // 'match', 'distance', 'rating', 'name'

  const filterOptions = {
    fitnessLevel: [
      { value: '', label: 'All Levels' },
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' }
    ],
    distance: [
      { value: '5', label: 'Within 5 miles' },
      { value: '10', label: 'Within 10 miles' },
      { value: '25', label: 'Within 25 miles' },
      { value: '50', label: 'Within 50 miles' }
    ],
    sortBy: [
      { value: 'match', label: 'Match Percentage' },
      { value: 'distance', label: 'Distance' },
      { value: 'rating', label: 'Rating' },
      { value: 'name', label: 'Name' }
    ]
  }

  const filteredBuddies = buddies
    .filter(buddy => {
      const matchesSearch = buddy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buddy.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (buddy.workoutPreferences && buddy.workoutPreferences.some(type =>
          type.toLowerCase().includes(searchTerm.toLowerCase())
        ))

      const matchesLocation = !filters.location ||
        buddy.location.toLowerCase().includes(filters.location.toLowerCase())
      const matchesFitnessLevel = !filters.fitnessLevel ||
        buddy.fitnessLevel.toLowerCase() === filters.fitnessLevel.toLowerCase()
      const matchesWorkoutType = !filters.workoutType ||
        (buddy.workoutPreferences && buddy.workoutPreferences.some(type =>
          type.toLowerCase().includes(filters.workoutType.toLowerCase())
        ))

      return matchesSearch && matchesLocation && matchesFitnessLevel && matchesWorkoutType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance)
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'name':
          return a.name.localeCompare(b.name)
        case 'match':
        default:
          return (b.matchPercentage || 0) - (a.matchPercentage || 0)
      }
    })

  const clearFilters = () => {
    setSearchTerm('')
    setFilters({
      location: '',
      fitnessLevel: '',
      workoutType: '',
      distance: '10'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <Card className="p-6">
          {showSearch && (
            <div className="mb-4">
              <Input
                placeholder="Search by name, location, or workout type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
          )}

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Input
                placeholder="Location"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              />

              <Select
                value={filters.fitnessLevel}
                onChange={(e) => setFilters(prev => ({ ...prev, fitnessLevel: e.target.value }))}
                options={filterOptions.fitnessLevel}
                placeholder="Fitness Level"
              />

              <Input
                placeholder="Workout Type"
                value={filters.workoutType}
                onChange={(e) => setFilters(prev => ({ ...prev, workoutType: e.target.value }))}
              />

              <Select
                value={filters.distance}
                onChange={(e) => setFilters(prev => ({ ...prev, distance: e.target.value }))}
                options={filterOptions.distance}
              />

              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={filterOptions.sortBy}
              />
            </div>
          )}

          {(searchTerm || Object.values(filters).some(f => f && f !== '10')) && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredBuddies.length} of {buddies.length} buddies
              </p>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Buddy Grid/List */}
      {filteredBuddies.length > 0 ? (
        <div className={
          viewMode === 'grid'
            ? `grid grid-cols-1 ${variant === 'compact' ? 'md:grid-cols-2 lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6`
            : 'space-y-4'
        }>
          {filteredBuddies.map((buddy) => (
            <BuddyCard
              key={buddy.id}
              buddy={buddy}
              onConnect={onConnect}
              onMessage={onMessage}
              variant={viewMode === 'list' ? 'compact' : variant}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyMessage}</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || Object.values(filters).some(f => f && f !== '10')
              ? 'Try adjusting your search criteria or filters to find more workout partners.'
              : 'Start connecting with other fitness enthusiasts to build your buddy network.'
            }
          </p>
          {(searchTerm || Object.values(filters).some(f => f && f !== '10')) && (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </Card>
      )}
    </div>
  )
}