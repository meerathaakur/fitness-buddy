import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Calendar, Clock, Flame, TrendingUp, Filter, Search, X, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '../../common/Button'
import Card from '../../common/Card'
import PageHeader from '../../common/PageHeader'
import { useAuth } from '../auth/useAuth'
import { useWorkout } from './useWorkout'

const emptyExercise = { name: '', sets: '', reps: '', weight: '', duration: '', distance: '' }

const emptyForm = {
  title: '',
  type: 'strength',
  duration: '',
  // calories: 0,
  date: new Date().toISOString().split('T')[0],
  completed: false,
  exercises: [{ ...emptyExercise }]
}


// How many workouts to request per page. Change freely.
const PAGE_SIZE = 10

const emptyPagination = { page: 1, limit: PAGE_SIZE, total: 0, pages: 1 }

// Backend shape -> shape the UI components expect.
// Backend sends: _id, caloriesBurned, workoutDate (no `completed` field).
const normalizeWorkout = (w) => ({
  id: w._id,
  title: w.title ?? '',
  type: w.type ?? 'other',
  duration: w.duration ?? 0,
  calories: w.caloriesBurned ?? 0,
  date: w.workoutDate ? w.workoutDate.slice(0, 10) : '',
  // Backend doesn't store this yet, so treat logged workouts as completed.
  // completed: w.completed ?? true,
  exercises: Array.isArray(w.exercises) ? w.exercises : []
})

// Builds [1, '…', 4, 5, 6, '…', 20] style page lists.
const getPageNumbers = (current, total) => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  const wanted = new Set([1, total, current - 1, current, current + 1])
  const sorted = [...wanted].filter(p => p >= 1 && p <= total).sort((a, b) => a - b)
  const out = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push(`gap-${p}`)
    out.push(p)
  })
  return out
}

const isWithinLastDays = (dateStr, days) => {
  if (!dateStr) return false
  const diff = Date.now() - new Date(dateStr).getTime()
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000
}


