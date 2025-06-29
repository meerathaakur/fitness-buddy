import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import { useAuth } from '../hooks/useAuth'
import { toast } from '../components/common/Toast'

const steps = [
  {
    title: 'What are your fitness goals?',
    subtitle: 'Select all that apply',
    type: 'multiple',
    options: [
      { id: 'weight_loss', label: 'Weight Loss', icon: '🏃‍♀️' },
      { id: 'muscle_gain', label: 'Muscle Gain', icon: '💪' },
      { id: 'endurance', label: 'Endurance', icon: '🚴‍♂️' },
      { id: 'flexibility', label: 'Flexibility', icon: '🧘‍♀️' },
      { id: 'general_fitness', label: 'General Fitness', icon: '⚡' },
      { id: 'strength', label: 'Strength Training', icon: '🏋️‍♂️' }
    ]
  },
  {
    title: 'What types of workouts do you enjoy?',
    subtitle: 'Choose your preferred activities',
    type: 'multiple',
    options: [
      { id: 'strength', label: 'Strength Training', icon: '🏋️‍♂️' },
      { id: 'cardio', label: 'Cardio', icon: '🏃‍♀️' },
      { id: 'yoga', label: 'Yoga', icon: '🧘‍♀️' },
      { id: 'pilates', label: 'Pilates', icon: '🤸‍♀️' },
      { id: 'swimming', label: 'Swimming', icon: '🏊‍♀️' },
      { id: 'cycling', label: 'Cycling', icon: '🚴‍♂️' },
      { id: 'running', label: 'Running', icon: '🏃‍♂️' },
      { id: 'sports', label: 'Sports', icon: '⚽' }
    ]
  },
  {
    title: 'How often do you work out?',
    subtitle: 'This helps us match you with similar buddies',
    type: 'single',
    options: [
      { id: '1-2', label: '1-2 times per week', icon: '📅' },
      { id: '3-4', label: '3-4 times per week', icon: '📅' },
      { id: '5-6', label: '5-6 times per week', icon: '📅' },
      { id: 'daily', label: 'Daily', icon: '📅' }
    ]
  }
]

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const { updateProfile } = useAuth()
  const navigate = useNavigate()

  const handleAnswer = (stepIndex, value) => {
    const step = steps[stepIndex]
    
    if (step.type === 'multiple') {
      const currentAnswers = answers[stepIndex] || []
      const newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter(a => a !== value)
        : [...currentAnswers, value]
      
      setAnswers(prev => ({
        ...prev,
        [stepIndex]: newAnswers
      }))
    } else {
      setAnswers(prev => ({
        ...prev,
        [stepIndex]: value
      }))
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    // Update user profile with onboarding data
    const profileData = {
      fitnessGoals: answers[0] || [],
      workoutPreferences: answers[1] || [],
      workoutFrequency: answers[2] || ''
    }
    
    updateProfile(profileData)
    toast.success('Profile setup complete!')
    navigate('/dashboard')
  }

  const isStepComplete = () => {
    const answer = answers[currentStep]
    return answer && (Array.isArray(answer) ? answer.length > 0 : true)
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentStepData.title}
            </h1>
            <p className="text-gray-600">{currentStepData.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {currentStepData.options.map((option) => {
              const isSelected = currentStepData.type === 'multiple'
                ? (answers[currentStep] || []).includes(option.id)
                : answers[currentStep] === option.id

              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(currentStep, option.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!isStepComplete()}
            >
              {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
              {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}