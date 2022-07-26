const ContenedorSQL = require('../../contenedores/ContenedorSQL');
const dbconfig = require('../../../db/config');

class MensajesSqliteDao extends ContenedorSQL {
    constructor() {
        super(dbconfig.sqlite, 'mensajes');
    }
}

module.exports = MensajesSqliteDao;