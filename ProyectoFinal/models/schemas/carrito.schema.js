const yup = require('yup');
const ProductoSchema = require('./productos.schema');

class CarritoSchema {
    
    static #Schema = yup.object({
        emailUsuario: yup.string().required(),
        productos: yup.array().of(ProductoSchema.getSchema()),
        estado: yup.string().required().default('pendiente')
    });

    constructor(emailUsuario, productos) {
        this.emailUsuario = emailUsuario;
        this.productos = productos;
    }

    static async validate(carritoItem) {
        try {
           return await CarritoSchema.#Schema.validate(carritoItem); 
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CarritoSchema;
