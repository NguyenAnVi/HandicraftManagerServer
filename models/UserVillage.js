const mongoose = require('mongoose')

// Define the model
const Schema = new mongoose.Schema({
    villageId: String,
    villageName: String,
    adminId: mongoose.Schema.Types.ObjectId,
    address: String,
    group: String,
    ward: String,
    district: String,
    city: String,
    majorWork: String,
    material: [String],
    productId: [mongoose.Schema.Types.ObjectId],
    workers: Number, //number of workers
    qrCode: String
})


// Export the model
module.exports = mongoose.model('UserVillage', Schema);