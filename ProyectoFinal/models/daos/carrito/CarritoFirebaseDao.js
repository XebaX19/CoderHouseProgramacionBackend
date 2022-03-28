const ContenedorFirebase = require('../../contenedores/ContenedorFirebase');

class CarritoFirebaseDao extends ContenedorFirebase {
    constructor() {
        super('carritos');
    }
}

module.exports = CarritoFirebaseDao;