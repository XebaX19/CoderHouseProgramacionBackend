const yup = require('yup');

class MensajeSchema {
    
    static #Schema = yup.object({
        emailUsuario: yup.string().required(),
        tipo: yup.string().required(),
        mensaje: yup.string().required()
    });

    constructor(emailUsuario, tipo, mensaje) {
        this.emailUsuario = emailUsuario;
        this.tipo = tipo;
        this.mensaje = mensaje;
    }

    static async validate(mensajeItem) {
        try {
           return await MensajeSchema.#Schema.validate(mensajeItem); 
        } catch (error) {
            throw error;
        }
    }
}

module.exports = MensajeSchema;
