const ContenedorFirebase = require('../../contenedores/ContenedorFirebase');

class ProductosFirebaseDao extends ContenedorFirebase {
    constructor() {
        super('productos');
    }
}

module.exports = ProductosFirebaseDao;