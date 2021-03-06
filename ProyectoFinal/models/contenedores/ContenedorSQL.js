const logger = require('../../logger/index');

class ContenedorSQL {
    constructor(configDB, tabla) {
        this.configDB = configDB;
        this.tabla = tabla;
        this.knex = require('knex')(configDB);
    }

    async save(objeto) {
        //Recibe un objeto, lo guarda en la BD y devuelve el item generado
        let newItem = {};

        if (objeto['productos'] != undefined && objeto['productos'].length === 0) {
            delete objeto['productos'];
        }

        try {
            if (this.tabla === 'ordenes') {
                const orden = { 
                    emailUsuario: objeto.emailUsuario, 
                    timestamp: new Date() 
                };

                newItem = await this.knex(this.tabla).insert(orden);
                objeto._id = newItem[0];

                objeto.items.forEach(async item => {
                    const nuevoItem = { 
                        id_orden: objeto._id,
                        id_producto: item.idProducto,
                        descripcion: item.descripcion,
                        precio: item.precio,
                        cantidad: item.cantidad
                    }
                    await this.knex('ordenes_productos').insert(nuevoItem);
                });
            } else {
                newItem = await this.knex(this.tabla).insert(objeto);
                objeto._id = newItem[0];
            }
        } catch (err) {
            logger.error(`Hubo un error al guardar: ${err.message}`);
            return -1;
        }

        return objeto;
    }

    async update(id, objeto) {
        //Recibe un id y objeto, lo actualiza y devuelve el item actualizado

        if (this.tabla === 'carritos') {
            delete objeto['productos'];
        }

        try {
            await this.knex.from(this.tabla).where({ _id: id}).update(objeto);
            objeto._id = id;
        } catch (err) {
            logger.error(`Hubo un error al modificar: ${err.message}`);
            return -1;
        }

        return objeto;
    }

    async getById(id) {
        //Recibe un id y devuelve el objeto con ese id o null si no est??
        let objeto = null;
        let productosId;
        let productos = [];

        try {
            objeto = await this.knex.from(this.tabla).select('*').where('_id', '=', id).first();
            if (objeto === undefined) {
                objeto = null;
            } else {
                if (this.tabla === 'carritos') {
                    productosId = await this.knex.from('carrito_productos').select('id_producto').where('id_carrito', '=', id);
                    if (productosId.length > 0) {

                        productosId = productosId.map(a => a.id_producto);

                        let promise = productosId.map(async elementId => {
                            return await this.knex.from('productos').select('*').where('_id', '=', elementId).first();
                        });

                        productos = await Promise.all(promise);
                    }
    
                    objeto.productos = productos;
                }
            }
        } catch (err) {
            logger.error(`Hubo un error al obtener el item: ${err.message}`);
            return -1;
        }

        return objeto;
    }

    async getByParametro(parametro, valor) {
        //Devuelve un array con los objetos presentes en la BD
        let arrayObjetos = [];

        try {
            arrayObjetos = await this.knex.from(this.tabla).select('*').where(parametro, '=', valor);
        } catch (err) {
            logger.error(`Hubo un error al obtener todos los items: ${err.message}`);
            return -1;
        }

        return arrayObjetos;
    }

    async getAll() {
        //Devuelve un array con los objetos presentes en la BD
        let arrayObjetos = [];

        try {
            arrayObjetos = await this.knex.from(this.tabla).select('*');
        } catch (err) {
            logger.error(`Hubo un error al obtener todos los items: ${err.message}`);
            return -1;
        }

        return arrayObjetos;
    }

    async deleteById(id) {
        //Elimina del archivo el objeto con el id buscado

        try {
            await this.knex.from(this.tabla).where({_id: id}).del();
        } catch (err) {
            logger.error(`Hubo un error al eliminar: ${err.message}`);
            return false;
        }

        return true;
    }

    async addItemToArray(nombreArray, objeto, item) {
        //Agrega item a un array del objeto, devuelve true/false si el item fue agregado o no
        let resultado = false;
        try {
            if (nombreArray === 'productos') {
                const newItem = {id_carrito: objeto._id, id_producto: item._id};
                await this.knex('carrito_productos').insert(newItem);
                resultado = true;
            }
        } catch (err) {
            logger.error(`Hubo un error al agregar el item al array: ${err.message}`);
            return false;
        }

        return resultado;
    }

    async removeItemFromArray(nombreArray, objeto, item) {
        //Elimina item de un array del objeto, devuelve true/false si el item fue eliminado o no
        //Si no existe el item en el array devuelve -1
        let resultado = false;
        
        try {
            const itemEliminar = await this.knex.from('carrito_productos').select('*').where({id_carrito: objeto._id, id_producto: item._id}).first();
            
            if (itemEliminar === undefined) {
                return -1;
            }

            await this.knex.from('carrito_productos').where({_id: itemEliminar._id}).del();
            resultado = true;
        } catch (err) {
            logger.error(`Hubo un error al eliminar el item del array: ${err.message}`);
            return false;
        }

        return resultado;
    }
}

module.exports = ContenedorSQL;