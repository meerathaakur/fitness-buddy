
// routes/challenge.routes.js
const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challenge.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.post('/', challengeController.createChallenge);
router.get('/', challengeController.getAllChallenges);
router.post('/:challengeId/join', challengeController.joinChallenge);
router.put('/:challengeId/progress', challengeController.updateChallengeProgress);
router.get('/:challengeId/leaderboard', challengeController.getChallengeLeaderboard);

module.exports = router;
