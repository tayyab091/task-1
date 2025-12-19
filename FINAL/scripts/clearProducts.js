require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const clearProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Database connected');
        
        const result = await Product.deleteMany({});
        console.log(`Deleted ${result.deletedCount} products`);
        
        await mongoose.connection.close();
        console.log('Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

clearProducts();
