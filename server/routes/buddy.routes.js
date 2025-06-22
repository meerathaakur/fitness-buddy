
// routes/buddy.routes.js
const express = require('express');
const router = express.Router();
const buddyController = require('../controllers/buddy.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/find', buddyController.findBuddies);
router.get('/', buddyController.getBuddies);
router.post('/request', buddyController.sendBuddyRequest);
router.put('/request/:requestId', buddyController.respondToBuddyRequest);

module.exports = router;
