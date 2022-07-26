const ContenedorSQL = require('../../contenedores/ContenedorSQL');
const dbconfig = require('../../../db/config');

class MensajesMariadbDao extends ContenedorSQL {
    constructor() {
        super(dbconfig.mariaDB, 'mensajes');
    }
}

module.exports = MensajesMariadbDao;