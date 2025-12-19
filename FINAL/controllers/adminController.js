const Product = require('../models/Product');
const { ADMIN_PASSWORD, PRODUCT_CATEGORIES } = require('../config/constants');

const processProductData = (body) => {
    const { name, price, category, image, description, inStock, passengers, range, speed } = body;
    return {
        name,
        price: parseFloat(price),
        category,
        image,
        description,
        inStock: inStock === 'true',
        specifications: {
            passengers: passengers ? parseInt(passengers) : undefined,
            range: range || undefined,
            speed: speed || undefined
        }
    };
};

const adminController = {
    getLogin: (req, res) => {
        res.render('admin/login', {
            title: 'Admin Login - BeJet',
            page: 'admin-login',
            layout: false,
            error: null
        });
    },

    postLogin: (req, res) => {
        const { password } = req.body;
        
        if (password === ADMIN_PASSWORD) {
            req.session.isAdmin = true;
            res.redirect('/admin/dashboard');
        } else {
            res.render('admin/login', {
                title: 'Admin Login - BeJet',
                page: 'admin-login',
                layout: false,
                error: 'Invalid password'
            });
        }
    },

    logout: (req, res) => {
        req.session.destroy();
        res.redirect('/');
    },

    getDashboard: async (req, res) => {
        try {
            const totalProducts = await Product.countDocuments();
            const products = await Product.find().sort({ createdAt: -1 }).limit(10);
            res.render('admin/dashboard', {
                title: 'Admin Dashboard - BeJet',
                page: 'admin',
                totalProducts,
                products
            });
        } catch (error) {
            res.status(500).send('Error loading dashboard');
        }
    },

    getAddProduct: (req, res) => {
        res.render('admin/add-product', {
            title: 'Add Product - BeJet',
            page: 'admin',
            categories: PRODUCT_CATEGORIES
        });
    },

    postAddProduct: async (req, res) => {
        try {
            const productData = processProductData(req.body);
            const product = new Product(productData);
            await product.save();
            res.redirect('/admin/dashboard');
        } catch (error) {
            res.status(500).send('Error adding product');
        }
    },

    getEditProduct: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) return res.status(404).send('Product not found');
            res.render('admin/edit-product', {
                title: 'Edit Product - BeJet',
                page: 'admin',
                product,
                categories: PRODUCT_CATEGORIES
            });
        } catch (error) {
            res.status(500).send('Error loading product');
        }
    },

    postEditProduct: async (req, res) => {
        try {
            const productData = processProductData(req.body);
            await Product.findByIdAndUpdate(req.params.id, productData);
            res.redirect('/admin/dashboard');
        } catch (error) {
            res.status(500).send('Error updating product');
        }
    },

    deleteProduct: async (req, res) => {
        try {
            await Product.findByIdAndDelete(req.params.id);
            res.redirect('/admin/dashboard');
        } catch (error) {
            res.status(500).send('Error deleting product');
        }
    }
};

module.exports = adminController;
