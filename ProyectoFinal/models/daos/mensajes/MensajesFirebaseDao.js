const ContenedorFirebase = require('../../contenedores/ContenedorFirebase');

class MensajesFirebaseDao extends ContenedorFirebase {
    constructor() {
        super('mensajes');
    }
}

module.exports = MensajesFirebaseDao;