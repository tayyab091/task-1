const Product = require('../models/Product');

const productsController = {
    getProducts: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const category = req.query.category || '';
            const minPrice = parseFloat(req.query.minPrice) || 0;
            const maxPrice = parseFloat(req.query.maxPrice) || Infinity;
            const skip = (page - 1) * limit;
            const filter = {};
            
            if (category) filter.category = category;
            if (minPrice > 0 || maxPrice < Infinity) {
                filter.price = {};
                if (minPrice > 0) filter.price.$gte = minPrice;
                if (maxPrice < Infinity) filter.price.$lte = maxPrice;
            }

            const products = await Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
            const totalProducts = await Product.countDocuments(filter);
            const totalPages = Math.ceil(totalProducts / limit);
            const categories = await Product.distinct('category');

            res.render('products', {
                title: 'Our Fleet - BeJet',
                page: 'products',
                products,
                currentPage: page,
                totalPages,
                limit,
                category,
                minPrice: minPrice > 0 ? minPrice : '',
                maxPrice: maxPrice < Infinity ? maxPrice : '',
                categories,
                totalProducts
            });
        } catch (error) {
            res.status(500).render('error', {
                title: 'Error',
                message: 'Failed to load products',
                layout: false
            });
        }
    },

};

module.exports = productsController;
