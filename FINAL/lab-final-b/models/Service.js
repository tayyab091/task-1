class Service {
    constructor(id, title, description, icon, image) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.icon = icon;
        this.image = image;
    }

    static getAll() {
        return [
            new Service(1, 'AIRPORT TRANSPORT', 'Mauris porttitor, turpis id placerat hendrerit, enim odio interdum metus, ac vehicula nisl est in mi! Nunc malesuada ac lectus sit amet vehicula.', '👁', '/images/home_jet_offer1.jpg'),
            new Service(2, 'CONCIERGE', 'Maecenas tempus tempus sem vulputate iaculis? Vestibulum lacinia metus est, eu pretium nunc cursus in. Sed id augue eget magna venenatis eleifend sed.', '📅', '/images/home_jet_offer2.jpg'),
            new Service(3, 'CATERING', 'Morbi pulvinar posuere sapien in finibus. Donec posuere felis enim, et sagittis lorem consectetur sit amet. Nulla quis orci vitae dolor rutrum.', '☕', '/images/home_jet_offer3.jpg')
        ];
    }

    static getById(id) {
        return this.getAll().find(s => s.id === parseInt(id));
    }
}

module.exports = Service;
