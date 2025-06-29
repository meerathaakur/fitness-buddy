import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Dumbbell, 
  Users, 
  MessageCircle, 
  Target, 
  Trophy,
  BookOpen,
  User,
  ChevronDown,
  ChevronRight,
  UserPlus,
  UserCheck
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Workouts', href: '/workouts', icon: Dumbbell },
  { 
    name: 'Buddies', 
    icon: Users,
    submenu: [
      { name: 'Find Buddies', href: '/buddies', icon: UserPlus },
      { name: 'My Buddies', href: '/my-buddies', icon: UserCheck }
    ]
  },
  { name: 'Messages', href: '/messages', icon: MessageCircle },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'Challenges', href: '/challenges', icon: Trophy },
  { name: 'Workout Library', href: '/workout-library', icon: BookOpen },
  { name: 'Profile', href: '/profile', icon: User },
]

export default function Sidebar() {
  const location = useLocation()
  const [expandedMenus, setExpandedMenus] = useState(new Set())

  const toggleSubmenu = (itemName) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemName)) {
        newSet.delete(itemName)
      } else {
        newSet.add(itemName)
      }
      return newSet
    })
  }

  const isSubmenuActive = (submenu) => {
    return submenu.some(item => location.pathname === item.href)
  }

  const isItemActive = (item) => {
    if (item.submenu) {
      return isSubmenuActive(item.submenu)
    }
    return location.pathname === item.href
  }

  // Auto-expand submenu if any of its items are active
  React.useEffect(() => {
    navigation.forEach(item => {
      if (item.submenu && isSubmenuActive(item.submenu)) {
        setExpandedMenus(prev => new Set([...prev, item.name]))
      }
    })
  }, [location.pathname])

  return (
    <div className="fixed left-0 top-20 h-full w-64 bg-white shadow-sm border-r border-gray-200 z-40">
      <nav className="p-4 space-y-2 mt-4">
        {navigation.map((item) => {
          const isActive = isItemActive(item)
          const isExpanded = expandedMenus.has(item.name)
          
          if (item.submenu) {
            return (
              <div key={item.name}>
                {/* Main menu item with submenu */}
                <button
                  onClick={() => toggleSubmenu(item.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                
                {/* Submenu items */}
                {isExpanded && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.submenu.map((subItem) => {
                      const isSubActive = location.pathname === subItem.href
                      return (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isSubActive
                              ? 'bg-primary-100 text-primary-700'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <subItem.icon className="w-4 h-4 mr-3" />
                          {subItem.name}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          // Regular menu item without submenu
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}