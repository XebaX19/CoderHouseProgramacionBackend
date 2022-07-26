class MensajesDTO {
    constructor(mensajeItem, _id) {
        Object.assign(this, mensajeItem);
        this.createdAt = mensajeItem.createdAt || Date.now();

        if (_id) {
            this._id = _id;
        }
    }
};

module.exports = MensajesDTO;