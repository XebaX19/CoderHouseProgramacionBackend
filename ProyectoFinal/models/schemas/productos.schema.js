const yup = require('yup');

class ProductoSchema {
    
    static #Schema = yup.object({
        nombre: yup.string().required(),
        descripcion: yup.string().required(),
        codigo: yup.string().required(),
        fotoUrl: yup.string(),
        precio: yup.number().min(0).required(),
        stock: yup.number().min(0),
        categoria: yup.string()
    });

    constructor(nombre, descripcion, codigo, fotoUrl, precio, stock, categoria) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.codigo = codigo;
        this.fotoUrl = fotoUrl;
        this.precio = precio;
        this.stock = stock;
        this.categoria = categoria;
    }

    static async validate(productoItem) {
        try {
           return await ProductoSchema.#Schema.validate(productoItem); 
        } catch (error) {
            throw error;
        }
    }

    static getSchema() {
        return this.#Schema;
    }
}

module.exports = ProductoSchema;