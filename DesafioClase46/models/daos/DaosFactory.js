const yargs = require('yargs')(process.argv.slice(2));

//Obtenemos parámetro recibido por línea de comando
//utilizando librería "yargs"
const args = yargs
  .default({
    PERS: 'mongo'
  })
  .alias({
    s: 'PERS'
  })
  .argv;

const PERS = args.PERS;
console.log(`Persistencia utilizada: ${PERS}`);

let UsuariosDao;
let ProductosDao;

switch (PERS) {
    case 'firebase':
        //UsuariosDao = require('./UsuariosFirebaseDao');
        //ProductosDao = require('./ProductosFirebaseDao');
        throw new Error('Falta implementar persistencia...');
        break;
    case 'mongo':
        UsuariosDao = require('./UsuariosMongooseDao');
        ProductosDao = require('./ProductosMongooseDao');
        break;
    case 'mariadb':
        //UsuariosDao = require('./UsuariosMariaDBDao');
        //ProductosDao = require('./ProductosMariaDBDao');
        throw new Error('Falta implementar persistencia...');
        break;
    case 'sqlite':
        //UsuariosDao = require('./UsuariosSQLiteDao');
        //ProductosDao = require('./ProductosSQLiteDao');
        throw new Error('Falta implementar persistencia...');
        break;
    case 'filesystem':
        //UsuariosDao = require('./UsuariosFileSystemDao');
        //ProductosDao = require('./ProductosFileSystemDao');
        throw new Error('Falta implementar persistencia...');
        break;
    case 'memory':
        //UsuariosDao = require('./UsuariosMemoryDao');
        //ProductosDao = require('./ProductosMemoryDao');
        throw new Error('Falta implementar persistencia...');
        break;
    default:
        throw new Error('Invalid persistent method');
}

module.exports = {
    UsuariosDao,
    ProductosDao
}