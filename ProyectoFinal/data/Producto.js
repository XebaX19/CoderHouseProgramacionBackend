class Producto {
    constructor(nombre, descripcion, codigo, fotoUrl, precio, stock) {
        this.id = -1;
        this.timestamp = Date.now();
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.codigo;
        this.fotoUrl = fotoUrl;
        this.precio = precio;
        this.stock = stock;
    }
}

module.exports = Producto;