
// routes/goal.routes.js
const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goal.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.post('/', goalController.createGoal);
router.get('/', goalController.getUserGoals);
router.put('/:goalId', goalController.updateGoal);
router.put('/:goalId/progress', goalController.updateGoalProgress);
router.delete('/:goalId', goalController.deleteGoal);

module.exports = router;
