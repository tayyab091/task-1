const mongoose = require('mongoose');
const { PRODUCT_CATEGORIES } = require('../config/constants');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: PRODUCT_CATEGORIES
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    inStock: {
        type: Boolean,
        default: true
    },
    specifications: {
        passengers: Number,
        range: String,
        speed: String
    }
}, {
    timestamps: true
});

productSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model('Product', productSchema);
