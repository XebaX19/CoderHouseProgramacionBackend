const ContenedorSQL = require('../../contenedores/ContenedorSQL');
const dbconfig = require('../../../db/config');

class CarritoSqliteDao extends ContenedorSQL {
    constructor() {
        super(dbconfig.sqlite, 'carritos');
    }
}

module.exports = CarritoSqliteDao;