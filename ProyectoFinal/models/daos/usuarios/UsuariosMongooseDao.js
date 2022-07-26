const mongoose = require('mongoose');
const ContenedorMongoose = require('../../contenedores/ContenedorMongoose');

const Schema = mongoose.Schema;
const coleccion = 'usuarios';

const usuarioSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nombre: { type: String, required: true },
    direccion: { type: String },
    edad: { type: Number, min: 0 },
    nroTelefono: { type: String, required: true },
    avatar: { type: String },
    createdAt: { type: Date, required: true, default: Date.now() }
});

class UsuariosMongooseDao extends ContenedorMongoose {
    constructor() {
        super(coleccion, usuarioSchema);
    }

    async getByEmail(email) {
        //await this.conectarDB();
        const document = await this.model.findOne({ email }, { __v: 0 });
        //await this.desconectarDB();

        if (!document) {
            const errorMessage = `Wrong username or password`;
            throw new Error(errorMessage);
        } else {
            return document;
        }
    }
}

module.exports = UsuariosMongooseDao;