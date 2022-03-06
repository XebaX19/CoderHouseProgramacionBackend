class Carrito {
    constructor(productos) {
        this.id = -1;
        this.timestamp = Date.now();
        this.productos = productos;
    }
}

module.exports = Carrito;