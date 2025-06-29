import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Trophy, Medal, Award, Search, Filter, Users, TrendingUp, Star } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Avatar from '../../components/common/Avatar'

export default function ChallengeLeaderboard() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('rank')
    const [filterBy, setFilterBy] = useState('all')

    // Mock challenge data
    const challenge = {
        id: id,
        title: '30-Day Fitness Challenge',
        totalParticipants: 1247,
        totalDays: 30,
        currentDay: 15
    }

    // Extended leaderboard data
    const leaderboard = [
        {
            id: 1,
            name: 'Sarah Johnson',
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
            points: 450,
            streak: 28,
            rank: 1,
            completionRate: 95,
            location: 'New York, NY',
            joinDate: '2024-12-01',
            badges: ['streak-master', 'early-bird'],
            isCurrentUser: false
        },
        {
            id: 2,
            name: 'Mike Chen',
            avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
            points: 420,
            streak: 25,
            rank: 2,
            completionRate: 88,
            location: 'San Francisco, CA',
            joinDate: '2024-12-01',
            badges: ['consistent'],
            isCurrentUser: false
        },
        {
            id: 3,
            name: 'Emma Davis',
            avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
            points: 380,
            streak: 22,
            rank: 3,
            completionRate: 82,
            location: 'Los Angeles, CA',
            joinDate: '2024-12-02',
            badges: ['motivator'],
            isCurrentUser: false
        },
        {
            id: 4,
            name: 'David Kim',
            avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
            points: 365,
            streak: 20,
            rank: 4,
            completionRate: 78,
            location: 'Chicago, IL',
            joinDate: '2024-12-01',
            badges: ['dedicated'],
            isCurrentUser: false
        },
        {
            id: 5,
            name: 'You',
            avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
            points: 340,
            streak: 18,
            rank: 5,
            completionRate: 75,
            location: 'Boston, MA',
            joinDate: '2024-12-03',
            badges: ['newcomer'],
            isCurrentUser: true
        },
        {
            id: 6,
            name: 'Jessica Park',
            avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
            points: 325,
            streak: 16,
            rank: 6,
            completionRate: 72,
            location: 'Seattle, WA',
            joinDate: '2024-12-04',
            badges: ['social'],
            isCurrentUser: false
        },
        {
            id: 7,
            name: 'Alex Rodriguez',
            avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
            points: 310,
            streak: 15,
            rank: 7,
            completionRate: 70,
            location: 'Miami, FL',
            joinDate: '2024-12-05',
            badges: [],
            isCurrentUser: false
        },
        {
            id: 8,
            name: 'Lisa Chen',
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
            points: 295,
            streak: 14,
            rank: 8,
            completionRate: 68,
            location: 'Austin, TX',
            joinDate: '2024-12-06',
            badges: ['supporter'],
            isCurrentUser: false
        },
        {
            id: 9,
            name: 'Tom Wilson',
            avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
            points: 280,
            streak: 12,
            rank: 9,
            completionRate: 65,
            location: 'Denver, CO',
            joinDate: '2024-12-07',
            badges: [],
            isCurrentUser: false
        },
        {
            id: 10,
            name: 'Anna Martinez',
            avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
            points: 265,
            streak: 11,
            rank: 10,
            completionRate: 62,
            location: 'Phoenix, AZ',
            joinDate: '2024-12-08',
            badges: ['persistent'],
            isCurrentUser: false
        }
    ]

    // Generate more participants for demonstration
    const generateMoreParticipants = () => {
        const names = [
            'John Smith', 'Maria Garcia', 'James Brown', 'Linda Johnson', 'Robert Davis',
            'Patricia Miller', 'Michael Wilson', 'Jennifer Moore', 'William Taylor', 'Elizabeth Anderson'
        ]
        const locations = [
            'Portland, OR', 'Nashville, TN', 'Atlanta, GA', 'Detroit, MI', 'Las Vegas, NV',
            'Philadelphia, PA', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA', 'Indianapolis, IN'
        ]

        const moreParticipants = []
        for (let i = 11; i <= 50; i++) {
            moreParticipants.push({
                id: i,
                name: names[Math.floor(Math.random() * names.length)],
                avatar: `https://images.pexels.com/photos/${1000000 + i}/pexels-photo-${1000000 + i}.jpeg?auto=compress&cs=tinysrgb&w=400`,
                points: Math.max(50, 260 - (i - 10) * 8 + Math.floor(Math.random() * 20)),
                streak: Math.max(1, 12 - Math.floor((i - 10) / 3) + Math.floor(Math.random() * 5)),
                rank: i,
                completionRate: Math.max(20, 65 - (i - 10) * 2 + Math.floor(Math.random() * 10)),
                location: locations[Math.floor(Math.random() * locations.length)],
                joinDate: `2024-12-${String(Math.floor(Math.random() * 15) + 1).padStart(2, '0')}`,
                badges: Math.random() > 0.7 ? ['participant'] : [],
                isCurrentUser: false
            })
        }
        return moreParticipants
    }

    const allParticipants = [...leaderboard, ...generateMoreParticipants()]

    const filteredParticipants = allParticipants.filter(participant => {
        const matchesSearch = participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            participant.location.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesFilter = filterBy === 'all' ||
            (filterBy === 'top-10' && participant.rank <= 10) ||
            (filterBy === 'top-50' && participant.rank <= 50) ||
            (filterBy === 'friends' && participant.isCurrentUser)

        return matchesSearch && matchesFilter
    })

    const sortedParticipants = [...filteredParticipants].sort((a, b) => {
        switch (sortBy) {
            case 'rank':
                return a.rank - b.rank
            case 'points':
                return b.points - a.points
            case 'streak':
                return b.streak - a.streak
            case 'completion':
                return b.completionRate - a.completionRate
            case 'name':
                return a.name.localeCompare(b.name)
            default:
                return a.rank - b.rank
        }
    })

    const getRankIcon = (rank) => {
        if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />
        if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />
        if (rank === 3) return <Award className="w-5 h-5 text-orange-500" />
        return <span className="text-sm font-bold text-gray-600">#{rank}</span>
    }

    const getBadgeColor = (badge) => {
        const colors = {
            'streak-master': 'bg-yellow-100 text-yellow-800',
            'early-bird': 'bg-blue-100 text-blue-800',
            'consistent': 'bg-green-100 text-green-800',
            'motivator': 'bg-purple-100 text-purple-800',
            'dedicated': 'bg-red-100 text-red-800',
            'newcomer': 'bg-indigo-100 text-indigo-800',
            'social': 'bg-pink-100 text-pink-800',
            'supporter': 'bg-teal-100 text-teal-800',
            'persistent': 'bg-orange-100 text-orange-800',
            'participant': 'bg-gray-100 text-gray-800'
        }
        return colors[badge] || 'bg-gray-100 text-gray-800'
    }

    const currentUser = allParticipants.find(p => p.isCurrentUser)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(`/challenges/${id}`)}
                        className="p-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Challenge Leaderboard</h1>
                        <p className="text-gray-600 mt-1">{challenge.title}</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Participants</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{challenge.totalParticipants}</p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Your Rank</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">#{currentUser?.rank}</p>
                        </div>
                        <div className="p-3 rounded-full bg-green-100">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Your Points</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{currentUser?.points}</p>
                        </div>
                        <div className="p-3 rounded-full bg-yellow-100">
                            <Star className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Your Streak</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{currentUser?.streak}</p>
                        </div>
                        <div className="p-3 rounded-full bg-red-100">
                            <Trophy className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search and Filters */}
            <Card className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search participants..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input pl-10 w-full"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="input lg:w-40"
                        >
                            <option value="rank">Sort by Rank</option>
                            <option value="points">Sort by Points</option>
                            <option value="streak">Sort by Streak</option>
                            <option value="completion">Sort by Completion</option>
                            <option value="name">Sort by Name</option>
                        </select>
                        <select
                            value={filterBy}
                            onChange={(e) => setFilterBy(e.target.value)}
                            className="input lg:w-40"
                        >
                            <option value="all">All Participants</option>
                            <option value="top-10">Top 10</option>
                            <option value="top-50">Top 50</option>
                            <option value="friends">Friends Only</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Top 3 Podium */}
            <Card className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Top Performers</h2>
                <div className="flex justify-center items-end space-x-8">
                    {/* 2nd Place */}
                    <div className="text-center">
                        <div className="relative mb-4">
                            <Avatar src={allParticipants[1]?.avatar} alt={allParticipants[1]?.name} size="xl" />
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">2</span>
                            </div>
                        </div>
                        <h3 className="font-semibold text-gray-900">{allParticipants[1]?.name}</h3>
                        <p className="text-sm text-gray-600">{allParticipants[1]?.points} points</p>
                        <div className="w-20 h-16 bg-gray-200 mx-auto mt-2 rounded-t-lg flex items-end justify-center pb-2">
                            <Medal className="w-6 h-6 text-gray-400" />
                        </div>
                    </div>

                    {/* 1st Place */}
                    <div className="text-center">
                        <div className="relative mb-4">
                            <Avatar src={allParticipants[0]?.avatar} alt={allParticipants[0]?.name} size="2xl" />
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">1</span>
                            </div>
                        </div>
                        <h3 className="font-semibold text-gray-900">{allParticipants[0]?.name}</h3>
                        <p className="text-sm text-gray-600">{allParticipants[0]?.points} points</p>
                        <div className="w-20 h-20 bg-yellow-200 mx-auto mt-2 rounded-t-lg flex items-end justify-center pb-2">
                            <Trophy className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>

                    {/* 3rd Place */}
                    <div className="text-center">
                        <div className="relative mb-4">
                            <Avatar src={allParticipants[2]?.avatar} alt={allParticipants[2]?.name} size="xl" />
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">3</span>
                            </div>
                        </div>
                        <h3 className="font-semibold text-gray-900">{allParticipants[2]?.name}</h3>
                        <p className="text-sm text-gray-600">{allParticipants[2]?.points} points</p>
                        <div className="w-20 h-12 bg-orange-200 mx-auto mt-2 rounded-t-lg flex items-end justify-center pb-2">
                            <Award className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Full Leaderboard */}
            <Card className="overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Full Leaderboard ({sortedParticipants.length} participants)
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rank
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Participant
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Points
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Streak
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Completion
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Badges
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedParticipants.map((participant) => (
                                <tr
                                    key={participant.id}
                                    className={`hover:bg-gray-50 ${participant.isCurrentUser ? 'bg-blue-50' : ''}`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {getRankIcon(participant.rank)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-3">
                                            <Avatar src={participant.avatar} alt={participant.name} size="sm" />
                                            <div>
                                                <p className={`text-sm font-medium ${participant.isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
                                                    {participant.name}
                                                    {participant.isCurrentUser && (
                                                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                            You
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Joined {new Date(participant.joinDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-gray-900">{participant.points}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{participant.streak} days</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                                <div
                                                    className="bg-green-600 h-2 rounded-full"
                                                    style={{ width: `${participant.completionRate}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-gray-900">{participant.completionRate}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-wrap gap-1">
                                            {participant.badges.map((badge, index) => (
                                                <span
                                                    key={index}
                                                    className={`px-2 py-1 text-xs rounded-full ${getBadgeColor(badge)}`}
                                                >
                                                    {badge.replace('-', ' ')}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {participant.location}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Empty State */}
            {sortedParticipants.length === 0 && (
                <Card className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No participants found</h3>
                    <p className="text-gray-600 mb-4">
                        Try adjusting your search criteria or filters.
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchTerm('')
                            setFilterBy('all')
                        }}
                    >
                        Clear Filters
                    </Button>
                </Card>
            )}
        </div>
    )
}