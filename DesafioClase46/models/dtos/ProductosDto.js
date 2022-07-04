class ProductosDto {
    constructor(datos) {
        this.id = datos._id;
        this.title = datos.title;
        this.price = datos.price;
        this.thumbnail = datos.thumbnail;
    }
}

module.exports = ProductosDto;