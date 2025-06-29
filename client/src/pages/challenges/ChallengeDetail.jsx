import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Users, Calendar, Trophy, Target, Clock, Star, Share2, Flag } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Avatar from '../../components/common/Avatar'
import { toast } from '../../components/common/Toast'

export default function ChallengeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isJoined, setIsJoined] = useState(false)

  // Mock challenge data
  const challenge = {
    id: id,
    title: '30-Day Fitness Challenge',
    description: 'Transform your fitness in 30 days with daily workouts and healthy habits',
    image: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: {
      name: 'FitnessBuddy Team',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    difficulty: 'Intermediate',
    duration: '30 days',
    startDate: '2024-12-15',
    endDate: '2025-01-14',
    participants: 1247,
    maxParticipants: 2000,
    points: 500,
    status: 'active',
    category: 'fitness',
    requirements: [
      'Complete daily workout (minimum 30 minutes)',
      'Log your meals for the day',
      'Drink at least 8 glasses of water',
      'Get 7+ hours of sleep',
      'Take progress photos weekly'
    ],
    rewards: [
      '500 points for completion',
      'Exclusive challenge badge',
      'Certificate of completion',
      'Entry into monthly prize draw'
    ],
    rules: [
      'Check in daily to track progress',
      'Be respectful to other participants',
      'Share progress photos (optional)',
      'Support fellow challengers',
      'No cheating or false reporting'
    ],
    leaderboard: [
      {
        id: 1,
        name: 'Sarah Johnson',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
        points: 450,
        streak: 28,
        rank: 1
      },
      {
        id: 2,
        name: 'Mike Chen',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
        points: 420,
        streak: 25,
        rank: 2
      },
      {
        id: 3,
        name: 'Emma Davis',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
        points: 380,
        streak: 22,
        rank: 3
      }
    ],
    progress: {
      currentDay: 15,
      totalDays: 30,
      completedTasks: 12,
      totalTasks: 15,
      streak: 8
    }
  }

  const handleJoinChallenge = () => {
    setIsJoined(true)
    toast.success(`Successfully joined ${challenge.title}!`)
  }

  const handleLeaveChallenge = () => {
    setIsJoined(false)
    toast.info(`Left ${challenge.title}`)
  }

  const handleShare = () => {
    toast.info('Challenge link copied to clipboard!')
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/challenges')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{challenge.title}</h1>
            <p className="text-gray-600 mt-1">{challenge.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          {!isJoined ? (
            <Button onClick={handleJoinChallenge}>
              Join Challenge
            </Button>
          ) : (
            <Button variant="outline" onClick={handleLeaveChallenge}>
              Leave Challenge
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Challenge Image */}
          <Card className="overflow-hidden">
            <div className="relative">
              <img
                src={challenge.image}
                alt={challenge.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 left-4 flex space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(challenge.status)}`}>
                  {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                </span>
              </div>
            </div>
          </Card>

          {/* Challenge Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{challenge.participants}</p>
              <p className="text-sm text-gray-600">Participants</p>
            </Card>
            <Card className="p-4 text-center">
              <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{challenge.duration}</p>
              <p className="text-sm text-gray-600">Duration</p>
            </Card>
            <Card className="p-4 text-center">
              <Trophy className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{challenge.points}</p>
              <p className="text-sm text-gray-600">Points</p>
            </Card>
            <Card className="p-4 text-center">
              <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{challenge.progress?.currentDay || 0}/{challenge.progress?.totalDays || 30}</p>
              <p className="text-sm text-gray-600">Days</p>
            </Card>
          </div>

          {/* Progress (if joined) */}
          {isJoined && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Progress</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Challenge Progress</span>
                    <span>{challenge.progress.currentDay}/{challenge.progress.totalDays} days</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(challenge.progress.currentDay / challenge.progress.totalDays) * 100}%`
                      }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary-600">{challenge.progress.streak}</p>
                    <p className="text-sm text-gray-600">Day Streak</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{challenge.progress.completedTasks}</p>
                    <p className="text-sm text-gray-600">Tasks Done</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">85%</p>
                    <p className="text-sm text-gray-600">Completion</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Requirements */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Daily Requirements</h2>
            <div className="space-y-3">
              {challenge.requirements.map((requirement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-gray-700">{requirement}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Rewards */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Rewards</h2>
            <div className="space-y-3">
              {challenge.rewards.map((reward, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                  <span className="text-gray-700">{reward}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Rules */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Challenge Rules</h2>
            <div className="space-y-3">
              {challenge.rules.map((rule, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Flag className="w-4 h-4 text-red-600 mt-0.5" />
                  <span className="text-gray-700">{rule}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Organizer */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Organized by</h3>
            <div className="flex items-center space-x-3">
              <Avatar src={challenge.organizer.avatar} alt={challenge.organizer.name} size="md" />
              <div>
                <p className="font-medium text-gray-900">{challenge.organizer.name}</p>
                <p className="text-sm text-gray-600">Challenge Organizer</p>
              </div>
            </div>
          </Card>

          {/* Challenge Dates */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Start Date</span>
                <span className="font-medium text-gray-900">
                  {new Date(challenge.startDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">End Date</span>
                <span className="font-medium text-gray-900">
                  {new Date(challenge.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium text-gray-900">{challenge.duration}</span>
              </div>
            </div>
          </Card>

          {/* Leaderboard */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Leaderboard</h3>
            <div className="space-y-3">
              {challenge.leaderboard.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      participant.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                      participant.rank === 2 ? 'bg-gray-100 text-gray-800' :
                      participant.rank === 3 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {participant.rank}
                    </div>
                    <Avatar src={participant.avatar} alt={participant.name} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                      <p className="text-xs text-gray-500">{participant.streak} day streak</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{participant.points}</p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to={`/challenges/${challenge.id}/leaderboard`}>
              <Button variant="outline" className="w-full mt-4" size="sm">
                View Full Leaderboard
              </Button>
            </Link>
          </Card>

          {/* Participation Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Participation</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Participants</span>
                  <span>{challenge.participants}/{challenge.maxParticipants}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(challenge.participants / challenge.maxParticipants) * 100}%`
                    }}
                  />
                </div>
              </div>
              <div className="text-center pt-2">
                <p className="text-sm text-gray-600">
                  {challenge.maxParticipants - challenge.participants} spots remaining
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}