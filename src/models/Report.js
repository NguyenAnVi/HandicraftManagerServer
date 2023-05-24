const mongoose = require('mongoose')

// Define the model
const Schema = new mongoose.Schema({
    reportId: mongoose.Schema.Types.ObjectId,
    villageId: mongoose.Schema.Types.ObjectId,
    productId: mongoose.Schema.Types.ObjectId,
    quantity: Number,
    dateReport: Date,
})

// Export the model
module.exports = mongoose.model('Report', Schema);