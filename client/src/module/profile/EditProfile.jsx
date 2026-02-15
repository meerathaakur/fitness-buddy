import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Camera, X, Upload, User, MapPin, Calendar, Target, Dumbbell } from 'lucide-react'
import Card from '../../common/Card'
import { useAuth } from '../auth/useAuth'
import Avatar from '../../common/Avatar'
import Button from '../../common/Button'
import { toast } from '../../common/Toast'
import Select from '../../common/Select'

// Options for dropdowns and checkboxes
const fitnessLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
]

const workoutTypes = [
    'strength', 'cardio', 'yoga', 'pilates', 'swimming', 'cycling',
    'running', 'sports', 'crossfit', 'boxing', 'dancing', 'hiking'
]

const fitnessGoalOptions = [
    'weight_loss', 'muscle_gain', 'endurance', 'flexibility',
    'general_fitness', 'strength', 'rehabilitation', 'competition'
]

const workoutFrequencies = [
    { value: '1-2', label: '1-2 times per week' },
    { value: '3-4', label: '3-4 times per week' },
    { value: '5-6', label: '5-6 times per week' },
    { value: 'daily', label: 'Daily' }
]

const workoutTimes = [
    { value: 'early_morning', label: 'Early Morning (5-7 AM)' },
    { value: 'morning', label: 'Morning (7-10 AM)' },
    { value: 'midday', label: 'Mid-day (10 AM-2 PM)' },
    { value: 'afternoon', label: 'Afternoon (2-6 PM)' },
    { value: 'evening', label: 'Evening (6-9 PM)' },
    { value: 'night', label: 'Night (9 PM+)' }
]

const availabilityOptions = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
]

