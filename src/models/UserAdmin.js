const mongoose = require('mongoose')

// Define the model
const Schema = new mongoose.Schema({
    adminId: mongoose.Schema.Types.ObjectId,
    fullName: String,
    phoneNumber: String,
    email: String,
}, {_id:false})


// Export the model
module.exports = mongoose.model('UserAdmin', Schema);