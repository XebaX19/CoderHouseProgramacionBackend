const env = require('../../config/env.config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { UsuariosDao } = require('../../models/daos/daos.factory');
const usuariosDao = new UsuariosDao();
const { STATUS } = require('../../utils/constants/api.constants');
const CustomError = require('../../utils/errors/customError');

class TokenServices {
    async getTokenService(usuario, password) {
        if (!usuario) {
            throw new CustomError(
                STATUS.BAD_REQUEST,
                `El parámetro 'usuario' es requerido`
            );
        }
        if (!password) {
            throw new CustomError(
                STATUS.BAD_REQUEST,
                `El parámetro 'password' es requerido`
            );
        }

        let user;
        try {
            user = await usuariosDao.getByEmail(usuario); 
        } catch (error) {
            throw new CustomError(
                STATUS.BAD_REQUEST,
                `Usuario y/o password inválido`
            );
        }
        
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            throw new CustomError(
                STATUS.BAD_REQUEST,
                `Usuario y/o password inválido`
            );
        }

        const access_token = jwt.sign({ data: user }, env.JWT_PRIVATE_KEY, { expiresIn: '10m' })
        
        return access_token;
    }
}

module.exports = TokenServices;