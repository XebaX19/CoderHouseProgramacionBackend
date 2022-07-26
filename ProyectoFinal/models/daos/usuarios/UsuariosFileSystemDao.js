const ContenedorFileSystem = require('../../contenedores/ContenedorFileSystem');

class UsuariosFileSystemDao extends ContenedorFileSystem {
    constructor(email, password, nombre, direccion, edad, nroTelefono, avatar) {
        super('usuarios.txt');
        this._id = -1;
        this.email = email;
        this.password = password;
        this.nombre = nombre;
        this.direccion = direccion;
        this.edad = edad;
        this.nroTelefono = nroTelefono;
        this.avatar = avatar;
        this.createdAt = Date.now();
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

module.exports = UsuariosFileSystemDao;