const { getFirestore } = require('firebase-admin/firestore');
const { admin } = require('../../db/firebase/firebase.config');

class ContenedorFirebase {
    constructor(coll) {
        const db = getFirestore();
        this.query = db.collection(coll);
    }

    async save(objeto) {
        //Recibe un objeto, lo guarda en la BD y devuelve el item generado

        try {
            objeto.timestamp = new Date();
            const docRef = this.query.doc();
            await docRef.set(objeto);
            objeto.id = docRef.id;

        } catch (err) {
            console.log(`Hubo un error al guardar: ${err.message}`);
            return -1;
        }

        return objeto;
    }

    async update(id, objeto) {
        //Recibe un id y objeto, lo actualiza y devuelve el item actualizado

        try {
            const docRef = this.query.doc(id);
            await docRef.update(objeto);
            objeto.id = docRef.id;
        } catch (err) {
            console.log(`Hubo un error al modificar: ${err.message}`);
            return -1;
        }

        return objeto;
    }

    async getById(id) {
        //Recibe un id y devuelve el objeto con ese id o null si no está
        let objeto = null;

        try {
            const docRef = this.query.doc(id);
            const document = await docRef.get();
            if (document.data() !== undefined) {
                objeto = document.data();
                objeto.id = docRef.id;
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
            const docRef = await this.query.get();
            const documents = docRef.docs;
            arrayObjetos = documents.map(document => ({ 
              ...document.data(),
              id: document.id
            }));
        } catch (err) {
            console.log(`Hubo un error al obtener todos los items: ${err.message}`);
            return -1;
        }

        return arrayObjetos;
    }

    async deleteById(id) {
        //Elimina del archivo el objeto con el id buscado

        try {
            const docRef = this.query.doc(id);
            await docRef.delete();
        } catch (err) {
            console.log(`Hubo un error al eliminar: ${err.message}`);
            return false;
        }

        return true;
    }

    async addItemToArray(nombreArray, objeto, item) {
        //Agrega item a un array del objeto, devuelve true/false si el item fue agregado o no

        try {
            objeto[nombreArray].push(item);

            const docRef = this.query.doc(objeto.id);
            await docRef.update(objeto);
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

            const itemIndexEliminar = objeto[nombreArray].findIndex(elemento => elemento.id === item.id);
            if (itemIndexEliminar === -1) {
                return -1;
            }
            objeto[nombreArray].splice(itemIndexEliminar, 1);

            const docRef = this.query.doc(objeto.id);
            await docRef.update(objeto);
        } catch (err) {
            console.log(`Hubo un error al eliminar el item del array: ${err.message}`);
            return false;
        }

        return true;
    }
}

module.exports = ContenedorFirebase;