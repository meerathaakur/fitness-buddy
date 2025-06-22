
// utils/constants.js
const WORKOUT_TYPES = [
    'cardio',
    'strength',
    'yoga',
    'running',
    'cycling',
    'swimming',
    'pilates',
    'crossfit',
    'martial_arts',
    'dance',
    'hiking',
    'sports',
    'other'
];

const FITNESS_GOALS = [
    'weight_loss',
    'weight_gain',
    'muscle_building',
    'endurance',
    'flexibility',
    'strength',
    'general_fitness',
    'stress_relief',
    'rehabilitation',
    'competition_prep'
];

const NOTIFICATION_TYPES = [
    'buddy_request',
    'buddy_accepted',
    'message_received',
    'goal_reminder',
    'goal_completed',
    'challenge_invitation',
    'challenge_completed',
    'workout_reminder',
    'weekly_report'
];

const GOAL_TYPES = [
    'workout_count',
    'duration',
    'calories',
    'distance',
    'weight_loss',
    'weight_gain'
];

const MESSAGE_TYPES = [
    'text',
    'image',
    'workout_share',
    'goal_share'
];

const CHALLENGE_TYPES = [
    'individual',
    'group',
    'community'
];

module.exports = {
    WORKOUT_TYPES,
    FITNESS_GOALS,
    NOTIFICATION_TYPES,
    GOAL_TYPES,
    MESSAGE_TYPES,
    CHALLENGE_TYPES
};
