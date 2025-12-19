const User = require('../models/User');

const authController = {
    getLogin: (req, res) => {
        res.render('login', {
            title: 'Login - BeJet',
            page: 'login',
            error: null
        });
    },

    postLogin: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user || !(await user.comparePassword(password))) {
                return res.render('login', {
                    title: 'Login - BeJet',
                    page: 'login',
                    error: 'Invalid email or password'
                });
            }
            req.session.user = user;
            res.redirect('/products');
        } catch (error) {
            res.status(500).render('error', { message: 'Login error', layout: false });
        }
    },

    getRegister: (req, res) => {
        res.render('register', {
            title: 'Register - BeJet',
            page: 'register',
            error: null
        });
    },

    postRegister: async (req, res) => {
        try {
            const { name, email, password, confirmPassword } = req.body;
            if (password !== confirmPassword) {
                return res.render('register', {
                    title: 'Register - BeJet',
                    page: 'register',
                    error: 'Passwords do not match'
                });
            }
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.render('register', {
                    title: 'Register - BeJet',
                    page: 'register',
                    error: 'Email already registered'
                });
            }
            const user = new User({ name, email, password });
            await user.save();
            req.session.user = user;
            res.redirect('/products');
        } catch (error) {
            res.status(500).render('error', { message: 'Registration error', layout: false });
        }
    },

    logout: (req, res) => {
        req.session.destroy();
        res.redirect('/');
    }
};

module.exports = authController;