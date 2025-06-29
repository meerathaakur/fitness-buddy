import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Users, Calendar, Clock, Target, Star, Filter, Search, Plus } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Avatar from '../../components/common/Avatar'
import { toast } from '../../components/common/Toast'

export default function Challenges() {
  const [activeTab, setActiveTab] = useState('available')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'weight_loss', name: 'Weight Loss' },
    { id: 'strength', name: 'Strength' },
    { id: 'endurance', name: 'Endurance' },
    { id: 'team', name: 'Team Challenges' },
    { id: 'monthly', name: 'Monthly Goals' }
  ]

  const availableChallenges = [
    {
      id: '1',
      title: '30-Day Push-Up Challenge',
      description: 'Build upper body strength with progressive push-up training',
      category: 'strength',
      duration: '30 days',
      participants: 1247,
      difficulty: 'intermediate',
      reward: '500 points',
      startDate: '2024-12-15',
      endDate: '2025-01-14',
      image: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=400',
      organizer: 'FitnessBuddy Team',
      requirements: ['Complete daily push-up sets', 'Log progress daily', 'Share weekly updates'],
      isPopular: true
    },
    {
      id: '2',
      title: 'Holiday Weight Loss Challenge',
      description: 'Stay fit during the holiday season with this 6-week challenge',
      category: 'weight_loss',
      duration: '6 weeks',
      participants: 892,
      difficulty: 'beginner',
      reward: '750 points',
      startDate: '2024-12-10',
      endDate: '2025-01-21',
      image: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=400',
      organizer: 'Sarah Johnson',
      requirements: ['Track daily calories', 'Exercise 4x per week', 'Weekly weigh-ins'],
      isPopular: false
    },
    {
      id: '3',
      title: 'Team Endurance Challenge',
      description: 'Join a team and collectively run 1000 miles this month',
      category: 'team',
      duration: '1 month',
      participants: 456,
      difficulty: 'advanced',
      reward: '1000 points',
      startDate: '2024-12-01',
      endDate: '2024-12-31',
      image: 'https://images.pexels.com/photos/1571939/pexels-photo-1571939.jpeg?auto=compress&cs=tinysrgb&w=400',
      organizer: 'Mike Chen',
      requirements: ['Join a team of 5', 'Log running activities', 'Support teammates'],
      isPopular: true
    },
    {
      id: '4',
      title: 'Yoga Flexibility Challenge',
      description: 'Improve flexibility with daily yoga practice',
      category: 'endurance',
      duration: '21 days',
      participants: 634,
      difficulty: 'beginner',
      reward: '400 points',
      startDate: '2024-12-20',
      endDate: '2025-01-10',
      image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400',
      organizer: 'Emma Wilson',
      requirements: ['Practice yoga daily', 'Complete flexibility tests', 'Share progress photos'],
      isPopular: false
    }
  ]

  const myChallenges = [
    {
      id: '5',
      title: 'November Strength Challenge',
      description: 'Increase bench press by 20 lbs',
      category: 'strength',
      status: 'completed',
      progress: 100,
      startDate: '2024-11-01',
      endDate: '2024-11-30',
      reward: '600 points',
      rank: 3,
      totalParticipants: 156
    },
    {
      id: '6',
      title: 'December Step Challenge',
      description: 'Walk 10,000 steps daily for the entire month',
      category: 'endurance',
      status: 'active',
      progress: 65,
      startDate: '2024-12-01',
      endDate: '2024-12-31',
      reward: '500 points',
      currentRank: 12,
      totalParticipants: 234
    }
  ]

  const handleJoinChallenge = (challengeId, challengeTitle) => {
    toast.success(`Successfully joined "${challengeTitle}"!`)
  }

  const handleLeaveChallenge = (challengeId, challengeTitle) => {
    toast.info(`Left "${challengeTitle}"`)
  }

  const filteredChallenges = availableChallenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || challenge.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100'
      case 'intermediate': return 'text-yellow-600 bg-yellow-100'
      case 'advanced': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-100'
      case 'completed': return 'text-green-600 bg-green-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const tabs = [
    { id: 'available', label: 'Available Challenges', count: availableChallenges.length },
    { id: 'my-challenges', label: 'My Challenges', count: myChallenges.length }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fitness Challenges</h1>
          <p className="text-gray-600 mt-1">Join challenges and compete with the community</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Challenge
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Challenges</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">1</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">1</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Trophy className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Points Earned</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">600</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Best Rank</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">#3</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Available Challenges Tab */}
      {activeTab === 'available' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search challenges..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10 w-full"
                  />
                </div>
              </div>
              <div className="lg:w-48">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="input w-full"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Challenges Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredChallenges.map((challenge) => (
              <Card key={challenge.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={challenge.image}
                    alt={challenge.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4 flex space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                    {challenge.isPopular && (
                      <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-medium">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                      {challenge.reward}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {challenge.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {challenge.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{challenge.duration}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{challenge.participants} joined</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Starts {new Date(challenge.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Trophy className="w-4 h-4 mr-2" />
                      <span>{challenge.reward}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Requirements:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {challenge.requirements.map((req, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2"></div>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      by {challenge.organizer}
                    </div>
                    <div className="flex space-x-2">
                      <Link to={`/challenges/${challenge.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        onClick={() => handleJoinChallenge(challenge.id, challenge.title)}
                      >
                        Join Challenge
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredChallenges.length === 0 && (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or check back later for new challenges.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setFilterCategory('all')
                }}
              >
                Clear Filters
              </Button>
            </Card>
          )}
        </div>
      )}

      {/* My Challenges Tab */}
      {activeTab === 'my-challenges' && (
        <div className="space-y-6">
          {myChallenges.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {myChallenges.map((challenge) => (
                <Card key={challenge.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {challenge.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{challenge.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(challenge.status)}`}>
                      {challenge.status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{challenge.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          challenge.status === 'completed' ? 'bg-green-500' : 'bg-primary-600'
                        }`}
                        style={{ width: `${challenge.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Start Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(challenge.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">End Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(challenge.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Reward</p>
                      <p className="font-medium text-gray-900">{challenge.reward}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {challenge.status === 'completed' ? 'Final Rank' : 'Current Rank'}
                      </p>
                      <p className="font-medium text-gray-900">
                        #{challenge.rank || challenge.currentRank} of {challenge.totalParticipants}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Link to={`/challenges/${challenge.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                    {challenge.status === 'active' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLeaveChallenge(challenge.id, challenge.title)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Leave Challenge
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges yet</h3>
              <p className="text-gray-600 mb-4">
                Join your first challenge to start competing with the community!
              </p>
              <Button onClick={() => setActiveTab('available')}>
                Browse Challenges
              </Button>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}