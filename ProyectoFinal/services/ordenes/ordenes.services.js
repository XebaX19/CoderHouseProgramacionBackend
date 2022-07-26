const { enviarEmail } = require('../../utils/mensajeria/envioMails');
const { enviarWhatsapp } = require('../../utils/mensajeria/envioWhatsapp');
const { enviarSMS } = require('../../utils/mensajeria/envioSMS');
const env = require('../../config/env.config');

const { OrdenesDao } = require('../../models/daos/daos.factory');
const ordenesDao = new OrdenesDao();
const { CarritoDao } = require('../../models/daos/daos.factory');
const carritoDao = new CarritoDao();
const { UsuariosDao } = require('../../models/daos/daos.factory');
const usuariosDao = new UsuariosDao();
const CarritoServices = require('../carrito/carrito.services');
const carritoServices = new CarritoServices();
const { STATUS } = require('../../utils/constants/api.constants');
const CustomError = require('../../utils/errors/customError');

class OrdenesServices {
    async getOrdenesService() {
        const resultado = await ordenesDao.getAll();

        if (resultado === -1) {
            throw new CustomError(
                STATUS.SERVER_ERROR,
                `Hubo un error al buscar todas las órdenes`
            );
        }
        if (resultado.length === 0) {
            throw new CustomError(
                STATUS.NOT_FOUND,
                `No se encontraron órdenes`
            );
        }

        return resultado;
    }

    async getOrdenesByUsuarioService(usuario) {
        if (!usuario) {
            throw new CustomError(
                STATUS.BAD_REQUEST,
                `El parámetro 'usuario' es requerido`
            );
        }

        const resultado = await ordenesDao.getByParametro('emailUsuario', usuario);
    
        if (resultado === -1) {
            throw new CustomError(
                STATUS.SERVER_ERROR,
                `Hubo un error al buscar órdenes para el usuario ${usuario}`
            );
        }
        if (resultado === null || resultado.length === 0) {
            throw new CustomError(
                STATUS.NOT_FOUND,
                `No se encontraron órdenes para el usuario ${usuario}`
            );
        }
    
        return resultado;
    }

    async createOrdenService(idCarrito) {
        const resultadoBusquedaCarrito = await carritoServices.getCarritoByIdService(idCarrito);

        if (resultadoBusquedaCarrito.estado !== 'pendiente') {
            throw new CustomError(
                STATUS.BAD_REQUEST,
                `El carrito ${idCarrito} se encuentra en un estado que no puede ser confirmado`
            );
        }

        if (resultadoBusquedaCarrito.productos.length === 0) {
            throw new CustomError(
                STATUS.NOT_FOUND,
                `No se encontraron productos asociados al carrito con id ${idCarrito}`
            );
        }

        let datosUser;
        try {
            datosUser = await usuariosDao.getByEmail(resultadoBusquedaCarrito.emailUsuario);
        } catch (error) {
            throw new CustomError(
                STATUS.SERVER_ERROR,
                `No se pudieron recuperar los datos del usuario ${resultadoBusquedaCarrito.emailUsuario}`
            );
        }

        let propiedadId;
        if (env.PERS === 'firebase') {
            propiedadId = 'id';
        } else {
            propiedadId = '_id';
        }

        let newOrdenCompra = {};
        newOrdenCompra.emailUsuario = datosUser.email;
        newOrdenCompra.items = [];
        resultadoBusquedaCarrito.productos.forEach(prod => {
            const indexItemExistente = newOrdenCompra.items.findIndex(x => x.idProducto.toString() === prod[propiedadId].toString());
        
            if (indexItemExistente === -1) {
                const newItem = {
                    idProducto: prod[propiedadId],
                    descripcion: prod.nombre,
                    precio: prod.precio,
                    cantidad: 1
                };

                newOrdenCompra.items.push(newItem); 
            } else {
                newOrdenCompra.items[indexItemExistente].cantidad++;
            }
        });

        const resultadoNewOrden = await ordenesDao.save(newOrdenCompra);
        if (resultadoNewOrden === -1) {
            throw new CustomError(
                STATUS.SERVER_ERROR,
                `Se produjo un error al confirmar el pedido del carrito ${idCarrito}`
            );
        }

        resultadoBusquedaCarrito.estado = 'finalizado';
        const resultadoUpdateCarrito = await carritoDao.update(idCarrito, resultadoBusquedaCarrito);
        if (resultadoUpdateCarrito === -1) {
            throw new CustomError(
                STATUS.SERVER_ERROR,
                `Se produjo un error al actualizar el estado del carrito ${idCarrito}`
            );
        }
    
        const productos = JSON.stringify(newOrdenCompra.items, null, 2);
    
        //Envío e-mail al administrador
        enviarEmail(env.EMAIL_ADMINISTRATOR, `Nuevo pedido de: ${datosUser.email}`, productos);
    
        //Envío Whatsapp al administrador
        enviarWhatsapp(env.CEL_ADMINISTRATOR, `
Nuevo pedido de: ${datosUser.email}
    
Productos:
    ${productos}`);
    
        //Envío SMS al cliente
        enviarSMS(datosUser.nroTelefono, 'Su pedido ha sido recibido y se encuentra en proceso.');
    
        return resultadoNewOrden;
    }
}

module.exports = OrdenesServices;