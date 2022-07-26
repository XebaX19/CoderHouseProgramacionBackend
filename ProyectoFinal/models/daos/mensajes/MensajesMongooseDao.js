const mongoose = require('mongoose');
const ContenedorMongoose = require('../../contenedores/ContenedorMongoose');

const Schema = mongoose.Schema;
const coleccion = 'mensajes';

const mensajeSchema = new Schema({
    emailUsuario: { type: String, required: true },
    tipo: { type: String, required: true },
    mensaje: { type: String, required: true },
    timestamp: { type: Date, required: true, default: Date.now() }
});

class MensajesMongooseDao extends ContenedorMongoose {
    constructor() {
        super(coleccion, mensajeSchema);
    }
}

module.exports = MensajesMongooseDao;