export default function EditProfile() {
    const { user, updateProfile } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.bio || '',
        location: user?.location || {
            type: "Point",
            coordinates: [0, 0],
            address: ""
        },
        age: user?.age || '',
        height: user?.height || '',
        weight: user?.weight || '',
        preferences:user?.preferences || {
            fitnessLevel: user?.preferences?.fitnessLevel || 'beginner',
            workoutTypes: user?.preferences?.workoutTypes || [],
            availableTime: user?.preferences?.availableTime || []
        },
        workoutPreferences: user?.workoutPreferences || [],
        fitnessGoals: user?.fitnessGoals || [],
        workoutFrequency: user?.workoutFrequency || '',
        preferredWorkoutTime: user?.preferredWorkoutTime || '',
        experience: user?.experience || '',
        injuries: user?.injuries || '',
        availability: user?.availability || []
    })

    const [profileImage, setProfileImage] = useState(user?.avatar || '')
    const [imageFile, setImageFile] = useState(null)



    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleArrayToggle = (array, value) => {
        setFormData(prev => ({
            ...prev,
            [array]: prev[array].includes(value)
                ? prev[array].filter(item => item !== value)
                : [...prev[array], value]
        }))
    }

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Invalid image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        setImageFile(file); // 🔑 IMPORTANT

        const reader = new FileReader();
        reader.onload = () => {
            setProfileImage(reader.result); // preview only
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setProfileImage('')
        setImageFile(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.name.trim()) {
                toast.error('Name is required');
                return;
            }
            if (!formData.email.trim()) {
                toast.error('Email is required');
                return;
            }
            // console.log("===prefrences===",formData.preferences, user.preferences.workoutTypes)
            const payload = new FormData();

            // append text fields
            if (formData.name) payload.append("name", formData.name);
            if (formData.email) payload.append("email", formData.email);
            if (imageFile) payload.append("avatar", imageFile); ///====
            // if (formData.location) payload.append("location", formData.location);
            
            // stringify nested objects
            payload.append("preferences", JSON.stringify(formData.preferences));
            console.log("====payload====",payload)
            // // debug for browser console
            // for (let pair of payload.entries()) {
            //     console.log("======>>>>>>",pair[0], pair[1]);
            // }
            await updateProfile(payload);

            toast.success('Profile updated successfully!');
            navigate('/profile');
        } catch (err) {
            console.log(err.message)
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    }

    const handleCancel = () => {
        navigate('/profile')
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        onClick={handleCancel}
                        className="p-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
                        <p className="text-gray-600 mt-1">Update your profile information and preferences</p>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Picture */}
                <Card className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Camera className="w-5 h-5 mr-2" />
                        Profile Picture
                    </h2>
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <Avatar
                                src={profileImage}
                                alt={formData?.name}
                                size="2xl"
                            />
                            {profileImage && (
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div>
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    <Upload className="w-4 h-4" />
                                    <span>Upload Photo</span>
                                </div>
                            </label>
                            <p className="text-sm text-gray-500 mt-2">
                                JPG, PNG or GIF. Max size 5MB.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Basic Information */}
                <Card className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Basic Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name <span className='text-red-500'>*</span>
                            </label>
                            <input
                                disabled={!!formData?.name}
                                type="text"
                                name="name"
                                value={formData?.name}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2
                                    bg-gray-100
                                    rounded-lg
                                    text-gray-900 text-sm
                                    placeholder-gray-400

                                    focus:outline-none
                                    focus:ring-0
                                    ${!!formData?.name ? 'cursor-not-allowed' : ''}
                                    transition`}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address <span className='text-red-500'>*</span>
                            </label>
                            <input
                                disabled={!!formData?.email}
                                type="email"
                                name="email"
                                value={formData?.email}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2
                                    bg-gray-100
                                    rounded-lg
                                    text-gray-900 text-sm
                                    placeholder-gray-400

                                    focus:outline-none
                                    focus:ring-0
                                    ${!!formData?.email ? 'cursor-not-allowed' : ''}
                                    transition`}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Age
                            </label>
                            <input
                                type="number"
                                name="age"
                                value={formData?.age}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2
                                    bg-gray-100
                                    rounded-lg
                                    text-gray-900 text-sm
                                    placeholder-gray-400

                                    focus:outline-none
                                    focus:ring-0
                                    transition`}
                                min="13"
                                max="120"
                                placeholder='Enter your age'
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    name="location"
                                    value={formData?.location?.address}
                                    onChange={(e) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            location: {
                                                ...prev.location,
                                                address: e.target.value
                                            }
                                        }))
                                    }
                                    className={`w-full px-3 py-2 pl-10
                                    bg-gray-100
                                    rounded-lg
                                    text-gray-900 text-sm
                                    placeholder-gray-400

                                    focus:outline-none
                                    focus:ring-0
                                    transition`}
                                    placeholder="City, State"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Height (optional)
                            </label>
                            <input
                                type="text"
                                name="height"
                                value={formData?.height}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2
                                    bg-gray-100
                                    rounded-lg
                                    text-gray-900 text-sm
                                    placeholder-gray-400

                                    focus:outline-none
                                    focus:ring-0
                                    transition`}
                                placeholder="5'8&quot; or 173 cm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Weight (optional)
                            </label>
                            <input
                                type="text"
                                name="weight"
                                value={formData?.weight}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2
                                    bg-gray-100
                                    rounded-lg
                                    text-gray-900 text-sm
                                    placeholder-gray-400

                                    focus:outline-none
                                    focus:ring-0
                                    transition`}
                                placeholder="150 lbs or 68 kg"
                            />
                        </div>
                    </div>
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bio
                        </label>
                        <textarea
                            name="bio"
                            value={formData?.bio}
                            onChange={handleInputChange}
                            className={`w-full h-24 resize-none px-3 py-2
                                    bg-gray-100
                                    rounded-lg
                                    text-gray-900 text-sm
                                    placeholder-gray-400

                                    focus:outline-none
                                    focus:ring-0
                                    transition`}
                            placeholder="Tell others about yourself and your fitness journey..."
                        />
                    </div>
                </Card>

                {/* Fitness Information */}
                <Card className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Dumbbell className="w-5 h-5 mr-2" />
                        Fitness Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Select
                            label="Fitness Level"
                            name="fitnessLevel"
                            value={formData?.preferences?.fitnessLevel}
                            options={fitnessLevels}
                            placeholder="Select fitness level"
                            onChange={(e) =>
                                setFormData(prev => ({
                                    ...prev,
                                    preferences:{
                                        ...prev.preferences, 
                                        fitnessLevel: e.target.value
                                    }
                                }))
                            }
                        />
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fitness Level
                            </label>
                            <select
                                name="fitnessLevel"
                                value={formData?.preferences?.fitnessLevel}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 pr-10
                                    bg-gray-100 rounded-lg
                                    text-sm text-gray-900

                                    hover:bg-gray-200
                                    focus:outline-none
                                    transition
                                    cursor-pointer"
                            >
                                {fitnessLevels.map(level => (
                                    <option key={level?.value} value={level?.value}>
                                        {level?.label}
                                    </option>
                                ))}
                            </select>                        
                        </div> */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Workout Frequency
                            </label>
                            <select
                                name="workoutFrequency"
                                value={formData?.workoutFrequency}
                                onChange={handleInputChange}
                                className="input w-full"
                            >
                                <option value="">Select frequency</option>
                                {workoutFrequencies.map(freq => (
                                    <option key={freq.value} value={freq.value}>
                                        {freq?.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Preferred Workout Time
                            </label>
                            <select
                                name="preferredWorkoutTime"
                                value={formData?.preferredWorkoutTime}
                                onChange={handleInputChange}
                                className="input w-full"
                            >
                                <option value="">Select time</option>
                                {workoutTimes.map(time => (
                                    <option key={time.value} value={time.value}>
                                        {time?.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Years of Experience
                            </label>
                            <input
                                type="text"
                                name="experience"
                                value={formData?.experience}
                                onChange={handleInputChange}
                                className="input w-full"
                                placeholder="e.g., 2 years"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Workout Preferences
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {workoutTypes.map((type) => (
                                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData?.workoutPreferences.includes(type)}
                                        onChange={() => handleArrayToggle('workoutPreferences', type)}
                                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-gray-700 capitalize">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Fitness Goals
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {fitnessGoalOptions.map((goal) => (
                                <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData?.fitnessGoals.includes(goal)}
                                        onChange={() => handleArrayToggle('fitnessGoals', goal)}
                                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-gray-700 capitalize">
                                        {goal.replace('_', ' ')}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Availability & Additional Info */}
                <Card className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        Availability & Additional Information
                    </h2>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Available Days
                        </label>
                        <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                            {availabilityOptions.map((day) => (
                                <label key={day} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData?.availability.includes(day)}
                                        onChange={() => handleArrayToggle('availability', day)}
                                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-gray-700 capitalize">{day.slice(0, 3)}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Injuries or Limitations (optional)
                        </label>
                        <textarea
                            name="injuries"
                            value={formData?.injuries}
                            onChange={handleInputChange}
                            className="input w-full h-20 resize-none"
                            placeholder="Any injuries, physical limitations, or health conditions to be aware of..."
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            This information helps potential workout partners understand your needs and limitations.
                        </p>
                    </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    )
}