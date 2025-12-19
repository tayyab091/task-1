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

    addToCart: async (req, res) => {
        try {
            const { id, quantity } = req.body;
            const product = await Product.findById(id);
            if (!product) return res.status(404).json({ error: 'Product not found' });
            
            if (!req.session.cart) req.session.cart = [];
            const existing = req.session.cart.find(item => item._id === id);
            if (existing) {
                existing.quantity = (existing.quantity || 1) + (parseInt(quantity) || 1);
            } else {
                req.session.cart.push({
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    image: product.image,
                    quantity: parseInt(quantity) || 1
                });
            }
            res.json({ success: true, cartCount: req.session.cart.length });
        } catch (error) {
            res.status(500).json({ error: 'Failed to add to cart' });
        }
    }

};

module.exports = productsController;
