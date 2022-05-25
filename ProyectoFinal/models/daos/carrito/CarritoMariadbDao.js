const ContenedorSQL = require('../../contenedores/ContenedorSQL');
const dbconfig = require('../../../db/config');

class CarritoMariadbDao extends ContenedorSQL {
    constructor() {
        super(dbconfig.mariaDB, 'carritos');
    }
}

module.exports = CarritoMariadbDao;