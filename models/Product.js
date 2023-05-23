const mongoose = require('mongoose')

// Define the model
const Schema = new mongoose.Schema({
    productId: String,
    productName: String,
    villageId: mongoose.Schema.Types.ObjectId,
    materials: [String],
    sellingPrice: Number,
    buyingPrice: Number,
    productType: String,
    description: String,
    productImage: String
}, {_id: false})

// Export the model
module.exports = mongoose.model('Product', Schema);