const { ENV: { PERS } } = require('../../config');

let ProductosDao;
let CarritoDao;

switch (PERS) {
    case 'firebase':
        ProductosDao = require('../daos/productos/ProductosFirebaseDao');
        CarritoDao = require('./carrito/CarritoFirebaseDao');
        break;
    case 'mongo':
        ProductosDao = require('../daos/productos/ProductosMongooseDao');
        CarritoDao = require('../daos/carrito/CarritoMongooseDao');
        break;
    case 'mariadb':
        ProductosDao = require('../daos/productos/ProductosMariadbDao');
        CarritoDao = require('../daos/carrito/CarritoMariadbDao');
        break;
    case 'sqlite':
        ProductosDao = require('../daos/productos/ProductosSqliteDao');
        CarritoDao = require('../daos/carrito/CarritoSqliteDao');
        break;
    case 'filesystem':
        ProductosDao = require('../daos/productos/ProductosFileSystemDao');
        CarritoDao = require('../daos/carrito/CarritoFileSystemDao');
        break;
    case 'memory':
        ProductosDao = require('../daos/productos/ProductosMemoryDao');
        CarritoDao = require('../daos/carrito/CarritoMemoryDao');
        break;
    default:
        throw new Error('Invalid persistent method');
}

module.exports = {
    ProductosDao,
    CarritoDao
}