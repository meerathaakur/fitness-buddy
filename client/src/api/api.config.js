import {
    loginAPI,
    registerAPI,
    verifyEmailAPI,
    forgotPasswordAPI,
    resetPasswordAPI,
    findBuddyAPI,
    getBuddyAPI,
    sendBuddyRequestAPI,
    responseToBuddyRequestAPI,
    createChallengeAPI,
    getAllChallengeAPI,
    joinChallengeAPI,
    updateChallengeProgressAPI,
    getChallengeLeaderboardAPI,
    createGoalAPI,
    getUserGoalAPI,
    updateGoalAPI,
    updateGoalProgressAPI,
    deleteGoalAPI,
    sendMessageAPI,
    getAllConversationAPI,
    getConversationAPI,
    getProfileAPI,
    updateProfileAPI,
    updatePreferencesAPI,
    updateLocationAPI,
    createWorkoutAPI,
    getUserWorkoutAPI,
    getWeeklyAnalyticsAPI,
    getMonthlyAnalyticsAPI,
    getWorkoutStatsAPI,
    getWorkoutAPI,
    updateWorkoutAPI,
    deleteWorkoutAPI,
    getUserAnalyticsAPI,
    getNotificationsAPI,
    markNotificationAsReadAPI,
    markAllNotificationsAsReadAPI
} from "./all.api"


// Auth APIs
export const loginConfig = async (email, password) => {
    const res = await fetch(loginAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
    }
    return res.json()
}

export const registerConfig = async (userData) => {
    const res = await fetch(registerAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    })
    if (!res.ok) throw new Error("Registration failed", res.status);
    return res.json()
}

export const verifyMailConfig = async (email, otp) => {
    const res = await fetch(verifyEmailAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
    })
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
    }
    return res.json()
}

export const forgotPasswordConfig = async (email) => {
    const res = await fetch(forgotPasswordAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    })
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
    }
    return res.json()
}

export const resetPasswordConfig = async (email, otp, newPassword) => {
    const res = await fetch(resetPasswordAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
    })
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
    }
    return res.json()
}

// Buddies APIs
export const findBuddyConfig = async (token) => {
    const res = await fetch(findBuddyAPI, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
    if (!res.ok) {
        throw new Error(`Failed to fetch buddies: ${res.status}`)
    }
    return res.json()
}

export const getBuddyConfig = async (token) => {
    const res = await fetch(getBuddyAPI, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
    if (!res.ok) {
        throw new Error(`Failed to fetch buddy: ${res.status}`)
    }
    return res.json()
}

export const sendBuddyRequestConfig = async (token, buddyId) => {
    const res = await fetch(sendBuddyRequestAPI, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ buddyId })
    })
    if (!res.ok) {
        throw new Error(`Failed to send buddy request: ${res.status}`)
    }
    return res.json()
}

export const respondToBuddyRequestConfig = async (token, requestId, respond) => {
    const res = await fetch(responseToBuddyRequestAPI + requestId, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ respond })
    })
    if (!res.ok) {
        throw new Error(`Failed to respond to buddy request: ${res.status}`)
    }
    return res.json()
}

// Challenges APIs
export const createChallengeConfig = async (token, challengeData) => {
    const res = await fetch(createChallengeAPI, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(challengeData)
    })
    if (!res.ok) {
        throw new Error(`Failed to create challenge: ${res.status}`)
    }
    return res.json()
}

export const getAllChallengesConfig = async (token) => {
    const res = await fetch(getAllChallengeAPI, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
    if (!res.ok) {
        throw new Error(`Failed to fetch challenges: ${res.status}`)
    }
    return res.json()
}

export const joinChallengeConfig = async (token, challengeId) => {
    const res = await fetch(joinChallengeAPI.replace(":challengeId", challengeId), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
    if (!res.ok) {
        throw new Error(`Failed to join challenge: ${res.status}`)
    }
    return res.json()
}

export const updateChallengeProgressConfig = async (token, challengeId, progressData) => {
    const res = await fetch(updateChallengeProgressAPI.replace(":challengeId", challengeId), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(progressData)
    })
    if (!res.ok) {
        throw new Error(`Failed to update challenge progress: ${res.status}`)
    }
    return res.json()
}

export const getChallengeLeaderboardConfig = async (token, challengeId) => {
    const res = await fetch(getChallengeLeaderboardAPI.replace(":challengeId", challengeId), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
    if (!res.ok) {
        throw new Error(`Failed to fetch challenge leaderboard: ${res.status}`)
    }
    return res.json()
}

// Goals APIs
export const createGoalConfig = async (token, goalData) => {
    const res = await fetch(createGoalAPI, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(goalData)
    })
    if (!res.ok) {
        throw new Error(`Failed to create goal: ${res.status}`)
    }
    return res.json()
}

export const getUserGoalsConfig = async (token) => {
    const res = await fetch(getUserGoalAPI, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
    if (!res.ok) {
        throw new Error(`Failed to fetch user goals: ${res.status}`)
    }
    return res.json()
}

export const updateGoalConfig = async (token, goalId, goalData) => {
    const res = await fetch(updateGoalAPI + goalId, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(goalData)
    })
    if (!res.ok) {
        throw new Error(`Failed to update goal: ${res.status}`)
    }
    return res.json()
}

export const updateGoalProgressConfig = async (token, goalId, progressData) => {
    const res = await fetch(updateGoalProgressAPI + goalId + "/progress", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(progressData)
    })
    if (!res.ok) {
        throw new Error(`Failed to update goal progress: ${res.status}`)
    }
    return res.json()
}

