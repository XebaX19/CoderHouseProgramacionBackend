const ContenedorSQL = require('../../contenedores/ContenedorSQL');
const dbconfig = require('../../../db/config');

class UsuariosSqliteDao extends ContenedorSQL {
    constructor() {
        super(dbconfig.sqlite, 'usuarios');
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

module.exports = UsuariosSqliteDao;