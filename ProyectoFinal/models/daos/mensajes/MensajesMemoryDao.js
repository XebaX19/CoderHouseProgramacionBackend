const ContenedorMemory = require('../../contenedores/ContenedorMemory');

const arrayMensajes = []; 

class MensajesMemoryDao extends ContenedorMemory {
    constructor() {
        super(arrayMensajes);
    }
}

module.exports = MensajesMemoryDao;