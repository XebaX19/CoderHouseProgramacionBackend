const ContenedorMemory = require('../../contenedores/ContenedorMemory');

const arrayOrdenes = []; 

class OrdenesMemoryDao extends ContenedorMemory {
    constructor() {
        super(arrayOrdenes);
    }
}

module.exports = OrdenesMemoryDao;