
// routes/workout.routes.js
const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workout.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { upload } = require('../config/multer');

router.use(authenticate);

router.post('/', upload.array('images', 5), workoutController.createWorkout);
router.get('/', workoutController.getUserWorkouts);
router.get('/analytics/weekly', workoutController.getWeeklyAnalytics);
router.get('/analytics/monthly', workoutController.getMonthlyAnalytics);
router.get('/analytics/stats', workoutController.getWorkoutStats);
router.get('/:workoutId', workoutController.getWorkout);
router.put('/:workoutId', workoutController.updateWorkout);
router.delete('/:workoutId', workoutController.deleteWorkout);

module.exports = router;
