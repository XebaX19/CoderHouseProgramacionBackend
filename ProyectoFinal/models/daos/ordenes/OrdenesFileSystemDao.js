const ContenedorFileSystem = require('../../contenedores/ContenedorFileSystem');

class OrdenesFileSystemDao extends ContenedorFileSystem {
    constructor(emailUsuario, items) {
        super('ordenes.txt');
        this._id = -1;
        this.emailUsuario = emailUsuario;
        this.items = items;
        this.createdAt = Date.now();
        this.estado = 'generada';
    }
}

module.exports = OrdenesFileSystemDao;