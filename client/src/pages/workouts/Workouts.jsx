import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Calendar, Clock, Flame, TrendingUp, Filter, Search } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import PageHeader from '../../components/common/PageHeader'
import { useAuth } from '../../hooks/useAuth'

export default function Workouts() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  // Mock workout data
  const workouts = [
    {
      id: '1',
      title: 'Morning Strength Training',
      type: 'strength',
      duration: 45,
      calories: 320,
      date: '2024-12-08',
      completed: true,
      exercises: [
        { name: 'Squats', sets: 3, reps: 12, weight: 135 },
        { name: 'Bench Press', sets: 3, reps: 10, weight: 155 },
        { name: 'Deadlifts', sets: 3, reps: 8, weight: 185 }
      ]
    },
    {
      id: '2',
      title: 'Evening Cardio',
      type: 'cardio',
      duration: 30,
      calories: 280,
      date: '2024-12-07',
      completed: true,
      exercises: [
        { name: 'Treadmill Run', duration: 30, distance: 3.2 }
      ]
    },
    {
      id: '3',
      title: 'Yoga Flow',
      type: 'yoga',
      duration: 60,
      calories: 180,
      date: '2024-12-06',
      completed: true,
      exercises: [
        { name: 'Sun Salutation', sets: 5 },
        { name: 'Warrior Pose', duration: 10 },
        { name: 'Tree Pose', duration: 5 }
      ]
    },
    {
      id: '4',
      title: 'Upper Body Strength',
      type: 'strength',
      duration: 50,
      calories: 350,
      date: '2024-12-05',
      completed: false,
      exercises: [
        { name: 'Pull-ups', sets: 3, reps: 8 },
        { name: 'Push-ups', sets: 3, reps: 15 },
        { name: 'Shoulder Press', sets: 3, reps: 12, weight: 95 }
      ]
    }
  ]

  const workoutTypes = [
    { value: 'all', label: 'All Workouts' },
    { value: 'strength', label: 'Strength' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'yoga', label: 'Yoga' },
    { value: 'pilates', label: 'Pilates' }
  ]

  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || workout.type === filterType
    return matchesSearch && matchesFilter
  })

  const getTypeColor = (type) => {
    const colors = {
      strength: 'bg-blue-100 text-blue-800',
      cardio: 'bg-red-100 text-red-800',
      yoga: 'bg-green-100 text-green-800',
      pilates: 'bg-purple-100 text-purple-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getTypeIcon = (type) => {
    const icons = {
      strength: '💪',
      cardio: '🏃‍♂️',
      yoga: '🧘‍♀️',
      pilates: '🤸‍♀️'
    }
    return icons[type] || '🏋️‍♂️'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="My Workouts"
        subtitle="Track and manage your fitness journey"
        backTo="/dashboard"
        showHome={true}
      >
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Log New Workout
        </Button>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Workouts</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{workouts.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">4</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Time</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">185m</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Calories Burned</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">1,130</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <Flame className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search workouts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {workoutTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Workouts List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredWorkouts.map((workout) => (
          <Card key={workout.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getTypeIcon(workout.type)}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{workout.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(workout.type)}`}>
                      {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${workout.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {workout.completed ? 'Completed' : 'Planned'}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-sm text-gray-500">{workout.date}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{workout.duration}m</span>
                </div>
                <span className="text-xs text-gray-500">Duration</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <Flame className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{workout.calories}</span>
                </div>
                <span className="text-xs text-gray-500">Calories</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{workout.exercises.length}</span>
                </div>
                <span className="text-xs text-gray-500">Exercises</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Exercises:</h4>
              <div className="space-y-1">
                {workout.exercises.slice(0, 3).map((exercise, index) => (
                  <div key={index} className="flex justify-between text-sm text-gray-600">
                    <span>{exercise.name}</span>
                    <span>
                      {exercise.sets && exercise.reps && `${exercise.sets}x${exercise.reps}`}
                      {exercise.weight && ` @ ${exercise.weight}lbs`}
                      {exercise.duration && `${exercise.duration}min`}
                      {exercise.distance && `${exercise.distance}mi`}
                    </span>
                  </div>
                ))}
                {workout.exercises.length > 3 && (
                  <div className="text-sm text-gray-500">
                    +{workout.exercises.length - 3} more exercises
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <Link
                to={`/workouts/${workout.id}`}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View Details
              </Link>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                {!workout.completed && (
                  <Button size="sm">
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredWorkouts.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <TrendingUp className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workouts found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterType !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Start your fitness journey by logging your first workout!'
            }
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Log Your First Workout
          </Button>
        </Card>
      )}
    </div>
  )
}