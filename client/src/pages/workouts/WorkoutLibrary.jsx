import React, { useState } from 'react'
import { Search, Filter, Play, Clock, Users, Star } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'

export default function WorkoutLibrary() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  const categories = [
    { id: 'all', name: 'All Workouts' },
    { id: 'strength', name: 'Strength Training' },
    { id: 'cardio', name: 'Cardio' },
    { id: 'yoga', name: 'Yoga' },
    { id: 'pilates', name: 'Pilates' },
    { id: 'hiit', name: 'HIIT' },
    { id: 'stretching', name: 'Stretching' }
  ]

  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ]

  const workouts = [
    {
      id: 1,
      title: 'Full Body Strength',
      description: 'Complete strength training workout targeting all major muscle groups',
      category: 'strength',
      difficulty: 'intermediate',
      duration: 45,
      exercises: 8,
      rating: 4.8,
      participants: 1250,
      image: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=400',
      instructor: 'Mike Johnson'
    },
    {
      id: 2,
      title: 'HIIT Cardio Blast',
      description: 'High-intensity interval training for maximum calorie burn',
      category: 'hiit',
      difficulty: 'advanced',
      duration: 30,
      exercises: 6,
      rating: 4.9,
      participants: 890,
      image: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=400',
      instructor: 'Sarah Davis'
    },
    {
      id: 3,
      title: 'Morning Yoga Flow',
      description: 'Gentle yoga sequence perfect for starting your day',
      category: 'yoga',
      difficulty: 'beginner',
      duration: 25,
      exercises: 12,
      rating: 4.7,
      participants: 2100,
      image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400',
      instructor: 'Emma Wilson'
    },
    {
      id: 4,
      title: 'Core Power Pilates',
      description: 'Strengthen your core with this challenging pilates routine',
      category: 'pilates',
      difficulty: 'intermediate',
      duration: 35,
      exercises: 10,
      rating: 4.6,
      participants: 675,
      image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400',
      instructor: 'Lisa Chen'
    },
    {
      id: 5,
      title: 'Beginner Cardio',
      description: 'Low-impact cardio workout perfect for beginners',
      category: 'cardio',
      difficulty: 'beginner',
      duration: 20,
      exercises: 5,
      rating: 4.5,
      participants: 1800,
      image: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=400',
      instructor: 'Tom Rodriguez'
    },
    {
      id: 6,
      title: 'Evening Stretch',
      description: 'Relaxing stretching routine to wind down your day',
      category: 'stretching',
      difficulty: 'beginner',
      duration: 15,
      exercises: 8,
      rating: 4.8,
      participants: 950,
      image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400',
      instructor: 'Anna Martinez'
    }
  ]

  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workout.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || workout.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || workout.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100'
      case 'intermediate': return 'text-yellow-600 bg-yellow-100'
      case 'advanced': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Workout Library</h1>
        <p className="text-gray-600">Discover and follow professional workout routines</p>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search workouts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input w-full"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="lg:w-48">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="input w-full"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty.id} value={difficulty.id}>
                  {difficulty.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredWorkouts.length} of {workouts.length} workouts
        </p>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Workout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkouts.map(workout => (
          <Card key={workout.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={workout.image}
                alt={workout.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getDifficultyColor(workout.difficulty)}`}>
                  {workout.difficulty}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <div className="flex items-center space-x-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{workout.rating}</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {workout.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {workout.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{workout.duration} min</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{workout.participants}</span>
                  </div>
                </div>
                <span className="text-xs">{workout.exercises} exercises</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Instructor</p>
                  <p className="text-sm font-medium text-gray-900">{workout.instructor}</p>
                </div>
                <Button size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Start Workout
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredWorkouts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workouts found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or filters to find more workouts.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
              setSelectedDifficulty('all')
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}