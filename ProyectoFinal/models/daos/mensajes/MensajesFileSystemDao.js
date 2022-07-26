const ContenedorFileSystem = require('../../contenedores/ContenedorFileSystem');

class MensajesFileSystemDao extends ContenedorFileSystem {
    constructor(emailUsuario, tipo, mensaje) {
        super('mensajes.txt', );
        this._id = -1;
        this.timestamp = Date.now();
        this.emailUsuario = emailUsuario;
        this.tipo = tipo;
        this.mensaje = mensaje;
    }
}

module.exports = MensajesFileSystemDao;