class Contenedor {
    constructor(nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
        this.fs = require('fs');
    }

    async save(objeto) {
        //Recibe un objeto, lo guarda en el archivo y devuelve el id asignado
        let id = 1;

        try {
            const objetosTxt = await this.fs.promises.readFile(`./data/${this.nombreArchivo}`, 'utf-8');
            let arrayObjetos = [];

            if (objetosTxt.length > 0 && objetosTxt != '[]') {
                arrayObjetos = JSON.parse(objetosTxt);
                id = arrayObjetos[arrayObjetos.length - 1].id + 1;
            }

            objeto.id = id;
            arrayObjetos.push(objeto);
            await this.fs.promises.writeFile(`./data/${this.nombreArchivo}`, JSON.stringify(arrayObjetos, null, 2));

        } catch (err) {
            console.log(`Hubo un error al guardar: ${err.message}`);
            return -1;
        }

        return id;
    }

    async update(objeto) {
        //Recibe un objeto, lo busca en el archivo, actualiza y devuelve un boolean (según si se pudo actualizar o no)

        try {
            const objetosTxt = await this.fs.promises.readFile(`./data/${this.nombreArchivo}`, 'utf-8');
            let arrayObjetos = [];

            if (objetosTxt.length > 0 && objetosTxt != '[]') {
                arrayObjetos = JSON.parse(objetosTxt);

                const productoIndex = arrayObjetos.findIndex(product => product.id === objeto.id);
                arrayObjetos[productoIndex] = objeto;

                await this.fs.promises.writeFile(`./data/${this.nombreArchivo}`, JSON.stringify(arrayObjetos, null, 2));
            }
        } catch (err) {
            console.log(`Hubo un error al modificar: ${err.message}`);
            return false;
        }

        return true;
    }

    async getById(id) {
        //Recibe un id y devuelve el objeto con ese id o null si no está
        let objeto = null;

        try {
            const objetosTxt = await this.fs.promises.readFile(`./data/${this.nombreArchivo}`, 'utf-8');
            let arrayObjetos = [];

            if (objetosTxt.length > 0 && objetosTxt != '[]') {
                arrayObjetos = JSON.parse(objetosTxt);

                for (const obj of arrayObjetos) {
                    if (obj.id == id) {
                        objeto = obj;
                    }
                }
            }
        } catch (err) {
            //Si entra al catch porque no existe el archivo, no muestro error...devuelve array vacío
            //Sólo muestro el error si se debe a otro problema
            if (err.code != 'ENOENT') {
                console.log(`Hubo un error al obtener el producto: ${err.message}`);
            }
        }

        return objeto;
    }

    async getAll() {
        //Devuelve un array con los objetos presentes en el archivo
        let arrayObjetos = [];

        try {
            const objetosTxt = await this.fs.promises.readFile(`./data/${this.nombreArchivo}`, 'utf-8');

            if (objetosTxt.length > 0 && objetosTxt != '[]') {
                arrayObjetos = JSON.parse(objetosTxt);
            }
        } catch (err) {
            //Si entra al catch porque no existe el archivo, no muestro error...devuelve array vacío
            //Sólo muestro el error si se debe a otro problema
            if (err.code != 'ENOENT') {
                console.log(`Hubo un error al obtener todos los productos: ${err.message}`);
            }
        }

        return arrayObjetos;
    }

    async deleteById(id) {
        //Elimina del archivo el objeto con el id buscado
        let eliminado = false;
        
        try {
            const objetosTxt = await this.fs.promises.readFile(`./data/${this.nombreArchivo}`, 'utf-8');
            let arrayObjetos = [];

            if (objetosTxt.length > 0 && objetosTxt != '[]') {
                arrayObjetos = JSON.parse(objetosTxt);

                for (let i = 0; i < arrayObjetos.length; i++) {
                    if (arrayObjetos[i].id == id) {
                        arrayObjetos.splice(i, 1);
                        await this.fs.promises.writeFile(`./data/${this.nombreArchivo}`, JSON.stringify(arrayObjetos, null, 2));
                        eliminado = true;
                    }
                }
            }
        } catch (err) {
            console.log(`Hubo un error al eliminar el producto: ${err.message}`);
        }

        return eliminado;
    }
}

module.exports = Contenedor;