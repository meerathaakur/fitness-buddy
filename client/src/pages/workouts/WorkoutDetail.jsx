import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Flame, Target, Play, Pause, RotateCcw, Check, Square, SkipForward, Timer, Zap, Save, FileText } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import PageHeader from '../../components/common/PageHeader'
import { toast } from '../../components/common/Toast'

export default function WorkoutDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  // Timer states
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timer, setTimer] = useState(0)
  const [workoutStartTime, setWorkoutStartTime] = useState(null)
  
  // Exercise states
  const [currentExercise, setCurrentExercise] = useState(0)
  const [completedExercises, setCompletedExercises] = useState(new Set())
  const [exerciseTimer, setExerciseTimer] = useState(0)
  const [restTimer, setRestTimer] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [currentSet, setCurrentSet] = useState(1)
  const [exerciseStartTime, setExerciseStartTime] = useState(null)
  
  // Notes states
  const [workoutNotes, setWorkoutNotes] = useState('')
  const [notesSaved, setNotesSaved] = useState(true)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [lastSaved, setLastSaved] = useState(null)
  
  // Refs for intervals
  const timerRef = useRef(null)
  const exerciseTimerRef = useRef(null)
  const restTimerRef = useRef(null)
  const autoSaveRef = useRef(null)

  // Mock workout data
  const workout = {
    id: id,
    title: 'Upper Body Strength',
    description: 'A comprehensive upper body workout focusing on chest, shoulders, and arms',
    duration: 45,
    calories: 320,
    difficulty: 'Intermediate',
    exercises: [
      {
        id: 1,
        name: 'Push-ups',
        sets: 3,
        reps: 12,
        restTime: 60,
        instructions: 'Keep your body straight and lower yourself until your chest nearly touches the floor.',
        targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
        completed: false
      },
      {
        id: 2,
        name: 'Dumbbell Bench Press',
        sets: 3,
        reps: 10,
        weight: 25,
        restTime: 90,
        instructions: 'Lie on bench, press dumbbells up from chest level to full arm extension.',
        targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
        completed: false
      },
      {
        id: 3,
        name: 'Shoulder Press',
        sets: 3,
        reps: 12,
        weight: 20,
        restTime: 60,
        instructions: 'Press dumbbells overhead from shoulder height to full extension.',
        targetMuscles: ['Shoulders', 'Triceps'],
        completed: false
      },
      {
        id: 4,
        name: 'Tricep Dips',
        sets: 3,
        reps: 15,
        restTime: 60,
        instructions: 'Lower your body by bending your arms, then push back up.',
        targetMuscles: ['Triceps', 'Shoulders'],
        completed: false
      }
    ]
  }

  // Load saved notes on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(`workout-notes-${id}`)
    const savedTimestamp = localStorage.getItem(`workout-notes-timestamp-${id}`)
    
    if (savedNotes) {
      setWorkoutNotes(savedNotes)
      setNotesSaved(true)
      if (savedTimestamp) {
        setLastSaved(new Date(savedTimestamp))
      }
    }
  }, [id])

  // Auto-save notes
  useEffect(() => {
    if (autoSaveEnabled && workoutNotes !== '') {
      // Clear existing timeout
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current)
      }
      
      // Set new timeout for auto-save (2 seconds after user stops typing)
      autoSaveRef.current = setTimeout(() => {
        handleSaveNotes(true) // true indicates auto-save
      }, 2000)
    }

    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current)
      }
    }
  }, [workoutNotes, autoSaveEnabled])

  // Timer effects
  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }

    return () => clearInterval(timerRef.current)
  }, [isActive, isPaused])

  useEffect(() => {
    if (isActive && !isPaused && !isResting && exerciseStartTime) {
      exerciseTimerRef.current = setInterval(() => {
        setExerciseTimer(prev => prev + 1)
      }, 1000)
    } else {
      clearInterval(exerciseTimerRef.current)
    }

    return () => clearInterval(exerciseTimerRef.current)
  }, [isActive, isPaused, isResting, exerciseStartTime])

  useEffect(() => {
    if (isResting && restTimer > 0) {
      restTimerRef.current = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false)
            toast.success('Rest time over! Ready for next set.')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(restTimerRef.current)
    }

    return () => clearInterval(restTimerRef.current)
  }, [isResting, restTimer])

  const handleStartWorkout = () => {
    setIsActive(true)
    setIsPaused(false)
    setWorkoutStartTime(new Date())
    setExerciseStartTime(new Date())
    setExerciseTimer(0)
    toast.success('Workout started! Let\'s go! 💪')
  }

  const handlePauseWorkout = () => {
    setIsPaused(true)
    toast.info('Workout paused')
  }

  const handleResumeWorkout = () => {
    setIsPaused(false)
    if (!exerciseStartTime) {
      setExerciseStartTime(new Date())
    }
    toast.success('Workout resumed!')
  }

  const handleStopWorkout = () => {
    setIsActive(false)
    setIsPaused(false)
    setIsResting(false)
    setRestTimer(0)
    toast.info('Workout stopped')
  }

  const handleCompleteSet = () => {
    const currentExerciseData = workout.exercises[currentExercise]
    
    if (currentSet < currentExerciseData.sets) {
      // Start rest timer
      setIsResting(true)
      setRestTimer(currentExerciseData.restTime)
      setCurrentSet(prev => prev + 1)
      setExerciseTimer(0)
      setExerciseStartTime(null)
      toast.success(`Set ${currentSet} completed! Rest for ${currentExerciseData.restTime} seconds.`)
    } else {
      // Exercise completed
      handleCompleteExercise(currentExerciseData.id)
    }
  }

  const handleCompleteExercise = (exerciseId) => {
    setCompletedExercises(prev => new Set([...prev, exerciseId]))
    setCurrentSet(1)
    setExerciseTimer(0)
    setExerciseStartTime(null)
    setIsResting(false)
    setRestTimer(0)
    
    const exerciseName = workout.exercises.find(ex => ex.id === exerciseId)?.name
    toast.success(`${exerciseName} completed! Great job! 🎉`)
    
    if (currentExercise < workout.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setExerciseStartTime(new Date())
    } else {
      // Workout completed
      handleWorkoutComplete()
    }
  }

  const handleWorkoutComplete = () => {
    setIsActive(false)
    setIsPaused(false)
    const totalTime = formatTime(timer)
    
    // Auto-save notes when workout is completed
    if (workoutNotes.trim()) {
      handleSaveNotes(true)
    }
    
    toast.success(`🎉 Workout completed in ${totalTime}! Amazing work!`)
    
    // Could navigate to completion screen or show summary
    setTimeout(() => {
      navigate('/workouts')
    }, 3000)
  }

  const handleSkipExercise = () => {
    if (currentExercise < workout.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setCurrentSet(1)
      setExerciseTimer(0)
      setExerciseStartTime(new Date())
      setIsResting(false)
      setRestTimer(0)
      toast.info('Exercise skipped')
    }
  }

  const handleResetWorkout = () => {
    setIsActive(false)
    setIsPaused(false)
    setCurrentExercise(0)
    setTimer(0)
    setExerciseTimer(0)
    setRestTimer(0)
    setCurrentSet(1)
    setIsResting(false)
    setCompletedExercises(new Set())
    setWorkoutStartTime(null)
    setExerciseStartTime(null)
    toast.info('Workout reset')
  }

  const handleSkipRest = () => {
    setIsResting(false)
    setRestTimer(0)
    setExerciseStartTime(new Date())
    toast.info('Rest skipped')
  }

  const handleNotesChange = (e) => {
    setWorkoutNotes(e.target.value)
    setNotesSaved(false)
  }

  const handleSaveNotes = (isAutoSave = false) => {
    try {
      const timestamp = new Date()
      localStorage.setItem(`workout-notes-${id}`, workoutNotes)
      localStorage.setItem(`workout-notes-timestamp-${id}`, timestamp.toISOString())
      
      setNotesSaved(true)
      setLastSaved(timestamp)
      
      if (!isAutoSave) {
        toast.success('Notes saved successfully!')
      }
    } catch (error) {
      toast.error('Failed to save notes')
      console.error('Error saving notes:', error)
    }
  }

  const handleClearNotes = () => {
    if (workoutNotes.trim() && !window.confirm('Are you sure you want to clear all notes? This action cannot be undone.')) {
      return
    }
    
    setWorkoutNotes('')
    localStorage.removeItem(`workout-notes-${id}`)
    localStorage.removeItem(`workout-notes-timestamp-${id}`)
    setNotesSaved(true)
    setLastSaved(null)
    toast.success('Notes cleared')
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getWorkoutProgress = () => {
    const totalExercises = workout.exercises.length
    const completedCount = completedExercises.size
    return Math.round((completedCount / totalExercises) * 100)
  }

  const getCurrentExerciseProgress = () => {
    const currentExerciseData = workout.exercises[currentExercise]
    if (!currentExerciseData) return 0
    return Math.round((currentSet / currentExerciseData.sets) * 100)
  }

  const getEstimatedCaloriesBurned = () => {
    const progress = getWorkoutProgress()
    return Math.round((workout.calories * progress) / 100)
  }

  const formatLastSaved = () => {
    if (!lastSaved) return ''
    
    const now = new Date()
    const diff = now - lastSaved
    const minutes = Math.floor(diff / (1000 * 60))
    
    if (minutes < 1) return 'Saved just now'
    if (minutes === 1) return 'Saved 1 minute ago'
    if (minutes < 60) return `Saved ${minutes} minutes ago`
    
    return `Saved at ${lastSaved.toLocaleTimeString()}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader 
        title={workout.title}
        subtitle={workout.description}
        backTo="/workouts"
        showHome={true}
      >
        <div className="flex items-center space-x-3">
          {!isActive ? (
            <Button onClick={handleStartWorkout} className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              Start Workout
            </Button>
          ) : isPaused ? (
            <Button onClick={handleResumeWorkout} className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              Resume
            </Button>
          ) : (
            <Button onClick={handlePauseWorkout} variant="secondary">
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          
          {isActive && (
            <Button onClick={handleStopWorkout} variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
              <Square className="w-4 h-4 mr-2" />
              Stop
            </Button>
          )}
          
          <Button onClick={handleResetWorkout} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workout Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{workout.duration}</p>
              <p className="text-sm text-gray-600">Target (min)</p>
            </Card>
            <Card className="p-4 text-center">
              <Flame className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{workout.calories}</p>
              <p className="text-sm text-gray-600">Target (cal)</p>
            </Card>
            <Card className="p-4 text-center">
              <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{workout.difficulty}</p>
              <p className="text-sm text-gray-600">Level</p>
            </Card>
            <Card className="p-4 text-center">
              <Zap className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{getEstimatedCaloriesBurned()}</p>
              <p className="text-sm text-gray-600">Burned (cal)</p>
            </Card>
          </div>

          {/* Current Exercise Status */}
          {isActive && (
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Current Exercise</h2>
                {isResting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-yellow-700">Resting</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-700">Active</span>
                  </div>
                )}
              </div>

              {isResting ? (
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Rest Time</h3>
                  <div className="text-4xl font-bold text-yellow-600 mb-4">
                    {formatTime(restTimer)}
                  </div>
                  <p className="text-gray-600 mb-4">
                    Get ready for set {currentSet} of {workout.exercises[currentExercise]?.name}
                  </p>
                  <Button onClick={handleSkipRest} variant="outline" size="sm">
                    Skip Rest
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {workout.exercises[currentExercise]?.name}
                    </h3>
                    <span className="text-sm text-gray-600">
                      Set {currentSet} of {workout.exercises[currentExercise]?.sets}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Reps</p>
                      <p className="text-xl font-bold text-gray-900">
                        {workout.exercises[currentExercise]?.reps}
                      </p>
                    </div>
                    {workout.exercises[currentExercise]?.weight && (
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Weight</p>
                        <p className="text-xl font-bold text-gray-900">
                          {workout.exercises[currentExercise]?.weight} lbs
                        </p>
                      </div>
                    )}
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Exercise Time</p>
                      <p className="text-xl font-bold text-blue-600">
                        {formatTime(exerciseTimer)}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Set Progress</span>
                      <span>{currentSet}/{workout.exercises[currentExercise]?.sets}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getCurrentExerciseProgress()}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {workout.exercises[currentExercise]?.instructions}
                  </p>

                  <div className="flex space-x-3">
                    <Button onClick={handleCompleteSet} className="flex-1">
                      <Check className="w-4 h-4 mr-2" />
                      Complete Set
                    </Button>
                    <Button onClick={handleSkipExercise} variant="outline">
                      <SkipForward className="w-4 h-4 mr-2" />
                      Skip Exercise
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Exercise List */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Exercises</h2>
            <div className="space-y-4">
              {workout.exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    index === currentExercise && isActive
                      ? 'border-blue-500 bg-blue-50'
                      : completedExercises.has(exercise.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        completedExercises.has(exercise.id)
                          ? 'bg-green-500 text-white'
                          : index === currentExercise && isActive
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {completedExercises.has(exercise.id) ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{exercise.name}</h3>
                    </div>
                    {index === currentExercise && isActive && !isResting && (
                      <div className="flex items-center space-x-2">
                        <Timer className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">
                          {formatTime(exerciseTimer)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Sets</p>
                      <p className="font-semibold">{exercise.sets}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Reps</p>
                      <p className="font-semibold">{exercise.reps}</p>
                    </div>
                    {exercise.weight && (
                      <div>
                        <p className="text-sm text-gray-600">Weight</p>
                        <p className="font-semibold">{exercise.weight} lbs</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Rest</p>
                      <p className="font-semibold">{exercise.restTime}s</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{exercise.instructions}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {exercise.targetMuscles.map((muscle, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Workout Timer & Progress */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Workout Timer</h3>
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${
                isActive && !isPaused ? 'text-green-600' : 
                isPaused ? 'text-yellow-600' : 'text-gray-600'
              }`}>
                {formatTime(timer)}
              </div>
              <p className="text-sm text-gray-600">
                {isActive && !isPaused ? 'Active' : 
                 isPaused ? 'Paused' : 'Total Time'}
              </p>
              {workoutStartTime && (
                <p className="text-xs text-gray-500 mt-2">
                  Started at {workoutStartTime.toLocaleTimeString()}
                </p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Exercises Completed</span>
                  <span>{completedExercises.size}/{workout.exercises.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getWorkoutProgress()}%` }}
                  />
                </div>
                <div className="text-center mt-2">
                  <span className="text-lg font-bold text-primary-600">
                    {getWorkoutProgress()}%
                  </span>
                </div>
              </div>
              
              {isActive && !isResting && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Current Exercise</p>
                  <p className="font-semibold text-gray-900">
                    {workout.exercises[currentExercise]?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Set {currentSet} of {workout.exercises[currentExercise]?.sets}
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Workout Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Time Elapsed</span>
                <span className="font-medium text-gray-900">{formatTime(timer)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Calories</span>
                <span className="font-medium text-gray-900">{getEstimatedCaloriesBurned()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Exercises Done</span>
                <span className="font-medium text-gray-900">{completedExercises.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Remaining</span>
                <span className="font-medium text-gray-900">
                  {workout.exercises.length - completedExercises.size}
                </span>
              </div>
            </div>
          </Card>

          {/* Enhanced Workout Notes */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Workout Notes
              </h3>
              <div className="flex items-center space-x-2">
                <label className="flex items-center space-x-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={autoSaveEnabled}
                    onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span>Auto-save</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-3">
              <textarea
                value={workoutNotes}
                onChange={handleNotesChange}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Add notes about your workout, how you felt, weights used, modifications made, etc..."
              />
              
              {/* Save Status */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  {notesSaved ? (
                    <div className="flex items-center text-green-600">
                      <Check className="w-4 h-4 mr-1" />
                      <span>Saved</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-yellow-600">
                      <div className="w-4 h-4 mr-1 flex items-center justify-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      </div>
                      <span>Unsaved changes</span>
                    </div>
                  )}
                  {lastSaved && (
                    <span className="text-gray-500">• {formatLastSaved()}</span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  {workoutNotes.trim() && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearNotes}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Clear
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => handleSaveNotes(false)}
                    disabled={notesSaved || !workoutNotes.trim()}
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
              
              {/* Character count */}
              <div className="text-xs text-gray-500 text-right">
                {workoutNotes.length} characters
              </div>
              
              {/* Quick note templates */}
              {workoutNotes.length === 0 && (
                <div className="border-t pt-3">
                  <p className="text-xs text-gray-500 mb-2">Quick templates:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Felt strong today!',
                      'Increased weight from last time',
                      'Need to work on form',
                      'Great workout with buddy',
                      'Challenging but completed'
                    ].map((template, index) => (
                      <button
                        key={index}
                        onClick={() => setWorkoutNotes(template)}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        {template}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}