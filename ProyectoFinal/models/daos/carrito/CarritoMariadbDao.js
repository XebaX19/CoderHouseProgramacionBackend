const ContenedorSQL = require('../../contenedores/ContenedorSQL');
const dbconfig = require('../../../db/sql/config');

class CarritoMariadbDao extends ContenedorSQL {
    constructor() {
        super(dbconfig.mariaDB, 'carritos');
    }
}

module.exports = CarritoMariadbDao;