const nombreArchivo = "mensajesNuevoFormato.txt";

const ClaseContenedorFileSystem = require('../models/contenedores/ContenedorFileSystem');
const contenedorMensajes = new ClaseContenedorFileSystem(nombreArchivo);

const getAllMensajesService = async () => {
    return await contenedorMensajes.getAll();
};

const saveMensajeService = async (msj) => {
    await contenedorMensajes.save(msj);
};

module.exports = {
    getAllMensajesService,
    saveMensajeService
};