const mongoose = require('mongoose');
const ContenedorMongoose = require('../contenedores/ContenedorMongoose');

const Schema = mongoose.Schema;
const coleccion = 'productos';

const productoSchema = new Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true }
});

class ProductosMongooseDao extends ContenedorMongoose {
    constructor() {
        super(coleccion, productoSchema);
    }
}

module.exports = ProductosMongooseDao;