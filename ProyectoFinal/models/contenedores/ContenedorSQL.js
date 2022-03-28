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
            objeto = {};
        }

        try {
            newItem = await this.knex(this.tabla).insert(objeto);
            objeto.id = newItem[0];
        } catch (err) {
            console.log(`Hubo un error al guardar: ${err.message}`);
            return -1;
        }

        return objeto;
    }

    async update(id, objeto) {
        //Recibe un id y objeto, lo actualiza y devuelve el item actualizado

        try {
            await this.knex.from(this.tabla).where({id}).update(objeto);
            objeto.id = id;
        } catch (err) {
            console.log(`Hubo un error al modificar: ${err.message}`);
            return -1;
        }

        return objeto;
    }

    async getById(id) {
        //Recibe un id y devuelve el objeto con ese id o null si no está
        let objeto = null;
        let productosId;
        let productos = [];

        try {
            objeto = await this.knex.from(this.tabla).select('*').where('id', '=', id).first();
            if (objeto === undefined) {
                objeto = null;
            } else {
                if (this.tabla === 'carritos') {
                    productosId = await this.knex.from('carrito_productos').select('id_producto').where('id_carrito', '=', id);
                    if (productosId.length > 0) {

                        productosId = productosId.map(a => a.id_producto);

                        let promise = productosId.map(async elementId => {
                            return await this.knex.from('productos').select('*').where('id', '=', elementId).first();
                        });

                        productos = await Promise.all(promise);
                    }
    
                    objeto.productos = productos;
                }
            }
        } catch (err) {
            console.log(`Hubo un error al obtener el item: ${err.message}`);
            return -1;
        }

        return objeto;
    }

    async getAll() {
        //Devuelve un array con los objetos presentes en la BD
        let arrayObjetos = [];

        try {
            arrayObjetos = await this.knex.from(this.tabla).select('*');
        } catch (err) {
            console.log(`Hubo un error al obtener todos los items: ${err.message}`);
            return -1;
        }

        return arrayObjetos;
    }

    async deleteById(id) {
        //Elimina del archivo el objeto con el id buscado

        try {
            await this.knex.from(this.tabla).where({id}).del();
        } catch (err) {
            console.log(`Hubo un error al eliminar: ${err.message}`);
            return false;
        }

        return true;
    }

    async addItemToArray(nombreArray, objeto, item) {
        //Agrega item a un array del objeto, devuelve true/false si el item fue agregado o no

        try {
            const newItem = {id_carrito: objeto.id, id_producto: item.id};
            await this.knex('carrito_productos').insert(newItem);
        } catch (err) {
            console.log(`Hubo un error al agregar el item al array: ${err.message}`);
            return false;
        }

        return true;
    }

    async removeItemFromArray(nombreArray, objeto, item) {
        //Elimina item de un array del objeto, devuelve true/false si el item fue eliminado o no
        //Si no existe el item en el array devuelve -1

        try {
            const itemEliminar = await this.knex.from('carrito_productos').select('*').where({id_carrito: objeto.id, id_producto: item.id}).first();
            
            if (itemEliminar === undefined) {
                return -1;
            }

            await this.knex.from('carrito_productos').where({id: itemEliminar.id}).del();
        } catch (err) {
            console.log(`Hubo un error al eliminar el item del array: ${err.message}`);
            return false;
        }

        return true;
    }
}

module.exports = ContenedorSQL;