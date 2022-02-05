class Contenedor {
    constructor(nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
        this.fs = require('fs');
    }
    
    async save(objeto) {
        //Recibe un objeto, lo guarda en el archivo y devuelve el id asignado
        let id = 1;

        try {
            const objetosTxt = await this.fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8');
            let arrayObjetos = [];

            if (objetosTxt.length > 0 && objetosTxt != '[]') {
                arrayObjetos = JSON.parse(objetosTxt);
                id = arrayObjetos[arrayObjetos.length-1].id + 1; 
            }

            objeto.id = id;
            arrayObjetos.push(objeto);
            await this.fs.promises.writeFile(`./${this.nombreArchivo}`, JSON.stringify(arrayObjetos, null, 2));
        
        } catch (err) {
            console.log(`Hubo un error al guardar: ${err.message}`);
        }
        
        return id;
    }

    async getById(id) {
        //Recibe un id y devuelve el objeto con ese id o null si no está
        let objeto = null;

        try {
            const objetosTxt = await this.fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8');
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
            console.log(`Hubo un error al obtener producto: ${err.message}`);
        }

        return objeto;
    }

    async getAll() {
        //Devuelve un array con los objetos presentes en el archivo
        let arrayObjetos = [];

        try {
            const objetosTxt = await this.fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8');
    
            if (objetosTxt.length > 0 && objetosTxt != '[]') {
                arrayObjetos = JSON.parse(objetosTxt);
            }
        } catch (err) {
            console.log(`Hubo un error al obtener todos los productos: ${err.message}`);
        }

        return arrayObjetos;
    }

    async deleteById(id) {
        //Elimina del archivo el objeto con el id buscado
        try {
            const objetosTxt = await this.fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8');
            let arrayObjetos = [];
            let eliminado = false;
    
            if (objetosTxt.length > 0 && objetosTxt != '[]') {
                arrayObjetos = JSON.parse(objetosTxt);
    
                for (let i = 0; i < arrayObjetos.length; i++) {
                    if (arrayObjetos[i].id == id) {
                        arrayObjetos.splice(i, 1);
                        await this.fs.promises.writeFile(`./${this.nombreArchivo}`, JSON.stringify(arrayObjetos, null, 2));
                        eliminado = true;
                    }
                }
            }

            if (eliminado) {
                console.log(`El producto con id ${id} fue eliminado`);
            } else {
                console.log(`No se encontró el producto a eliminar con id ${id}`);
            }
            
        } catch (err) {
            console.log(`Hubo un error al eliminar el producto: ${err.message}`);
        }
    }

    async deleteAll() {
        //Elimina todos los objetos presentes en el archivo
        try {
            await this.fs.promises.writeFile(`./${this.nombreArchivo}`, '');
            console.log('Los productos fueron eliminados');
        } catch (err) {
            console.log(`Hubo un error al eliminar todos los producto: ${err.message}`);
        }
    }
}

module.exports = {
    Contenedor: Contenedor
}