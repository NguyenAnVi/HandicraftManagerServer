const mongoose = require('mongoose')

// Define the model
const Schema = new mongoose.Schema({
    notificationId: String,
    sender: mongoose.Schema.Types.ObjectId,
    receiver: [mongoose.Schema.Types.ObjectId],
    header: String,
    body: String,
    dateCreate: Date,
}, {_id: false})

// Export the model
module.exports = mongoose.model('Notification', Schema);