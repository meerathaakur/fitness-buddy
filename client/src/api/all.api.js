// const BASE_URL = "https://fitness-buddy-9o01.onrender.com";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("BASE API", BASE_URL)

// Auth APIs
export const registerAPI = `${BASE_URL}/auth/register`;
export const loginAPI = `${BASE_URL}/auth/login`;
export const verifyEmailAPI = `${BASE_URL}/auth/verify-email`;
export const forgotPasswordAPI = `${BASE_URL}/auth/forgot-password`;
export const resetPasswordAPI = `${BASE_URL}/auth/reset-password`;

// buddies API
export const findBuddyAPI = `${BASE_URL}/buddies/find`;
export const getBuddyAPI = `${BASE_URL}/buddies`;
export const sendBuddyRequestAPI = `${BASE_URL}/buddies/request`;
export const responseToBuddyRequestAPI = `${BASE_URL}/buddies/request/:requestId`

// Challenges API
export const createChallengeAPI=`${BASE_URL}/challenges`;
export const getAllChallengeAPI=`${BASE_URL}/challenges`;
export const joinChallengeAPI=`${BASE_URL}/challenges/686ce6c725c30a3998bf3053/join`;
export const updateChallengeProgressAPI=`${BASE_URL}/challenges/686ce6c725c30a3998bf3053/progress`;
export const getChallengeLeaderboardAPI=`${BASE_URL}/challenges/686ce6c725c30a3998bf3053/leaderboard`;


// Goals API
export const createGoalAPI=`${BASE_URL}/goals`;
export const getUserGoalAPI=`${BASE_URL}/goals`;
export const updateGoalAPI = `${BASE_URL}/goals/686ce8ece8060528740df8a6`
export const updateGoalProgressAPI=`${BASE_URL}/goals/686ce8ece8060528740df8a6/progress`;
export const deleteGoalAPI=`${BASE_URL}/goals/686ce8ece8060528740df8a6`

// Message API
export const sendMessageAPI=`${BASE_URL}/messages`
export const getAllConversationAPI=`${BASE_URL}/messages/conversations`
export const getConversationAPI=`${BASE_URL}/messages/conversation/686d0774dd599b588c0265a5`

// User API
export const getProfileAPI=`${BASE_URL}/users/profile`
export const updateProfileAPI=`${BASE_URL}/users/profile`
export const updatePreferencesAPI=`${BASE_URL}/users/preferences`
export const updateLocationAPI=`${BASE_URL}/users/location`


// Workouts API
export const createWorkoutAPI=`${BASE_URL}/workouts`;
export const getUserWorkoutAPI=`${BASE_URL}/workouts`;
export const getWeeklyAnalyticsAPI=`${BASE_URL}/workouts/analytics/weekly`
export const getMonthlyAnalyticsAPI=`${BASE_URL}/workouts/analytics/monthly`
export const getWorkoutStatsAPI=`${BASE_URL}/workouts/analytics/stats`
export const getWorkoutAPI=`${BASE_URL}/workouts/686cf19ce933a0749b57baaf` 
export const updateWorkoutAPI=`${BASE_URL}/workouts/686cf19ce933a0749b57baaf` 
export const deleteWorkoutAPI=`${BASE_URL}/workouts/686cf19ce933a0749b57baaf` 

// Analytics API
export const getUserAnalyticsAPI=`${BASE_URL}/analytics/user`

// Notifications API
export const getNotificationsAPI=`${BASE_URL}/notifications`
export const markNotificationAsReadAPI=`${BASE_URL}/notifications/686ce62a25c30a3998bf3047/read`
export const markAllNotificationsAsRead=`${BASE_URL}/notifications/mark-all-read`
