const UsuariosRepo = require('../repositories/UsuariosRepo');

class UsuarioService {
    constructor() {
        this.usuariosRepo = new UsuariosRepo();
    }

    async getAllUsuariosService() {
        return await this.usuariosRepo.getAllUsuariosRepo();
    }

    async getUsuarioByIdService(id) {
        return await this.usuariosRepo.getUsuarioByIdRepo(id);
    }

    async saveUsuarioService(usuario) {
        return await this.usuariosRepo.saveUsuarioRepo(usuario);
    }

    async updateUsuarioByIdService(id, usuario) {
        return await this.usuariosRepo.updateUsuarioByIdRepo(id, usuario);
    }

    async deleteUsuarioByIdService(id) {
        return await this.usuariosRepo.deleteUsuarioByIdRepo(id);
    }
}

module.exports = UsuarioService;