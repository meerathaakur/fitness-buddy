import React, { useState, useEffect } from 'react'
import { Save, Bell, Shield, User, Palette, Globe, Smartphone, Mail, Lock, Eye, EyeOff, Check, Sun, Moon, Monitor } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import PageHeader from '../../components/common/PageHeader'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import { toast } from '../../components/common/Toast'

export default function Settings() {
    const { user, updateProfile } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const [activeTab, setActiveTab] = useState('profile')
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [savingStates, setSavingStates] = useState({})

    // Profile settings
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.bio || '',
        location: user?.location || '',
        age: user?.age || '',
        fitnessLevel: user?.fitnessLevel || 'beginner',
        workoutPreferences: user?.workoutPreferences || [],
        fitnessGoals: user?.fitnessGoals || []
    })

    // Notification settings
    const [notifications, setNotifications] = useState({
        workoutReminders: true,
        buddyRequests: true,
        challengeUpdates: true,
        goalMilestones: true,
        weeklyReports: false,
        marketingEmails: false,
        pushNotifications: true,
        emailNotifications: true,
        smsNotifications: false
    })

    // Privacy settings
    const [privacy, setPrivacy] = useState({
        profileVisibility: 'public',
        showLocation: true,
        showAge: false,
        showWorkoutHistory: true,
        allowMessages: 'everyone',
        showOnlineStatus: true,
        dataSharing: false
    })

    // Security settings
    const [security, setSecurity] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: false,
        loginAlerts: true,
        sessionTimeout: '30'
    })

    // Appearance settings - Initialize with current theme
    const [appearance, setAppearance] = useState({
        theme: theme,
        language: 'en',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        units: 'imperial'
    })

    // Update appearance state when theme context changes
    useEffect(() => {
        setAppearance(prev => ({ ...prev, theme: theme }))
    }, [theme])

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'privacy', label: 'Privacy', icon: Shield },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'appearance', label: 'Appearance', icon: Palette }
    ]

    const workoutTypes = [
        'strength', 'cardio', 'yoga', 'pilates', 'swimming', 'cycling', 'running', 'sports'
    ]

    const fitnessGoalOptions = [
        'weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'general_fitness', 'strength'
    ]

    const setSavingState = (section, isLoading) => {
        setSavingStates(prev => ({ ...prev, [section]: isLoading }))
    }

    const handleProfileSave = async () => {
        setSavingState('profile', true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            updateProfile(profileData)
            toast.success('Profile updated successfully!')
        } catch (error) {
            toast.error('Failed to update profile')
        } finally {
            setSavingState('profile', false)
        }
    }

    const handleNotificationSave = async () => {
        setSavingState('notifications', true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            // Save notification preferences
            toast.success('Notification preferences saved!')
        } catch (error) {
            toast.error('Failed to save notification preferences')
        } finally {
            setSavingState('notifications', false)
        }
    }

    const handlePrivacySave = async () => {
        setSavingState('privacy', true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            // Save privacy settings
            toast.success('Privacy settings saved!')
        } catch (error) {
            toast.error('Failed to save privacy settings')
        } finally {
            setSavingState('privacy', false)
        }
    }

    const handleSecuritySave = async () => {
        if (security.newPassword && security.newPassword !== security.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }
        if (security.newPassword && security.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }

        setSavingState('security', true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            // Save security settings
            toast.success('Security settings updated!')
            setSecurity(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }))
        } catch (error) {
            toast.error('Failed to update security settings')
        } finally {
            setSavingState('security', false)
        }
    }

    const handleAppearanceSave = async () => {
        setSavingState('appearance', true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Apply theme change immediately if different from current
            if (appearance.theme !== theme) {
                toggleTheme()
            }

            toast.success('Appearance settings saved!')
        } catch (error) {
            toast.error('Failed to save appearance settings')
        } finally {
            setSavingState('appearance', false)
        }
    }

    const handleWorkoutPreferenceToggle = (type) => {
        setProfileData(prev => ({
            ...prev,
            workoutPreferences: prev.workoutPreferences.includes(type)
                ? prev.workoutPreferences.filter(t => t !== type)
                : [...prev.workoutPreferences, type]
        }))
    }

    const handleFitnessGoalToggle = (goal) => {
        setProfileData(prev => ({
            ...prev,
            fitnessGoals: prev.fitnessGoals.includes(goal)
                ? prev.fitnessGoals.filter(g => g !== goal)
                : [...prev.fitnessGoals, goal]
        }))
    }

    const handleThemeChange = (selectedTheme) => {
        setAppearance(prev => ({ ...prev, theme: selectedTheme }))

        // Apply theme change immediately for better UX
        if (selectedTheme !== theme) {
            toggleTheme()
            toast.success(`Switched to ${selectedTheme} theme`)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title="Settings"
                subtitle="Manage your account preferences and privacy settings"
                backTo="/profile"
                showHome={true}
            />

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar */}
                <div className="lg:w-64">
                    <Card className="p-4">
                        <nav className="space-y-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === tab.id
                                                ? 'bg-primary-100 text-primary-700'
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{tab.label}</span>
                                    </button>
                                )
                            })}
                        </nav>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                                <Button
                                    onClick={handleProfileSave}
                                    disabled={savingStates.profile}
                                    className="min-w-[120px]"
                                >
                                    {savingStates.profile ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                                            className="input w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                                            className="input w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.location}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                                            className="input w-full"
                                            placeholder="City, State"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Age
                                        </label>
                                        <input
                                            type="number"
                                            value={profileData.age}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, age: e.target.value }))}
                                            className="input w-full"
                                            min="13"
                                            max="120"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bio
                                    </label>
                                    <textarea
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                                        className="input w-full h-24 resize-none"
                                        placeholder="Tell others about yourself and your fitness journey..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fitness Level
                                    </label>
                                    <select
                                        value={profileData.fitnessLevel}
                                        onChange={(e) => setProfileData(prev => ({ ...prev, fitnessLevel: e.target.value }))}
                                        className="input w-full"
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Workout Preferences
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {workoutTypes.map((type) => (
                                            <label key={type} className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={profileData.workoutPreferences.includes(type)}
                                                    onChange={() => handleWorkoutPreferenceToggle(type)}
                                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                                />
                                                <span className="text-sm text-gray-700 capitalize">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Fitness Goals
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {fitnessGoalOptions.map((goal) => (
                                            <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={profileData.fitnessGoals.includes(goal)}
                                                    onChange={() => handleFitnessGoalToggle(goal)}
                                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                                />
                                                <span className="text-sm text-gray-700 capitalize">
                                                    {goal.replace('_', ' ')}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
                                <Button
                                    onClick={handleNotificationSave}
                                    disabled={savingStates.notifications}
                                    className="min-w-[120px]"
                                >
                                    {savingStates.notifications ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Notifications</h3>
                                    <div className="space-y-4">
                                        {[
                                            { key: 'workoutReminders', label: 'Workout Reminders', description: 'Get reminded about scheduled workouts' },
                                            { key: 'buddyRequests', label: 'Buddy Requests', description: 'Notifications when someone wants to connect' },
                                            { key: 'challengeUpdates', label: 'Challenge Updates', description: 'Updates about challenges you\'ve joined' },
                                            { key: 'goalMilestones', label: 'Goal Milestones', description: 'Celebrate when you reach fitness goals' }
                                        ].map((item) => (
                                            <div key={item.key} className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">{item.label}</p>
                                                    <p className="text-sm text-gray-600">{item.description}</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications[item.key]}
                                                        onChange={(e) => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Communication Preferences</h3>
                                    <div className="space-y-4">
                                        {[
                                            { key: 'weeklyReports', label: 'Weekly Reports', description: 'Summary of your weekly fitness activity' },
                                            { key: 'marketingEmails', label: 'Marketing Emails', description: 'Updates about new features and promotions' }
                                        ].map((item) => (
                                            <div key={item.key} className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">{item.label}</p>
                                                    <p className="text-sm text-gray-600">{item.description}</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications[item.key]}
                                                        onChange={(e) => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Methods</h3>
                                    <div className="space-y-4">
                                        {[
                                            { key: 'pushNotifications', label: 'Push Notifications', description: 'Notifications on your device', icon: Smartphone },
                                            { key: 'emailNotifications', label: 'Email Notifications', description: 'Notifications via email', icon: Mail },
                                            { key: 'smsNotifications', label: 'SMS Notifications', description: 'Text message notifications', icon: Smartphone }
                                        ].map((item) => {
                                            const Icon = item.icon
                                            return (
                                                <div key={item.key} className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <Icon className="w-5 h-5 text-gray-400" />
                                                        <div>
                                                            <p className="font-medium text-gray-900">{item.label}</p>
                                                            <p className="text-sm text-gray-600">{item.description}</p>
                                                        </div>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={notifications[item.key]}
                                                            onChange={(e) => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                                    </label>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Privacy Tab */}
                    {activeTab === 'privacy' && (
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Privacy Settings</h2>
                                <Button
                                    onClick={handlePrivacySave}
                                    disabled={savingStates.privacy}
                                    className="min-w-[120px]"
                                >
                                    {savingStates.privacy ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Visibility</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Who can see your profile?
                                            </label>
                                            <select
                                                value={privacy.profileVisibility}
                                                onChange={(e) => setPrivacy(prev => ({ ...prev, profileVisibility: e.target.value }))}
                                                className="input w-full max-w-xs"
                                            >
                                                <option value="public">Everyone</option>
                                                <option value="buddies">Buddies Only</option>
                                                <option value="private">Private</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Who can send you messages?
                                            </label>
                                            <select
                                                value={privacy.allowMessages}
                                                onChange={(e) => setPrivacy(prev => ({ ...prev, allowMessages: e.target.value }))}
                                                className="input w-full max-w-xs"
                                            >
                                                <option value="everyone">Everyone</option>
                                                <option value="buddies">Buddies Only</option>
                                                <option value="none">No One</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Information Sharing</h3>
                                    <div className="space-y-4">
                                        {[
                                            { key: 'showLocation', label: 'Show Location', description: 'Display your city and state on your profile' },
                                            { key: 'showAge', label: 'Show Age', description: 'Display your age on your profile' },
                                            { key: 'showWorkoutHistory', label: 'Show Workout History', description: 'Allow others to see your workout activities' },
                                            { key: 'showOnlineStatus', label: 'Show Online Status', description: 'Let others know when you\'re online' }
                                        ].map((item) => (
                                            <div key={item.key} className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">{item.label}</p>
                                                    <p className="text-sm text-gray-600">{item.description}</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={privacy[item.key]}
                                                        onChange={(e) => setPrivacy(prev => ({ ...prev, [item.key]: e.target.checked }))}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Data & Analytics</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">Data Sharing</p>
                                                <p className="text-sm text-gray-600">Share anonymized data to help improve the platform</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={privacy.dataSharing}
                                                    onChange={(e) => setPrivacy(prev => ({ ...prev, dataSharing: e.target.checked }))}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
                                <Button
                                    onClick={handleSecuritySave}
                                    disabled={savingStates.security}
                                    className="min-w-[120px]"
                                >
                                    {savingStates.security ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                                    <div className="space-y-4 max-w-md">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Current Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showCurrentPassword ? 'text' : 'password'}
                                                    value={security.currentPassword}
                                                    onChange={(e) => setSecurity(prev => ({ ...prev, currentPassword: e.target.value }))}
                                                    className="input w-full pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showNewPassword ? 'text' : 'password'}
                                                    value={security.newPassword}
                                                    onChange={(e) => setSecurity(prev => ({ ...prev, newPassword: e.target.value }))}
                                                    className="input w-full pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Confirm New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    value={security.confirmPassword}
                                                    onChange={(e) => setSecurity(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                    className="input w-full pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">Enable Two-Factor Authentication</p>
                                            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={security.twoFactorEnabled}
                                                onChange={(e) => setSecurity(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Login Security</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">Login Alerts</p>
                                                <p className="text-sm text-gray-600">Get notified of new login attempts</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={security.loginAlerts}
                                                    onChange={(e) => setSecurity(prev => ({ ...prev, loginAlerts: e.target.checked }))}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                            </label>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Session Timeout (minutes)
                                            </label>
                                            <select
                                                value={security.sessionTimeout}
                                                onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                                                className="input w-full max-w-xs"
                                            >
                                                <option value="15">15 minutes</option>
                                                <option value="30">30 minutes</option>
                                                <option value="60">1 hour</option>
                                                <option value="120">2 hours</option>
                                                <option value="never">Never</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Appearance Tab */}
                    {activeTab === 'appearance' && (
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Appearance Settings</h2>
                                <Button
                                    onClick={handleAppearanceSave}
                                    disabled={savingStates.appearance}
                                    className="min-w-[120px]"
                                >
                                    {savingStates.appearance ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Theme</h3>
                                    <p className="text-sm text-gray-600 mb-4">Choose your preferred theme for the application</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                                        {/* Light Theme */}
                                        <button
                                            onClick={() => handleThemeChange('light')}
                                            className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${theme === 'light'
                                                    ? 'border-primary-500 bg-primary-50 shadow-md'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-2">
                                                    <Sun className="w-5 h-5 text-yellow-500" />
                                                    <span className="font-medium text-gray-900">Light</span>
                                                </div>
                                                {theme === 'light' && (
                                                    <Check className="w-5 h-5 text-primary-600" />
                                                )}
                                            </div>
                                            <div className="w-full h-16 bg-white border border-gray-200 rounded mb-2 relative overflow-hidden">
                                                <div className="h-3 bg-gray-100 border-b border-gray-200"></div>
                                                <div className="p-2 space-y-1">
                                                    <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                                                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-600">Clean and bright interface</p>
                                        </button>

                                        {/* Dark Theme */}
                                        <button
                                            onClick={() => handleThemeChange('dark')}
                                            className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${theme === 'dark'
                                                    ? 'border-primary-500 bg-primary-50 shadow-md'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-2">
                                                    <Moon className="w-5 h-5 text-blue-500" />
                                                    <span className="font-medium text-gray-900">Dark</span>
                                                </div>
                                                {theme === 'dark' && (
                                                    <Check className="w-5 h-5 text-primary-600" />
                                                )}
                                            </div>
                                            <div className="w-full h-16 bg-gray-800 border border-gray-600 rounded mb-2 relative overflow-hidden">
                                                <div className="h-3 bg-gray-700 border-b border-gray-600"></div>
                                                <div className="p-2 space-y-1">
                                                    <div className="h-2 bg-gray-500 rounded w-3/4"></div>
                                                    <div className="h-2 bg-gray-600 rounded w-1/2"></div>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-600">Easy on the eyes in low light</p>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Localization</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Language
                                            </label>
                                            <select
                                                value={appearance.language}
                                                onChange={(e) => setAppearance(prev => ({ ...prev, language: e.target.value }))}
                                                className="input w-full"
                                            >
                                                <option value="en">English</option>
                                                <option value="es">Español</option>
                                                <option value="fr">Français</option>
                                                <option value="de">Deutsch</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Timezone
                                            </label>
                                            <select
                                                value={appearance.timezone}
                                                onChange={(e) => setAppearance(prev => ({ ...prev, timezone: e.target.value }))}
                                                className="input w-full"
                                            >
                                                <option value="America/New_York">Eastern Time</option>
                                                <option value="America/Chicago">Central Time</option>
                                                <option value="America/Denver">Mountain Time</option>
                                                <option value="America/Los_Angeles">Pacific Time</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Display Preferences</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Date Format
                                            </label>
                                            <select
                                                value={appearance.dateFormat}
                                                onChange={(e) => setAppearance(prev => ({ ...prev, dateFormat: e.target.value }))}
                                                className="input w-full"
                                            >
                                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Units
                                            </label>
                                            <select
                                                value={appearance.units}
                                                onChange={(e) => setAppearance(prev => ({ ...prev, units: e.target.value }))}
                                                className="input w-full"
                                            >
                                                <option value="imperial">Imperial (lbs, ft)</option>
                                                <option value="metric">Metric (kg, cm)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}