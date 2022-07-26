const { MensajesDao } = require('../../models/daos/daos.factory');
const mensajesDao = new MensajesDao();
const MensajeSchema = require('../../models/schemas/mensajes.schema');
const { STATUS } = require('../../utils/constants/api.constants');
const CustomError = require('../../utils/errors/customError');

class MensajesServices {
    static async #validateMensaje(mensaje) {
        try {

            return await MensajeSchema.validate(mensaje);
        } catch (error) {
            throw new CustomError(
                STATUS.BAD_REQUEST,
                `El formato del mensaje enviado es incorrecto`,
                error
            );
        }
    };

    async getAllMensajesService() {
        const resultado = await mensajesDao.getAll();

        if (resultado === -1) {
            throw new CustomError(
                STATUS.SERVER_ERROR,
                `Hubo un error al buscar todos los mensajes`
            );
        }
        if (resultado.length === 0) {
            throw new CustomError(
                STATUS.NOT_FOUND,
                `No se encontraron mensajes`
            );
        }

        return resultado;
    }

    async getMensajesByUsuarioService(usuario) {
        if (!usuario) {
            throw new CustomError(
                STATUS.BAD_REQUEST,
                `El parámetro 'usuario' es requerido`
            );
        }

        const resultado = await mensajesDao.getByParametro('emailUsuario', usuario);
    
        if (resultado === -1) {
            throw new CustomError(
                STATUS.SERVER_ERROR,
                `Hubo un error al buscar mensajes del usuario ${usuario}`
            );
        }
        if (resultado === null || resultado.length === 0) {
            throw new CustomError(
                STATUS.NOT_FOUND,
                `No se encontraron mensajes del usuario ${usuario}`
            );
        }
    
        return resultado;
    }

    async createMensajeService(msj) {
        const newMensaje = await MensajesServices.#validateMensaje(msj);

        const resultado = await mensajesDao.save(newMensaje);

        if (resultado === -1) {
            throw new CustomError(
                STATUS.SERVER_ERROR,
                `Error al agregar mensaje`
            );
        }
        
        return resultado;
    }
}

module.exports = MensajesServices;