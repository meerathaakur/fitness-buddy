// models/NotificationType.js
const mongoose = require('mongoose');

const notificationTypeSchema = new mongoose.Schema({
    value: { type: String, required: true },
    label: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model('NotificationType', notificationTypeSchema);