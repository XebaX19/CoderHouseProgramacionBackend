const ContenedorSQL = require('../../contenedores/ContenedorSQL');
const dbconfig = require('../../../db/sql/config');

class ProductosSqliteDao extends ContenedorSQL {
    constructor() {
        super(dbconfig.sqlite, 'productos');
    }
}

module.exports = ProductosSqliteDao;