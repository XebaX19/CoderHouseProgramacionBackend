class UsuariosDto {
    constructor(datos) {
        this.id = datos._id;
        this.email = datos.email;
        this.password = datos.password;
        this.createdAt = datos.createdAt;
    }
}

module.exports = UsuariosDto;