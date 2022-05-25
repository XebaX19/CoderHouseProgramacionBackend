const ContenedorSQL = require('../../contenedores/ContenedorSQL');
const dbconfig = require('../../../db/config');

class ProductosMariadbDao extends ContenedorSQL {
    constructor() {
        super(dbconfig.mariaDB, 'productos');
    }
}

module.exports = ProductosMariadbDao;