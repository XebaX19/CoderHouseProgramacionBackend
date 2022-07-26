class CarritoDTO {
    constructor(carritoItem, _id) {
        Object.assign(this, carritoItem);
        this.createdAt = carritoItem.createdAt || Date.now();
        this.updatedAt = Date.now();

        if (_id) {
            this._id = _id;
        }
    }
};

module.exports = CarritoDTO;