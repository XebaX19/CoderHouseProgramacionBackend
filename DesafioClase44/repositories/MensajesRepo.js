const nombreArchivo = "mensajesNuevoFormato.txt";

const ClaseContenedorFileSystem = require('../models/contenedores/ContenedorFileSystem');

class MensajesRepo {
    constructor() {
        this.contenedor = new ClaseContenedorFileSystem(nombreArchivo);
        this.getAllMensajesRepo = this.getAllMensajesRepo.bind(this); 
        this.saveMensajeRepo = this.saveMensajeRepo.bind(this); 
    }

    async getAllMensajesRepo() {
        return await this.contenedor.getAll();
    }

    async saveMensajeRepo(msj) {
        await this.contenedor.save(msj);
    }
}

module.exports = MensajesRepo;