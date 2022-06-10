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

switch (PERS) {
    case 'firebase':
        //UsuariosDao = require('./UsuariosFirebaseDao');
        throw new Error('Falta implementar persistencia...');
        break;
    case 'mongo':
        UsuariosDao = require('./UsuariosMongooseDao');
        break;
    case 'mariadb':
        //UsuariosDao = require('./UsuariosMariaDBDao');
        throw new Error('Falta implementar persistencia...');
        break;
    case 'sqlite':
        //UsuariosDao = require('./UsuariosSQLiteDao');
        throw new Error('Falta implementar persistencia...');
        break;
    case 'filesystem':
        //UsuariosDao = require('./UsuariosFileSystemDao');
        throw new Error('Falta implementar persistencia...');
        break;
    case 'memory':
        //UsuariosDao = require('./UsuariosMemoryDao');
        throw new Error('Falta implementar persistencia...');
        break;
    default:
        throw new Error('Invalid persistent method');
}

module.exports = {
    UsuariosDao
}