export default function Workouts() {

  const { getUserWorkouts, addWorkout, getWeeklyAnalytics } = useWorkout()
  const { token } = useAuth()

  // Data from backend
  const [workouts, setWorkouts] = useState([])
  const [pagination, setPagination] = useState(emptyPagination)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  // Filters (applied to the workouts on the current page)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  // Modal / form
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')


  // ---- Load workouts for the current page ----

  // Context functions are often re-created on every render. Keep the latest
  // version in a ref so the effects below don't depend on their identity.
  const getUserWorkoutsRef = useRef(getUserWorkouts)
  const getWeeklyAnalyticsRef = useRef(getWeeklyAnalytics)
  getUserWorkoutsRef.current = getUserWorkouts
  getWeeklyAnalyticsRef.current = getWeeklyAnalytics

  const loadWorkouts = useCallback(async (pageToLoad, isCancelled = () => false) => {
    setIsLoading(true)
    setLoadError('')
    try {
      const data = await getUserWorkoutsRef.current({ page: pageToLoad, limit: PAGE_SIZE })
      if (isCancelled()) return
      console.log('workoutData:::', data)

      const list = data?.workouts ?? data?.data?.workouts ?? []
      const pageInfo = data?.pagination ?? data?.data?.pagination

      setWorkouts(list.map(normalizeWorkout))
      setPagination(pageInfo ?? { ...emptyPagination, page: pageToLoad, total: list.length })
    } catch (err) {
      if (isCancelled()) return
      console.error('Failed to load workouts:', err)
      setLoadError('Could not load your workouts. Check your connection and try again.')
    } finally {
      if (!isCancelled()) setIsLoading(false)
    }
  }, [])

  // Runs only when the page number or the login token actually changes
  useEffect(() => {
    let cancelled = false
    loadWorkouts(page, () => cancelled)
    return () => { cancelled = true } // ignore stale responses if page changes fast
  }, [loadWorkouts, page, token])


  // Analytics is separate from the list, so it only depends on the token
  useEffect(() => {
    let cancelled = false
      ; (async () => {
        try {
          const response = await getWeeklyAnalytics()
          if (!cancelled) console.log('analytics Data:::', response)
        } catch (err) {
          console.error('Failed to load analytics:', err)
        }
      })()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.pages || nextPage === page) return
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ---- Derived values ----

  const workoutTypes = [
    { value: 'all', label: 'All Workouts' },
    { value: 'strength', label: 'Strength' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'yoga', label: 'Yoga' },
    { value: 'pilates', label: 'Pilates' },
    { value: 'cycling', label: 'Cycling' },
    { value: 'crossfit', label: 'CrossFit' },
    { value: 'weightlifting', label: 'Weightlifting' },
    { value: 'boxing', label: 'Boxing' },
    { value: 'swimming', label: 'Swimming' },
    { value: 'dancing', label: 'Dancing' },
    { value: 'hiking', label: 'Hiking' },
    { value: 'other', label: 'Other' }
  ]

  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || workout.type === filterType
    return matchesSearch && matchesFilter
  })

  // Total comes from the backend; the rest are summed from the page on screen.
  const thisWeekCount = workouts.filter(w => isWithinLastDays(w.date, 7)).length
  const totalMinutes = workouts.reduce((sum, w) => sum + (Number(w.duration) || 0), 0)
  const totalCalories = workouts.reduce((sum, w) => sum + (Number(w.calories) || 0), 0)

  const rangeStart = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1
  const rangeEnd = Math.min(pagination.page * pagination.limit, pagination.total)

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
      pilates: '🤸‍♀️',
      cycling: '🚴‍♂️',
      crossfit: '🏋️‍♂️',
      weightlifting: '🏋️‍♂️',
      boxing: '🥊',
      swimming: '🏊‍♂️',
      dancing: '💃',
      hiking: '🥾',
      other: '🏋️‍♂️'
    }
    return icons[type] || '🏋️‍♂️'
  }

  // ---- Modal / form handlers ----

  const openModal = () => {
    setFormData(emptyForm)
    setFormErrors({})
    setSubmitError('')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    if (isSubmitting) return
    setIsModalOpen(false)
    setFormData(emptyForm)
    setFormErrors({})
    setSubmitError('')
  }

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleExerciseChange = (index, field, value) => {
    setFormData(prev => {
      const exercises = [...prev.exercises]
      exercises[index] = { ...exercises[index], [field]: value }
      return { ...prev, exercises }
    })
  }

  const addExerciseRow = () => {
    setFormData(prev => ({
      ...prev,
      exercises: [...prev.exercises, { ...emptyExercise }]
    }))
  }

  const removeExerciseRow = (index) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }))
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.title.trim()) errors.title = 'Title is required'
    if (!formData.duration || Number(formData.duration) <= 0) errors.duration = 'Enter a valid duration'
    if (!formData.calories || Number(formData.calories) < 0) errors.calories = 'Enter valid calories'
    if (!formData.date) errors.date = 'Date is required'

    const hasValidExercise = formData.exercises.some(ex => ex.name.trim())
    if (!hasValidExercise) errors.exercises = 'Add at least one exercise with a name'

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitError('')

    // Same minimal payload you were already sending.
    // The backend's field names are `caloriesBurned` and `workoutDate`,
    // so use those (not `calories` / `date`) when you add them back.
    const newWorkout = {
      title: formData.title.trim(),
      type: formData.type,
      duration: Number(formData.duration),
      caloriesBurned: Number(formData.calories),
      workoutDate: formData.date,
    }

    try {
      const res = await addWorkout(newWorkout)

      // fetch() doesn't throw on 4xx/5xx, so check the response yourself
      if (res && res.ok === false) {
        throw new Error(`Server responded with ${res.status}`)
      }

      setIsModalOpen(false)
      setFormData(emptyForm)

      // New workouts are sorted first, so jump to page 1 and reload from the server
      if (page === 1) {
        await loadWorkouts(1)
      } else {
        setPage(1)
      }
    } catch (err) {
      console.error('Failed to save workout:', err)
      setSubmitError('Could not save the workout. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
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
        <Button onClick={openModal}>
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
              <p className="text-3xl font-bold text-gray-900 mt-2">{pagination.total}</p>
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
          <Button onClick={openModal}>
            <Plus className="w-4 h-4 mr-2" />
            Log Your First Workout
          </Button>
        </Card>
      )}

      {/* Pagination */}
      {!loadError && pagination.pages > 1 && (
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-600">
              Showing {rangeStart}–{rangeEnd} of {pagination.total} workouts
            </p>

            <nav className="flex items-center space-x-1" aria-label="Pagination">
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1 || isLoading}
                className="flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>

              {getPageNumbers(page, pagination.pages).map((item) =>
                typeof item === 'string' ? (
                  <span key={item} className="px-2 text-gray-400">…</span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => goToPage(item)}
                    disabled={isLoading}
                    aria-current={item === page ? 'page' : undefined}
                    className={`min-w-[2.25rem] px-3 py-1.5 text-sm rounded-lg border ${item === page
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {console.log('pagination item:', item)}
                    {item}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={page >= pagination.pages || isLoading}
                className="flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </nav>
          </div>
        </Card>
      )}

      {/* Log New Workout Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white rounded-t-xl">
              <h2 className="text-lg font-semibold text-gray-900">Log New Workout</h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Workout Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="e.g. Morning Strength Training"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${formErrors.title ? 'border-red-400' : 'border-gray-300'
                    }`}
                />
                {formErrors.title && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.title}</p>
                )}
              </div>

              {/* Type + Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleFieldChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {workoutTypes.filter(t => t.value !== 'all').map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleFieldChange('date', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${formErrors.date ? 'border-red-400' : 'border-gray-300'
                      }`}
                  />
                  {formErrors.date && (
                    <p className="text-xs text-red-600 mt-1">{formErrors.date}</p>
                  )}
                </div>
              </div>

              {/* Duration + Calories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.duration}
                    onChange={(e) => handleFieldChange('duration', e.target.value)}
                    placeholder="45"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${formErrors.duration ? 'border-red-400' : 'border-gray-300'
                      }`}
                  />
                  {formErrors.duration && (
                    <p className="text-xs text-red-600 mt-1">{formErrors.duration}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calories Burned
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.calories}
                    onChange={(e) => handleFieldChange('calories', e.target.value)}
                    placeholder="320"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${formErrors.calories ? 'border-red-400' : 'border-gray-300'
                      }`}
                  />
                  {formErrors.calories && (
                    <p className="text-xs text-red-600 mt-1">{formErrors.calories}</p>
                  )}
                </div>
              </div>

              {/* Completed */}
              <div className="flex items-center space-x-2">
                <input
                  id="completed"
                  type="checkbox"
                  checked={formData.completed}
                  onChange={(e) => handleFieldChange('completed', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="completed" className="text-sm text-gray-700">
                  Mark as completed
                </label>
              </div>

              {/* Exercises */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Exercises
                  </label>
                  <button
                    type="button"
                    onClick={addExerciseRow}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add Exercise
                  </button>
                </div>

                {formErrors.exercises && (
                  <p className="text-xs text-red-600 mb-2">{formErrors.exercises}</p>
                )}
                {/* Exercise rows */}
                <div className="space-y-3">
                  {formData.exercises.map((exercise, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-500">
                          Exercise {index + 1}
                        </span>
                        {formData.exercises.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExerciseRow(index)}
                            className="text-gray-400 hover:text-red-600"
                            aria-label="Remove exercise"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        value={exercise.name}
                        onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                        placeholder="Exercise name (e.g. Squats)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <input
                          type="number"
                          min="0"
                          value={exercise.sets}
                          onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                          placeholder="Sets"
                          className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          min="0"
                          value={exercise.reps}
                          onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                          placeholder="Reps"
                          className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          min="0"
                          value={exercise.weight}
                          onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                          placeholder="Weight (lbs)"
                          className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          min="0"
                          value={exercise.duration}
                          onChange={(e) => handleExerciseChange(index, 'duration', e.target.value)}
                          placeholder="Duration (min)"
                          className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-2 border-t">
                <Button type="button" variant="outline" onClick={closeModal} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Workout'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// import React, { useCallback, useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
// import {
//   Plus, Calendar, Clock, Flame, TrendingUp, Filter, Search, X, Trash2,
//   ChevronLeft, ChevronRight
// } from 'lucide-react'
// import Button from '../../common/Button'
// import Card from '../../common/Card'
// import PageHeader from '../../common/PageHeader'
// import { useAuth } from '../auth/useAuth'
// import { useWorkout } from './useWorkout'

// export default function Workouts() {

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <PageHeader
//         title="My Workouts"
//         subtitle="Track and manage your fitness journey"
//         backTo="/dashboard"
//         showHome={true}
//       >
//         <Button onClick={openModal}>
//           <Plus className="w-4 h-4 mr-2" />
//           Log New Workout
//         </Button>
//       </PageHeader>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <Card className="p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Workouts</p>
//               <p className="text-3xl font-bold text-gray-900 mt-2">{pagination.total}</p>
//             </div>
//             <div className="p-3 rounded-full bg-blue-100">
//               <TrendingUp className="w-6 h-6 text-blue-600" />
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">This Week</p>
//               <p className="text-3xl font-bold text-gray-900 mt-2">{thisWeekCount}</p>
//             </div>
//             <div className="p-3 rounded-full bg-green-100">
//               <Calendar className="w-6 h-6 text-green-600" />
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Time</p>
//               <p className="text-3xl font-bold text-gray-900 mt-2">{totalMinutes}m</p>
//             </div>
//             <div className="p-3 rounded-full bg-purple-100">
//               <Clock className="w-6 h-6 text-purple-600" />
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Calories Burned</p>
//               <p className="text-3xl font-bold text-gray-900 mt-2">{totalCalories.toLocaleString()}</p>
//             </div>
//             <div className="p-3 rounded-full bg-red-100">
//               <Flame className="w-6 h-6 text-red-600" />
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Filters and Search */}
//       <Card className="p-6">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search workouts on this page..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//               />
//             </div>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Filter className="w-4 h-4 text-gray-400" />
//             <select
//               value={filterType}
//               onChange={(e) => setFilterType(e.target.value)}
//               className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//             >
//               {workoutTypes.map(type => (
//                 <option key={type.value} value={type.value}>
//                   {type.label}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </Card>

//       {/* Loading / error states */}
//       {isLoading && (
//         <Card className="p-12 text-center">
//           <p className="text-gray-600">Loading your workouts...</p>
//         </Card>
//       )}

//       {!isLoading && loadError && (
//         <Card className="p-12 text-center">
//           <h3 className="text-lg font-medium text-gray-900 mb-2">Couldn't load workouts</h3>
//           <p className="text-gray-600 mb-4">{loadError}</p>
//           <Button onClick={() => loadWorkouts(page)}>Try again</Button>
//         </Card>
//       )}

//       {/* Workouts List */}
//       {!isLoading && !loadError && (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {filteredWorkouts.map((workout) => (
//             <Card key={workout.id} className="p-6 hover:shadow-lg transition-shadow">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex items-center space-x-3">
//                   <div className="text-2xl">{getTypeIcon(workout.type)}</div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900">{workout.title}</h3>
//                     <div className="flex items-center space-x-2 mt-1">
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(workout.type)}`}>
//                         {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}
//                       </span>
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${workout.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                         }`}>
//                         {workout.completed ? 'Completed' : 'Planned'}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <span className="text-sm text-gray-500">{workout.date}</span>
//               </div>

//               <div className="grid grid-cols-3 gap-4 mb-4">
//                 <div className="text-center">
//                   <div className="flex items-center justify-center space-x-1">
//                     <Clock className="w-4 h-4 text-gray-400" />
//                     <span className="text-sm font-medium text-gray-900">{workout.duration}m</span>
//                   </div>
//                   <span className="text-xs text-gray-500">Duration</span>
//                 </div>
//                 <div className="text-center">
//                   <div className="flex items-center justify-center space-x-1">
//                     <Flame className="w-4 h-4 text-gray-400" />
//                     <span className="text-sm font-medium text-gray-900">{workout.calories}</span>
//                   </div>
//                   <span className="text-xs text-gray-500">Calories</span>
//                 </div>
//                 <div className="text-center">
//                   <div className="flex items-center justify-center space-x-1">
//                     <TrendingUp className="w-4 h-4 text-gray-400" />
//                     <span className="text-sm font-medium text-gray-900">{workout.exercises.length}</span>
//                   </div>
//                   <span className="text-xs text-gray-500">Exercises</span>
//                 </div>
//               </div>

//               <div className="border-t pt-4">
//                 <h4 className="text-sm font-medium text-gray-700 mb-2">Exercises:</h4>
//                 <div className="space-y-1">
//                   {workout.exercises.length === 0 && (
//                     <div className="text-sm text-gray-500">No exercises logged</div>
//                   )}
//                   {workout.exercises.slice(0, 3).map((exercise, index) => (
//                     <div key={index} className="flex justify-between text-sm text-gray-600">
//                       <span>{exercise.name}</span>
//                       <span>
//                         {exercise.sets && exercise.reps && `${exercise.sets}x${exercise.reps}`}
//                         {exercise.weight && ` @ ${exercise.weight}lbs`}
//                         {exercise.duration && `${exercise.duration}min`}
//                         {exercise.distance && `${exercise.distance}mi`}
//                       </span>
//                     </div>
//                   ))}
//                   {workout.exercises.length > 3 && (
//                     <div className="text-sm text-gray-500">
//                       +{workout.exercises.length - 3} more exercises
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="flex justify-between items-center mt-4 pt-4 border-t">
//                 <Link
//                   to={`/workouts/${workout.id}`}
//                   className="text-primary-600 hover:text-primary-700 text-sm font-medium"
//                 >
//                   View Details
//                 </Link>
//                 <div className="flex space-x-2">
//                   <Button variant="outline" size="sm">
//                     Edit
//                   </Button>
//                   {!workout.completed && (
//                     <Button size="sm">
//                       Mark Complete
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* Empty state */}
//       {!isLoading && !loadError && filteredWorkouts.length === 0 && (
//         <Card className="p-12 text-center">
//           <div className="text-gray-400 mb-4">
//             <TrendingUp className="w-12 h-12 mx-auto" />
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No workouts found</h3>
//           <p className="text-gray-600 mb-4">
//             {searchTerm || filterType !== 'all'
//               ? 'Nothing on this page matches your search or filter. Try changing them or go to another page.'
//               : 'Start your fitness journey by logging your first workout!'
//             }
//           </p>
//           <Button onClick={openModal}>
//             <Plus className="w-4 h-4 mr-2" />
//             Log Your First Workout
//           </Button>
//         </Card>
//       )}

//       

//       {/* Log New Workout Modal */}
//       {isModalOpen && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
//           onClick={closeModal}
//         >
//           <div
//             className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white rounded-t-xl">
//               <h2 className="text-lg font-semibold text-gray-900">Log New Workout</h2>
//               <button
//                 type="button"
//                 onClick={closeModal}
//                 className="text-gray-400 hover:text-gray-600"
//                 aria-label="Close"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
//               {submitError && (
//                 <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
//                   {submitError}
//                 </p>
//               )}

//               {/* Title */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Workout Title
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.title}
//                   onChange={(e) => handleFieldChange('title', e.target.value)}
//                   placeholder="e.g. Morning Strength Training"
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${formErrors.title ? 'border-red-400' : 'border-gray-300'
//                     }`}
//                 />
//                 {formErrors.title && (
//                   <p className="text-xs text-red-600 mt-1">{formErrors.title}</p>
//                 )}
//               </div>

//               {/* Type + Date */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Type
//                   </label>
//                   <select
//                     value={formData.type}
//                     onChange={(e) => handleFieldChange('type', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                   >
//                     {workoutTypes.filter(t => t.value !== 'all').map(type => (
//                       <option key={type.value} value={type.value}>
//                         {type.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Date
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.date}
//                     onChange={(e) => handleFieldChange('date', e.target.value)}
//                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${formErrors.date ? 'border-red-400' : 'border-gray-300'
//                       }`}
//                   />
//                   {formErrors.date && (
//                     <p className="text-xs text-red-600 mt-1">{formErrors.date}</p>
//                   )}
//                 </div>
//               </div>

//               {/* Duration + Calories */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Duration (minutes)
//                   </label>
//                   <input
//                     type="number"
//                     min="0"
//                     value={formData.duration}
//                     onChange={(e) => handleFieldChange('duration', e.target.value)}
//                     placeholder="45"
//                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${formErrors.duration ? 'border-red-400' : 'border-gray-300'
//                       }`}
//                   />
//                   {formErrors.duration && (
//                     <p className="text-xs text-red-600 mt-1">{formErrors.duration}</p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Calories Burned
//                   </label>
//                   <input
//                     type="number"
//                     min="0"
//                     value={formData.calories}
//                     onChange={(e) => handleFieldChange('calories', e.target.value)}
//                     placeholder="320"
//                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${formErrors.calories ? 'border-red-400' : 'border-gray-300'
//                       }`}
//                   />
//                   {formErrors.calories && (
//                     <p className="text-xs text-red-600 mt-1">{formErrors.calories}</p>
//                   )}
//                 </div>
//               </div>

//               {/* Completed */}
//               <div className="flex items-center space-x-2">
//                 <input
//                   id="completed"
//                   type="checkbox"
//                   checked={formData.completed}
//                   onChange={(e) => handleFieldChange('completed', e.target.checked)}
//                   className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                 />
//                 <label htmlFor="completed" className="text-sm text-gray-700">
//                   Mark as completed
//                 </label>
//               </div>

//               {/* Exercises */}
//               <div>
//                 <div className="flex items-center justify-between mb-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Exercises
//                   </label>
//                   <button
//                     type="button"
//                     onClick={addExerciseRow}
//                     className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
//                   >
//                     <Plus className="w-3.5 h-3.5 mr-1" />
//                     Add Exercise
//                   </button>
//                 </div>

//                 {formErrors.exercises && (
//                   <p className="text-xs text-red-600 mb-2">{formErrors.exercises}</p>
//                 )}
//                 {/* Exercise rows */}
//                 <div className="space-y-3">
//                   {formData.exercises.map((exercise, index) => (
//                     <div key={index} className="border border-gray-200 rounded-lg p-3">
//                       <div className="flex items-center justify-between mb-2">
//                         <span className="text-xs font-medium text-gray-500">
//                           Exercise {index + 1}
//                         </span>
//                         {formData.exercises.length > 1 && (
//                           <button
//                             type="button"
//                             onClick={() => removeExerciseRow(index)}
//                             className="text-gray-400 hover:text-red-600"
//                             aria-label="Remove exercise"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         )}
//                       </div>

//                       <input
//                         type="text"
//                         value={exercise.name}
//                         onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
//                         placeholder="Exercise name (e.g. Squats)"
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                       />

//                       <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
//                         <input
//                           type="number"
//                           min="0"
//                           value={exercise.sets}
//                           onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
//                           placeholder="Sets"
//                           className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                         />
//                         <input
//                           type="number"
//                           min="0"
//                           value={exercise.reps}
//                           onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
//                           placeholder="Reps"
//                           className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                         />
//                         <input
//                           type="number"
//                           min="0"
//                           value={exercise.weight}
//                           onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
//                           placeholder="Weight (lbs)"
//                           className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                         />
//                         <input
//                           type="number"
//                           min="0"
//                           value={exercise.duration}
//                           onChange={(e) => handleExerciseChange(index, 'duration', e.target.value)}
//                           placeholder="Duration (min)"
//                           className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="flex justify-end space-x-3 pt-2 border-t">
//                 <Button type="button" variant="outline" onClick={closeModal} disabled={isSubmitting}>
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={isSubmitting}>
//                   {isSubmitting ? 'Saving...' : 'Save Workout'}
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }