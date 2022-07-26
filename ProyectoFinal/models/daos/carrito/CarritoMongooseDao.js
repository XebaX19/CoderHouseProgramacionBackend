const mongoose = require('mongoose');
const ContenedorMongoose = require('../../contenedores/ContenedorMongoose');
const ProductosMongoose = require('../../daos/productos/ProductosMongooseDao');

const Schema = mongoose.Schema;
const coleccion = 'carritos';

const carritoSchema = new Schema({
    emailUsuario: { type: String, required: true },
    productos: { type: [] || [ProductosMongoose.schema] },
    estado: { type: String, required: true, default: 'pendiente' }
});

class CarritoMongooseDao extends ContenedorMongoose {
    constructor() {
        super(coleccion, carritoSchema);
    }
}

module.exports = CarritoMongooseDao;