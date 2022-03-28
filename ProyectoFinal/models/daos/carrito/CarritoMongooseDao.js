const mongoose = require('mongoose');
const ContenedorMongoose = require('../../contenedores/ContenedorMongoose');
const ProductosMongoose = require('../../daos/productos/ProductosMongooseDao');

const Schema = mongoose.Schema;
const coleccion = 'carritos';

const carritoSchema = new Schema({
    timestamp: { type : Date, required: true, default: Date.now() },
    productos: { type: [ProductosMongoose.schema]}
});

class CarritoMongooseDao extends ContenedorMongoose {
    constructor() {
        super(coleccion, carritoSchema);
    }
}

module.exports = CarritoMongooseDao;