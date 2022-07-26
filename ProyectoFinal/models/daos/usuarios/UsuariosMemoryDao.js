const ContenedorMemory = require('../../contenedores/ContenedorMemory');

const arrayUsuarios = [
    {
        "email": "seba.bellesi@gmail.com",
        "password": "$2b$10$IDhLq5yK8V7PRuhDr/XBzOobmx8UBpqNfDgHkwoAHtm1vD/yNn0p2",
        "nombre": "Seba Bellesi",
        "direccion": "Entre rios 988",
        "edad": "34",
        "nroTelefono": "+5493364238488",
        "avatar": "seba.bellesi@gmail.com.png",
        "timestamp": "2022-07-22T03:34:42.239Z",
        "_id": 1
    }
];

class UsuariosMemoryDao extends ContenedorMemory {
    constructor() {
        super(arrayUsuarios);
    }

    async getByEmail(email) {
        const usuarios = await this.getAll();

        let usuarioEncontrado;
        usuarios.forEach(usuario => {
            if (usuario.email === email) {
                usuarioEncontrado = usuario;
            }
        });

        if (!usuarioEncontrado) {
            const errorMessage = `Wrong username or password`;
            throw new Error(errorMessage);
        } else {
            return usuarioEncontrado;
        }
    }
}

module.exports = UsuariosMemoryDao;