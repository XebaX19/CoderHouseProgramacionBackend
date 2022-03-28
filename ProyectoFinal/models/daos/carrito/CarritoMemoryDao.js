const ContenedorMemory = require('../../contenedores/ContenedorMemory');

const arrayCarritos = []; 

class CarritoMemoryDao extends ContenedorMemory {
    constructor() {
        super(arrayCarritos);
    }
}

module.exports = CarritoMemoryDao;