export const deleteGoalConfig = async (token, goalId) => {
    const res = await fetch(deleteGoalAPI + goalId, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
    if (!res.ok) {
        throw new Error(`Failed to delete goal: ${res.status}`)
    }
    return res.json()
}

// Message APIs
export const sendMessageConfig = async (token, messageData) => {
    const res = await fetch(sendMessageAPI, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(messageData)
    })
    if (!res.ok) {
        throw new Error(`Failed to send message: ${res.status}`)
    }
    return res.json()
}

export const getAllConversationsConfig = async (token) => {
    const res = await fetch(getAllConversationAPI, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
    if (!res.ok) {
        throw new Error(`Failed to fetch conversations: ${res.status}`)
    }
    return res.json()
}

export const getConversationConfig = async (token, conversationId) => {
    const res = await fetch(getConversationAPI + conversationId, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
    if (!res.ok) {
        throw new Error(`Failed to fetch conversation: ${res.status}`)
    }
    return res.json()
}

// user APIs
export const getUserProfileConfig = async (token) => {
    const res = await fetch(getProfileAPI, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
    if (!res.ok) {
        throw new Error(`Failed to fetch profile: ${res.status}`)
    }
    return res.json()
}

export const updateProfileConfig = async (token, userData) => {
    const res = await fetch(updateProfileAPI, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userData)
    })
    if (!res.ok) {
        throw new Error(`Failed to update profile: ${res.status}`)
    }
    return res.json()
}

export const updatePreferencesConfig = async (token, preferences) => {
    const res = await fetch(updatePreferencesAPI, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(preferences)
    })
    if (!res.ok) {
        throw new Error(`Failed to update preferences: ${res.status}`)
    }
    return res.json()
}

export const updateLocationConfig = async (token, location) => {
    const res = await fetch(updateLocationAPI, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(location)
    })
    if (!res.ok) {
        throw new Error(`Failed to update location: ${res.status}`)
    }
    return res.json()
}

// Workouts APIs
export const createWorkoutConfig = async (token, workoutData) => {
    const res = await fetch(createWorkoutAPI, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(workoutData)
    })
    if (!res.ok) {
        throw new Error(`Failed to create workout: ${res.status}`)
    }
    return res.json()
}

export const getUserWorkoutsConfig = async (token) => {
    const res = await fetch(getUserWorkoutAPI, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
    if (!res.ok) {
        throw new Error(`Failed to fetch user workouts: ${res.status}`)
    }
    return res.json()
}

export const getWeeklyAnalyticsConfig = async (token) => {
    const res = await fetch(getWeeklyAnalyticsAPI, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
    if (!res.ok) {
        throw new Error(`Failed to fetch weekly analytics: ${res.status}`)
    }
    return res.json()
}

export const getMonthlyAnalyticsConfig = async (token) => {
    const res = await fetch(getMonthlyAnalyticsAPI, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
    if (!res.ok) {
        throw new Error(`Failed to fetch monthly analytics: ${res.status}`)
    }
    return res.json()
}

export const getWorkoutStatsConfig = async (token) => {
    const res = await fetch(getWorkoutStatsAPI, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
    if (!res.ok) {
        throw new Error(`Failed to fetch workout stats: ${res.status}`)
    }
    return res.json()
}

export const getWorkoutConfig = async (token, workoutId) => {
    const res = await fetch(getWorkoutAPI + workoutId, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
    if (!res.ok) {
        throw new Error(`Failed to fetch workout: ${res.status}`)
    }
    return res.json()
}

export const updateWorkoutConfig = async (token, workoutId, workoutData) => {
    const res = await fetch(updateWorkoutAPI + workoutId, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(workoutData)
    })
    if (!res.ok) {
        throw new Error(`Failed to update workout: ${res.status}`)
    }
    return res.json()
}

export const deleteWorkoutConfig = async (token, workoutId) => {
    const res = await fetch(deleteWorkoutAPI + workoutId, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
    if (!res.ok) {
        throw new Error(`Failed to delete workout: ${res.status}`)
    }
    return res.json()
}

// Analytics APIs
export const getUserAnalyticsConfig = async (token) => {
    const res = await fetch(getUserAnalyticsAPI, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
    if (!res.ok) {
        throw new Error(`Failed to fetch user analytics: ${res.status}`)
    }
    return res.json()
}

// Notifications APIs
export const getNotificationsConfig = async (token) => {
    const res = await fetch(getNotificationsAPI, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
    if (!res.ok) {
        throw new Error(`Failed to fetch notifications: ${res.status}`)
    }
    return res.json()
}

export const markNotificationAsReadConfig = async (token, notificationId) => {
    const res = await fetch(markNotificationAsReadAPI + notificationId + "/read", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
    if (!res.ok) {
        throw new Error(`Failed to mark notification as read: ${res.status}`)
    }
    return res.json()
}

export const markAllNotificationsAsReadConfig = async (token) => {
    const res = await fetch(markAllNotificationsAsReadAPI, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
    if (!res.ok) {
        throw new Error(`Failed to mark all notifications as read: ${res.status}`)
    }
    return res.json()
}
