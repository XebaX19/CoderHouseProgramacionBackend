const logger = require('../../logger/index');

class ContenedorMemory {
    constructor(array) {
        this.list = array;
    }

    async save(objeto) {
        //Recibe un objeto, lo guarda en el archivo y devuelve el item creado
        let id = 0;
        if(this.list.length > 0) {
            id = this.list[this.list.length -1].id;
        }

        try {
            objeto.timestamp = new Date();
            objeto.id = id+1;
            this.list.push(objeto);
        } catch (err) {
            logger.error(`Hubo un error al guardar: ${err.message}`);
            return -1;
        }

        return objeto;
    }

    async update(id, objeto) {
        //Recibe un id y objeto, lo busca en el archivo, actualiza y devuelve el item actualizado
        objeto.timestamp = new Date();
        objeto.id = +id;

        try {
            const itemIndex = this.list.findIndex(item => item.id === +id);
            if (itemIndex === -1) {
                return -1;
            }

            this.list[itemIndex] = objeto;
        } catch (err) {
            logger.error(`Hubo un error al modificar: ${err.message}`);
            return -1;
        }

        return objeto;
    }

    async getById(id) {
        //Recibe un id y devuelve el objeto con ese id o null si no está
        let objeto = null;

        try {
            const itemIndex = this.list.findIndex(item => item.id === +id);
            if (itemIndex === -1) {
                return objeto;
            }

            objeto = this.list[itemIndex];
        } catch (err) {
            logger.error(`Hubo un error al obtener el objeto: ${err.message}`);
            return -1;
        }

        return objeto;
    }

    async getAll() {
        //Devuelve un array con los objetos presentes en el archivo
        let arrayObjetos = [];

        try {
            if (this.list.length > 0) {
                arrayObjetos = this.list;
            }
        } catch (err) {
            logger.error(`Hubo un error al obtener todos los objetos: ${err.message}`);
            return -1;
        }

        return arrayObjetos;
    }

    async deleteById(id) {
        //Elimina del archivo el objeto con el id buscado

        try {
            const itemIndex = this.list.findIndex(item => item.id === +id);
            if (itemIndex === -1) {
                return false;
            }

            this.list.splice(itemIndex, 1);
        } catch (err) {
            logger.error(`Hubo un error al eliminar el objeto: ${err.message}`);
            return false;
        }

        return true;
    }

    async addItemToArray(nombreArray, objeto, item) {
        //Agrega item a un array del objeto, devuelve true/false si el item fue agregado o no

        try {
            objeto[nombreArray].push(item);

            const itemIndex = this.list.findIndex(elemento => elemento.id === objeto.id);
            if (itemIndex === -1) {
                return -1;
            }

            this.list[itemIndex] = objeto;
        } catch (err) {
            logger.error(`Hubo un error al agregar el item al array: ${err.message}`);
            return false;
        }

        return true;
    }

    async removeItemFromArray(nombreArray, objeto, item) {
        //Elimina item de un array del objeto, devuelve true/false si el item fue eliminado o no
        //Si no existe el item en el array devuelve -1
        
        try {

            const itemIndexEliminar = objeto[nombreArray].findIndex(elemento => elemento.id === item.id);
            if (itemIndexEliminar === -1) {
                return -1;
            }
            objeto[nombreArray].splice(itemIndexEliminar, 1);

            const itemIndex = this.list.findIndex(elemento => elemento.id === objeto.id);
            this.list[itemIndex] = objeto;
        } catch (err) {
            logger.error(`Hubo un error al eliminar el item del array: ${err.message}`);
            return false;
        }

        return true;
    }
}

module.exports = ContenedorMemory;