const ContenedorFirebase = require('../../contenedores/ContenedorFirebase');

class UsuariosFirebaseDao extends ContenedorFirebase {
    constructor() {
        super('usuarios');
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

module.exports = UsuariosFirebaseDao;