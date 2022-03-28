const ContenedorSQL = require('../../contenedores/ContenedorSQL');
const dbconfig = require('../../../db/sql/config');

class ProductosMariadbDao extends ContenedorSQL {
    constructor() {
        super(dbconfig.mariaDB, 'productos');
    }
}

module.exports = ProductosMariadbDao;