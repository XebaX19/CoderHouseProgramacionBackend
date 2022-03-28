const mongoose = require('mongoose');
const ContenedorMongoose = require('../../contenedores/ContenedorMongoose');

const Schema = mongoose.Schema;
const coleccion = 'productos';

const productoSchema = new Schema({
    timestamp: { type: Date, required: true, default: Date.now() },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    codigo: { type: String, required: true, unique: true, sparse: true },
    fotoUrl: { type: String },
    precio: { type: Number, min: 0, required: true },
    stock: { type: Number, min: 0 }
});

class ProductosMongooseDao extends ContenedorMongoose {
    constructor() {
        super(coleccion, productoSchema);
    }
}

module.exports = ProductosMongooseDao;