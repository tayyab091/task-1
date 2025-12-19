const indexController = {
    getHome: (req, res) => {
        res.render('index', {
            title: 'BeJet - Private Jet Services',
            page: 'home'
        });
    }
};

module.exports = indexController;
