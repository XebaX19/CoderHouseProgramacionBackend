const MensajesRepo = require('../repositories/MensajesRepo');
const mensajesRepo = new MensajesRepo();

const getAllMensajesService = mensajesRepo.getAllMensajesRepo;
const saveMensajeService = mensajesRepo.saveMensajeRepo;

module.exports = {
    getAllMensajesService,
    saveMensajeService
};