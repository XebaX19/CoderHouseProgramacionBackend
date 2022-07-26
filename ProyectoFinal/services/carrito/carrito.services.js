const { CarritoDao } = require('../../models/daos/daos.factory');
const carritoDao = new CarritoDao();
const CarritoSchema = require('../../models/schemas/carrito.schema');
const ProductosServices = require('../productos/productos.services');
const productosServices = new ProductosServices();
const { STATUS } = require('../../utils/constants/api.constants');
const CustomError = require('../../utils/errors/customError');

class CarritoServices {
    static async #validateCarrito(carrito) {
        try {

            return await CarritoSchema.validate(carrito);
        } catch (error) {
            throw new CustomError(
                STATUS.BAD_REQUEST,
                `El formato del carrito enviado es incorrecto`,
                error
            );
        }
    };

    async createCarritoService(emailUsuario) {
        if (!emailUsuario) {
            throw new CustomError(
                STATUS.BAD_REQUEST,
                `El parámetro 'emailUsuario' es requerido`
            );
        }

        const carrito = {
            emailUsuario,
            productos: []
        }
        const newCarrito = await CarritoServices.#validateCarrito(carrito);
        const resultado = await carritoDao.save(newCarrito);
    
        if (resultado === -1) {
            throw new CustomError(
                STATUS.SERVER_ERROR,
                `Error al agregar carrito`
            );
        }

        return resultado;
    }

    async getCarritosService() {
        const resultado = await carritoDao.getAll();

        if (resultado === -1) {
            throw new CustomError(
                STATUS.SERVER_ERROR,
                `Hubo un error al buscar todos los carritos`
            );
        }
        if (resultado.length === 0) {
            throw new CustomError(
                STATUS.NOT_FOUND,
                `No se encontraron carritos`
            );
        }

        return resultado;
    }

    async getCarritoByIdService(id) {
        if (!id) {
            throw new CustomError(
                STATUS.BAD_REQUEST,
                `El parámetro 'id' es requerido`
            );
        }

        const resultado = await carritoDao.getById(id);

        if (resultado === -1) {
            throw new CustomError(
                STATUS.SERVER_ERROR,
                `Hubo un error al buscar el carrito con id ${id}`
            );
        }
        if (resultado === null) {
            throw new CustomError(
                STATUS.NOT_FOUND,
                `No se encontró el carrito con id ${id}`
            );
        }

        return resultado;
    }

    async deleteCarritoService(id) {
        await this.getCarritoByIdService(id);

        const resultadoEliminacion= await carritoDao.deleteById(id);
    
        if (!resultadoEliminacion) {
            throw new CustomError(
                STATUS.SERVER_ERROR,
                `Error al eliminar carrito`
            );
        }

        return resultadoEliminacion;
    }

    async getProductosByCarritoService(id) {
        const resultadoBusqueda = await this.getCarritoByIdService(id);
        
        return resultadoBusqueda.productos;
    }

    async addProductoCarritoService(idCarrito, idProducto) {
        const resultadoBusquedaCarrito = await this.getCarritoByIdService(idCarrito);

        const resultadoBusquedaProducto = await productosServices.getProductoByIdService(idProducto)
    
        //Agrega producto a carrito
        const resultadoAdd = await carritoDao.addItemToArray('productos', resultadoBusquedaCarrito, resultadoBusquedaProducto);
    
        if (!resultadoAdd) {
            throw new CustomError(
                STATUS.SERVER_ERROR,
                `Error al agregar producto al carrito`
            );
        }

        return resultadoAdd;
    }

    async removeProductoCarritoService(idCarrito, idProducto) {
        const resultadoBusquedaCarrito = await this.getCarritoByIdService(idCarrito);

        const resultadoBusquedaProducto = await productosServices.getProductoByIdService(idProducto)
    
        //Elimina producto de carrito
        const resultadoEliminacion = await carritoDao.removeItemFromArray('productos', resultadoBusquedaCarrito, resultadoBusquedaProducto);
    
        if (resultadoEliminacion === -1) {
            throw new CustomError(
                STATUS.NOT_FOUND,
                `No se encontró el producto con id ${idProducto} dentro del carrito con id ${idCarrito}`
            );
        }
        if (!resultadoEliminacion) {
            throw new CustomError(
                STATUS.SERVER_ERROR,
                `Error al eliminar producto del carrito`
            );
        }
    
        return resultadoEliminacion;
    }
}

module.exports = CarritoServices;