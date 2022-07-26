const ContenedorFirebase = require('../../contenedores/ContenedorFirebase');

class OrdenesFirebaseDao extends ContenedorFirebase {
    constructor() {
        super('ordenes');
    }
}

module.exports = OrdenesFirebaseDao;