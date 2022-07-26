const ContenedorSQL = require('../../contenedores/ContenedorSQL');
const dbconfig = require('../../../db/config');

class UsuariosMariadbDao extends ContenedorSQL {
    constructor() {
        super(dbconfig.mariaDB, 'usuarios');
    }

    async getByEmail(email) {
        const document = await this.getByParametro('email', email)

        if (!document) {
            const errorMessage = `Wrong username or password`;
            throw new Error(errorMessage);
        } else {
            return document[0];
        }
    }
}

module.exports = UsuariosMariadbDao;