const ContenedorSQL = require('../../contenedores/ContenedorSQL');
const dbconfig = require('../../../db/config');

class OrdenesSqliteDao extends ContenedorSQL {
    constructor() {
        super(dbconfig.sqlite, 'ordenes');
    }
}

module.exports = OrdenesSqliteDao;