import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, Target, Trophy, MessageCircle } from 'lucide-react'
import Button from '../components/common/Button'

import bgImage from '../assets/image18.jpg'

export default function Home() {
  const features = [
    {
      icon: Users,
      title: 'Find Workout Buddies',
      description: 'Connect with like-minded fitness enthusiasts in your area'
    },
    {
      icon: Target,
      title: 'Set & Track Goals',
      description: 'Create personalized fitness goals and track your progress'
    },
    {
      icon: Trophy,
      title: 'Join Challenges',
      description: 'Participate in group challenges and earn rewards'
    },
    {
      icon: MessageCircle,
      title: 'Stay Connected',
      description: 'Chat with your fitness buddies and share your journey'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 bg-center bg-cover bg-no-repeat"
    style={{backgroundImage:`url(${bgImage})`}}
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6
            text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-400 to-white bg-clip-text text-transparent">
              Find Your Perfect
              <span className="text-cyan-100 block">Workout Partner</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Connect with fitness enthusiasts, set goals together, and stay motivated
              on your fitness journey with FitnessBuddy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/register">
                <Button size="lg" className="w-full sm:w-auto" >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-200 opacity-85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Everything You Need to Stay Fit
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides all the tools you need to find workout partners,
              track progress, and achieve your fitness goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-6 rounded-xl "
            >
            {/* <div className="absolute inset-0 bg-white/30 dark:bg-black/30 backdrop-blur-sm rounded-xl" /> */}
            {features.map((feature, index) => (
              <div key={index} className="
                text-center p-6 rounded-lg 
                bg-gray-500 opacity-100 text-white 
                backdrop-blur-sm border-2 border-gray-500
                shadow-lg hover:shadow-xl transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-white-600 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-200">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-100 mb-4">
            Ready to Start Your Fitness Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of fitness enthusiasts who have found their perfect workout partners.
          </p>
          <Link to="/auth/register">
            <Button variant="secondary" size="lg">
              Join FitnessBuddy Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}