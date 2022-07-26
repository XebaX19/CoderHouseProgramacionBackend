const env = require('../../config/env.config');

let ProductosDao;
let CarritoDao;
let UsuariosDao;
let MensajesDao;
let OrdenesDao;

switch (env.PERS) {
    case 'firebase':
        ProductosDao = require('./productos/ProductosFirebaseDao');
        CarritoDao = require('./carrito/CarritoFirebaseDao');
        UsuariosDao = require('./usuarios/UsuariosFirebaseDao');
        MensajesDao = require('./mensajes/MensajesFirebaseDao');
        OrdenesDao = require('./ordenes/OrdenesFirebaseDao');
        break;
    case 'mongo':
        ProductosDao = require('./productos/ProductosMongooseDao');
        CarritoDao = require('./carrito/CarritoMongooseDao');
        UsuariosDao = require('./usuarios/UsuariosMongooseDao');
        MensajesDao = require('./mensajes/MensajesMongooseDao');
        OrdenesDao = require('./ordenes/OrdenesMongooseDao');
        break;
    case 'mariadb':
        ProductosDao = require('./productos/ProductosMariadbDao');
        CarritoDao = require('./carrito/CarritoMariadbDao');
        UsuariosDao = require('./usuarios/UsuariosMariadbDao');
        MensajesDao = require('./mensajes/MensajesMariadbDao');
        OrdenesDao = require('./ordenes/OrdenesMariadbDao');
        break;
    case 'sqlite':
        ProductosDao = require('./productos/ProductosSqliteDao');
        CarritoDao = require('./carrito/CarritoSqliteDao');
        UsuariosDao = require('./usuarios/UsuariosSqliteDao');
        MensajesDao = require('./mensajes/MensajesSqliteDao');
        OrdenesDao = require('./ordenes/OrdenesSqliteDao');
        break;
    case 'filesystem':
        ProductosDao = require('./productos/ProductosFileSystemDao');
        CarritoDao = require('./carrito/CarritoFileSystemDao');
        UsuariosDao = require('./usuarios/UsuariosFileSystemDao');
        MensajesDao = require('./mensajes/MensajesFileSystemDao');
        OrdenesDao = require('./ordenes/OrdenesFileSystemDao');
        break;
    case 'memory':
        ProductosDao = require('./productos/ProductosMemoryDao');
        CarritoDao = require('./carrito/CarritoMemoryDao');
        UsuariosDao = require('./usuarios/UsuariosMemoryDao');
        MensajesDao = require('./mensajes/MensajesMemoryDao');
        OrdenesDao = require('./ordenes/OrdenesMemoryDao');
        break;
    default:
        throw new Error('Invalid persistent method');
}

module.exports = {
    ProductosDao,
    CarritoDao,
    UsuariosDao,
    MensajesDao,
    OrdenesDao
}