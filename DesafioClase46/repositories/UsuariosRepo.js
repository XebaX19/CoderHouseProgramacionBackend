const { UsuariosDao } = require('../models/daos/DaosFactory');

class UsuariosRepo {
    constructor() {
        this.usuariosDao = new UsuariosDao();
        this.getAllUsuariosRepo = this.getAllUsuariosRepo.bind(this); 
        this.getUsuarioByIdRepo = this.getUsuarioByIdRepo.bind(this); 
        this.saveUsuarioRepo = this.saveUsuarioRepo.bind(this); 
        this.updateUsuarioByIdRepo = this.updateUsuarioByIdRepo.bind(this);
        this.deleteUsuarioByIdRepo = this.deleteUsuarioByIdRepo.bind(this);
    }

    async getAllUsuariosRepo() {
        return await this.usuariosDao.getAll();
    }

    async getUsuarioByIdRepo(id) {
        return await this.usuariosDao.getById(id);
    }

    async saveUsuarioRepo(usuario) {
        return await this.usuariosDao.save(usuario);
    }

    async updateUsuarioByIdRepo(id, usuario) {
        return await this.usuariosDao.update(id, usuario);
    }

    async deleteUsuarioByIdRepo(id) {
        return await this.usuariosDao.deleteById(id);
    }
}

module.exports = UsuariosRepo;