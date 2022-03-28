const ContenedorFileSystem = require('../../contenedores/ContenedorFileSystem');

class CarritoFileSystemDao extends ContenedorFileSystem {
    constructor(productos) {
        super('carritos.txt');
        this.id = -1;
        this.timestamp = Date.now();
        this.productos = productos;
    }
}

module.exports = CarritoFileSystemDao;