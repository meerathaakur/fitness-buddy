import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Flame, Target, Play, Pause, RotateCcw, Check } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'

export default function WorkoutDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isActive, setIsActive] = useState(false)
  const [currentExercise, setCurrentExercise] = useState(0)
  const [timer, setTimer] = useState(0)
  const [completedExercises, setCompletedExercises] = useState(new Set())

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
        targetMuscles: ['Chest', 'Shoulders', 'Triceps']
      },
      {
        id: 2,
        name: 'Dumbbell Bench Press',
        sets: 3,
        reps: 10,
        weight: 25,
        restTime: 90,
        instructions: 'Lie on bench, press dumbbells up from chest level to full arm extension.',
        targetMuscles: ['Chest', 'Shoulders', 'Triceps']
      },
      {
        id: 3,
        name: 'Shoulder Press',
        sets: 3,
        reps: 12,
        weight: 20,
        restTime: 60,
        instructions: 'Press dumbbells overhead from shoulder height to full extension.',
        targetMuscles: ['Shoulders', 'Triceps']
      },
      {
        id: 4,
        name: 'Tricep Dips',
        sets: 3,
        reps: 15,
        restTime: 60,
        instructions: 'Lower your body by bending your arms, then push back up.',
        targetMuscles: ['Triceps', 'Shoulders']
      }
    ]
  }

  const handleStartWorkout = () => {
    setIsActive(true)
    // Start timer logic would go here
  }

  const handlePauseWorkout = () => {
    setIsActive(false)
    // Pause timer logic would go here
  }

  const handleCompleteExercise = (exerciseId) => {
    setCompletedExercises(prev => new Set([...prev, exerciseId]))
    if (currentExercise < workout.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
    }
  }

  const handleResetWorkout = () => {
    setIsActive(false)
    setCurrentExercise(0)
    setTimer(0)
    setCompletedExercises(new Set())
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/workouts')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{workout.title}</h1>
            <p className="text-gray-600 mt-1">{workout.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {!isActive ? (
            <Button onClick={handleStartWorkout}>
              <Play className="w-4 h-4 mr-2" />
              Start Workout
            </Button>
          ) : (
            <Button onClick={handlePauseWorkout} variant="secondary">
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          <Button onClick={handleResetWorkout} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workout Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{workout.duration}</p>
              <p className="text-sm text-gray-600">Minutes</p>
            </Card>
            <Card className="p-4 text-center">
              <Flame className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{workout.calories}</p>
              <p className="text-sm text-gray-600">Calories</p>
            </Card>
            <Card className="p-4 text-center">
              <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{workout.difficulty}</p>
              <p className="text-sm text-gray-600">Level</p>
            </Card>
          </div>

          {/* Exercise List */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Exercises</h2>
            <div className="space-y-4">
              {workout.exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className={`p-4 rounded-lg border-2 transition-all ${index === currentExercise && isActive
                      ? 'border-primary-500 bg-primary-50'
                      : completedExercises.has(exercise.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-white'
                    }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${completedExercises.has(exercise.id)
                          ? 'bg-green-500 text-white'
                          : index === currentExercise && isActive
                            ? 'bg-primary-500 text-white'
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
                    {index === currentExercise && isActive && (
                      <Button
                        size="sm"
                        onClick={() => handleCompleteExercise(exercise.id)}
                        disabled={completedExercises.has(exercise.id)}
                      >
                        Complete
                      </Button>
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
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {formatTime(timer)}
              </div>
              <p className="text-sm text-gray-600">Total Time</p>
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
                    style={{
                      width: `${(completedExercises.size / workout.exercises.length) * 100}%`
                    }}
                  />
                </div>
              </div>

              {isActive && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Current Exercise</p>
                  <p className="font-semibold text-gray-900">
                    {workout.exercises[currentExercise]?.name}
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Workout Notes</h3>
            <textarea
              className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Add notes about your workout..."
            />
          </Card>
        </div>
      </div>
    </div>
  )
}