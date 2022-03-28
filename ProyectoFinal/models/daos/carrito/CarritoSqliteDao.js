const ContenedorSQL = require('../../contenedores/ContenedorSQL');
const dbconfig = require('../../../db/sql/config');

class CarritoSqliteDao extends ContenedorSQL {
    constructor() {
        super(dbconfig.sqlite, 'carritos');
    }
}

module.exports = CarritoSqliteDao;