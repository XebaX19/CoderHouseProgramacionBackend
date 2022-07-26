const mongoose = require('mongoose');
const ContenedorMongoose = require('../../contenedores/ContenedorMongoose');

const Schema = mongoose.Schema;
const coleccion = 'ordenes';

const ordenSchema = new Schema({
    emailUsuario: { type: String, required: true },
    items: { type: Array },
    createdAt: { type: Date, required: true, default: Date.now() },
    estado: { type: String, required: true, default: 'generada' }
});

class OrdenesMongooseDao extends ContenedorMongoose {
    constructor() {
        super(coleccion, ordenSchema);
    }
}

module.exports = OrdenesMongooseDao;