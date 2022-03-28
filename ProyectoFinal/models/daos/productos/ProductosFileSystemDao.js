const ContenedorFileSystem = require('../../contenedores/ContenedorFileSystem');

class ProductosFileSystemDao extends ContenedorFileSystem {
    constructor(nombre, descripcion, codigo, fotoUrl, precio, stock) {
        super('productos.txt');
        this.id = -1;
        this.timestamp = Date.now();
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.codigo = codigo;
        this.fotoUrl = fotoUrl;
        this.precio = precio;
        this.stock = stock;
    }
}

module.exports = ProductosFileSystemDao;