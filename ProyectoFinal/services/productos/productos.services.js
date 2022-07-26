const { ProductosDao } = require('../../models/daos/daos.factory');
const productosDao = new ProductosDao();
const ProductoSchema = require('../../models/schemas/productos.schema');
const { STATUS } = require('../../utils/constants/api.constants');
const CustomError = require('../../utils/errors/customError');

class ProductosServices {
    static async #validateProducto(producto) {
        try {

            return await ProductoSchema.validate(producto);
        } catch (error) {
            throw new CustomError(
                STATUS.BAD_REQUEST,
                `El formato del producto enviado es incorrecto`,
                error
            );
        }
    };

    async getProductosService() {
        const resultado = await productosDao.getAll();

        if (resultado === -1) {
            throw new CustomError(
                STATUS.SERVER_ERROR,
                `Hubo un error al buscar todos los productos`
            );
        }
        if (resultado.length === 0) {
            throw new CustomError(
                STATUS.NOT_FOUND,
                `No se encontraron productos`
            );
        }

        return resultado;
    };

    async getProductoByIdService(id) {
        if (!id) {
            throw new CustomError(
                STATUS.BAD_REQUEST,
                `El parámetro 'id' es requerido`
            );
        }

        const resultado = await productosDao.getById(id);
    
        if (resultado === -1) {
            throw new CustomError(
                STATUS.SERVER_ERROR,
                `Hubo un error al buscar el producto con id ${id}`
            );
        }
        if (resultado === null) {
            throw new CustomError(
                STATUS.NOT_FOUND,
                `No se encontró el producto con id ${id}`
            );
        }
    
        return resultado;
    };

    async getProductosByCategoriaService(categoria) {
        if (!categoria) {
            throw new CustomError(
                STATUS.BAD_REQUEST,
                `El parámetro 'categoria' es requerido`
            );
        }

        const resultado = await productosDao.getByParametro('categoria', categoria);
    
        if (resultado === -1) {
            throw new CustomError(
                STATUS.SERVER_ERROR,
                `Hubo un error al buscar productos con categoria ${categoria}`
            );
        }
        if (resultado === null || resultado.length === 0) {
            throw new CustomError(
                STATUS.NOT_FOUND,
                `No se encontraron productos con categoria ${categoria}`
            );
        }
    
        return resultado;
    };

    async createProductoService(producto) {
        const newProducto = await ProductosServices.#validateProducto(producto);

        const resultado = await productosDao.save(newProducto);
    
        if (resultado === -1) {
            throw new CustomError(
                STATUS.SERVER_ERROR,
                `Error al agregar producto`
            );
        }
        
        return resultado;
    };

    async updateProductoService(id, producto) {
        await this.getProductoByIdService(id);
        const updatedProducto = await ProductosServices.#validateProducto(producto);
    
        const resultadoActualiza = await productosDao.update(id, updatedProducto);
    
        if (resultadoActualiza === -1) {
            throw new CustomError(
                STATUS.SERVER_ERROR,
                `Error al modificar producto`
            );
        }
    
        return resultadoActualiza;
    };

    async deleteProductoService(id) {
        await this.getProductoByIdService(id);
    
        const resultadoEliminacion= await productosDao.deleteById(id);
    
        if (!resultadoEliminacion) {
            throw new CustomError(
                STATUS.SERVER_ERROR,
                `Error al eliminar producto`
            );
        }
    
        return resultadoEliminacion;
    }
}

module.exports = ProductosServices;