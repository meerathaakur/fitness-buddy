
// services/workout.service.js
const Workout = require('../models/Workout');
const GoalService = require('./goal.service');

class WorkoutService {
    static async createWorkout(workoutData) {
        try {
            const workout = await Workout.create(workoutData);

            // Update related goals
            await this.updateRelatedGoals(workoutData.userId, workout);

            return workout;
        } catch (error) {
            console.error('Error creating workout:', error);
            throw error;
        }
    }

    static async updateRelatedGoals(userId, workout) {
        try {
            const goals = await GoalService.getUserGoals(userId, 'active');
            
            for (const goal of goals) {
                let progressIncrement = 0;

                switch (goal.type) {
                    case 'workout_count':
                        progressIncrement = 1;
                        break;
                    case 'duration':
                        progressIncrement = workout.duration || 0;
                        break;
                    case 'calories':
                        progressIncrement = workout.caloriesBurned || 0;
                        break;
                    case 'distance':
                        progressIncrement = workout.distance || 0;
                        break;
                }

                if (progressIncrement > 0) {
                    const newProgress = goal.progress + progressIncrement;
                    await GoalService.updateGoalProgress(goal._id, newProgress);
                }
            }
        } catch (error) {
            console.error('Error updating related goals:', error);
        }
    }

    static async getUserWorkouts(userId, filters = {}) {
        try {
            const query = { userId };

            if (filters.type) {
                query.type = filters.type;
            }

            if (filters.startDate && filters.endDate) {
                query.date = {
                    $gte: new Date(filters.startDate),
                    $lte: new Date(filters.endDate)
                };
            }

            const workouts = await Workout.find(query)
                .sort({ date: -1 })
                .limit(filters.limit || 50);

            return workouts;
        } catch (error) {
            console.error('Error getting user workouts:', error);
            throw error;
        }
    }

    static async getWorkoutById(workoutId) {
        try {
            const workout = await Workout.findById(workoutId);
            return workout;
        } catch (error) {
            console.error('Error getting workout by ID:', error);
            throw error;
        }
    }

    static async updateWorkout(workoutId, updateData) {
        try {
            const workout = await Workout.findByIdAndUpdate(
                workoutId,
                updateData,
                { new: true, runValidators: true }
            );
            return workout;
        } catch (error) {
            console.error('Error updating workout:', error);
            throw error;
        }
    }

    static async deleteWorkout(workoutId) {
        try {
            const workout = await Workout.findByIdAndDelete(workoutId);
            return workout;
        } catch (error) {
            console.error('Error deleting workout:', error);
            throw error;
        }
    }

    static async generateWeeklyReport(userId) {
        try {
            const startOfWeek = new Date();
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
            startOfWeek.setHours(0, 0, 0, 0);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);

            const workouts = await Workout.find({
                userId,
                date: {
                    $gte: startOfWeek,
                    $lte: endOfWeek
                }
            });

            const totalWorkouts = workouts.length;
            const totalDuration = workouts.reduce((sum, workout) => sum + (workout.duration || 0), 0);
            const totalCalories = workouts.reduce((sum, workout) => sum + (workout.caloriesBurned || 0), 0);
            const totalDistance = workouts.reduce((sum, workout) => sum + (workout.distance || 0), 0);

            const workoutsByType = workouts.reduce((acc, workout) => {
                acc[workout.type] = (acc[workout.type] || 0) + 1;
                return acc;
            }, {});

            return {
                week: {
                    start: startOfWeek,
                    end: endOfWeek
                },
                totalWorkouts,
                totalDuration,
                totalCalories,
                totalDistance,
                workoutsByType,
                workouts
            };
        } catch (error) {
            console.error('Error generating weekly report:', error);
            throw error;
        }
    }
}

module.exports = WorkoutService;
