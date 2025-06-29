import React, { useState } from 'react'
import { Plus, Target, Calendar, TrendingUp, Edit, Trash2, CheckCircle, Clock } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import PageHeader from '../../components/common/PageHeader'
import { toast } from '../../components/common/Toast'

export default function Goals() {
  const [goals, setGoals] = useState([
    {
      id: '1',
      title: 'Lose 10 pounds',
      description: 'Lose 10 pounds by March 2025',
      targetValue: 10,
      currentValue: 3,
      unit: 'lbs',
      deadline: '2025-03-01',
      type: 'weight_loss',
      completed: false,
      createdAt: '2024-12-01'
    },
    {
      id: '2',
      title: 'Bench Press 200 lbs',
      description: 'Increase bench press to 200 lbs',
      targetValue: 200,
      currentValue: 155,
      unit: 'lbs',
      deadline: '2025-06-01',
      type: 'strength',
      completed: false,
      createdAt: '2024-11-15'
    },
    {
      id: '3',
      title: 'Run 5K in under 25 minutes',
      description: 'Complete a 5K run in under 25 minutes',
      targetValue: 25,
      currentValue: 28,
      unit: 'minutes',
      deadline: '2025-04-01',
      type: 'endurance',
      completed: false,
      createdAt: '2024-11-20'
    },
    {
      id: '4',
      title: 'Workout 4 times per week',
      description: 'Maintain consistent workout schedule',
      targetValue: 4,
      currentValue: 4,
      unit: 'times/week',
      deadline: '2025-12-31',
      type: 'consistency',
      completed: true,
      createdAt: '2024-10-01'
    }
  ])

  const [showAddGoal, setShowAddGoal] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetValue: '',
    currentValue: '',
    unit: '',
    deadline: '',
    type: 'general'
  })

  const goalTypes = [
    { value: 'weight_loss', label: 'Weight Loss', icon: '⚖️', color: 'bg-red-100 text-red-800' },
    { value: 'muscle_gain', label: 'Muscle Gain', icon: '💪', color: 'bg-blue-100 text-blue-800' },
    { value: 'strength', label: 'Strength', icon: '🏋️‍♂️', color: 'bg-purple-100 text-purple-800' },
    { value: 'endurance', label: 'Endurance', icon: '🏃‍♂️', color: 'bg-green-100 text-green-800' },
    { value: 'flexibility', label: 'Flexibility', icon: '🧘‍♀️', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'consistency', label: 'Consistency', icon: '📅', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'general', label: 'General', icon: '🎯', color: 'bg-gray-100 text-gray-800' }
  ]

  const getGoalTypeInfo = (type) => {
    return goalTypes.find(t => t.value === type) || goalTypes[goalTypes.length - 1]
  }

  const calculateProgress = (current, target) => {
    if (target === 0) return 0
    return Math.min((current / target) * 100, 100)
  }

  const getDaysRemaining = (deadline) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.targetValue || !newGoal.deadline) {
      toast.error('Please fill in all required fields')
      return
    }

    const goal = {
      ...newGoal,
      id: Date.now().toString(),
      targetValue: parseFloat(newGoal.targetValue),
      currentValue: parseFloat(newGoal.currentValue) || 0,
      completed: false,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setGoals(prev => [goal, ...prev])
    setNewGoal({
      title: '',
      description: '',
      targetValue: '',
      currentValue: '',
      unit: '',
      deadline: '',
      type: 'general'
    })
    setShowAddGoal(false)
    toast.success('Goal added successfully!')
  }

  const handleUpdateProgress = (goalId, newValue) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const updated = { ...goal, currentValue: parseFloat(newValue) }
        if (updated.currentValue >= updated.targetValue && !updated.completed) {
          updated.completed = true
          toast.success(`Congratulations! You've completed "${goal.title}"!`)
        }
        return updated
      }
      return goal
    }))
  }

  const handleDeleteGoal = (goalId) => {
    setGoals(prev => prev.filter(g => g.id !== goalId))
    toast.success('Goal deleted successfully')
  }

  const handleToggleComplete = (goalId) => {
    setGoals(prev => prev.map(goal =>
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    ))
  }

  const activeGoals = goals.filter(g => !g.completed)
  const completedGoals = goals.filter(g => g.completed)

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="My Goals"
        subtitle="Track your fitness goals and celebrate achievements"
        backTo="/dashboard"
        showHome={true}
      >
        <Button onClick={() => setShowAddGoal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Goal
        </Button>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Goals</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{goals.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Goals</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{activeGoals.length}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{completedGoals.length}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0}%
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Goal</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Title *
                </label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                  className="input w-full"
                  placeholder="e.g., Lose 10 pounds"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                  className="input w-full h-20 resize-none"
                  placeholder="Describe your goal..."
                />

              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Value *
                  </label>
                  <input
                    type="number"
                    value={newGoal.targetValue}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, targetValue: e.target.value }))}
                    className="input w-full"
                    placeholder="200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Value
                  </label>
                  <input
                    type="number"
                    value={newGoal.currentValue}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, currentValue: e.target.value }))}
                    className="input w-full"
                    placeholder="150"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                    className="input w-full"
                    placeholder="lbs, minutes, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={newGoal.type}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, type: e.target.value }))}
                    className="input w-full"
                  >
                    {goalTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline *
                </label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                  className="input w-full"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button onClick={handleAddGoal} className="flex-1">
                Add Goal
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddGoal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Goals</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeGoals.map((goal) => {
              const typeInfo = getGoalTypeInfo(goal.type)
              const progress = calculateProgress(goal.currentValue, goal.targetValue)
              const daysRemaining = getDaysRemaining(goal.deadline)

              return (
                <Card key={goal.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{typeInfo.icon}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleToggleComplete(goal.id)}
                        className="p-1 text-gray-400 hover:text-green-600"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {goal.description && (
                    <p className="text-gray-600 text-sm mb-4">{goal.description}</p>
                  )}

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{Math.round(progress)}% complete</span>
                      <span>
                        {daysRemaining > 0 ? `${daysRemaining} days left` :
                          daysRemaining === 0 ? 'Due today' : 'Overdue'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={goal.currentValue}
                      onChange={(e) => handleUpdateProgress(goal.id, e.target.value)}
                      className="input flex-1"
                      placeholder="Update progress"
                    />
                    <span className="text-sm text-gray-500">{goal.unit}</span>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      Due: {new Date(goal.deadline).toLocaleDateString()}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${daysRemaining > 7 ? 'bg-green-100 text-green-800' :
                        daysRemaining > 0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                      {daysRemaining > 0 ? `${daysRemaining} days` :
                        daysRemaining === 0 ? 'Due today' : 'Overdue'}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Completed Goals</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completedGoals.map((goal) => {
              const typeInfo = getGoalTypeInfo(goal.type)

              return (
                <Card key={goal.id} className="p-6 bg-green-50 border-green-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{typeInfo.icon}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {goal.description && (
                    <p className="text-gray-600 text-sm mb-4">{goal.description}</p>
                  )}

                  <div className="mb-4">
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full w-full" />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>100% complete</span>
                      <span>{goal.currentValue} {goal.unit} achieved</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-green-200">
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                      Completed
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleComplete(goal.id)}
                    >
                      Mark as Active
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {goals.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No goals yet</h3>
          <p className="text-gray-600 mb-4">
            Set your first fitness goal to start tracking your progress and stay motivated.
          </p>
          <Button onClick={() => setShowAddGoal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Goal
          </Button>
        </Card>
      )}
    </div>
  )
}