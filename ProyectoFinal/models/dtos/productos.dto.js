class ProductosDTO {
    constructor(productoItem, _id) {
        Object.assign(this, productoItem);
        this.createdAt = productoItem.createdAt || Date.now();
        this.updatedAt = Date.now();

        if (_id) {
            this._id = _id;
        }
    }
};

module.exports = ProductosDTO;