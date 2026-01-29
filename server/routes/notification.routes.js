
// routes/notification.routes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

// user routes
router.get('/', notificationController.getNotifications);
router.put('/:notificationId/read', notificationController.markAsRead);
router.put('/mark-all-read', notificationController.markAllAsRead);

// admin routes
// router.post('/notification-type',authGuard(['admin','super_admin']), createType) // create controller
// router.put('/notification-type/:id', authGuard(['admin','super_admin']), updateType);
// router.delete('/notification-type/:id', authGuard(['super_admin']), deleteType);


module.exports = router;
