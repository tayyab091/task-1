const PRODUCT_CATEGORIES = [
    'Light Jet',
    'Midsize Jet',
    'Heavy Jet',
    'Ultra Long Range',
    'Services',
    'Accessories'
];

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

module.exports = {
    PRODUCT_CATEGORIES,
    ADMIN_PASSWORD
};