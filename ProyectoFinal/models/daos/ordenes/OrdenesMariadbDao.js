const ContenedorSQL = require('../../contenedores/ContenedorSQL');
const dbconfig = require('../../../db/config');

class OrdenesMariadbDao extends ContenedorSQL {
    constructor() {
        super(dbconfig.mariaDB, 'ordenes');
    }
}

module.exports = OrdenesMariadbDao;