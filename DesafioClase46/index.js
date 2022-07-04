//Importamos librerías
const path = require('path');
const dbConfig = require('./db/config');
//const { generateRandomArrayProducts } = require('./utils/faker');
const env = require('./env.config');
const yargs = require('yargs')(process.argv.slice(2));
const os = require('os');
const cluster = require('cluster');
const logger = require('./logger/index');

//Obtenemos parámetro recibido por línea de comando
//utilizando librería "yargs"
const args = yargs
  .default({
    PORT: 8080,
    MODE: 'FORK'
  })
  .alias({
    p: 'PORT',
    m: 'MODE'
  })
  .argv;

const PORT = args.PORT;
const MODE = args.MODE;
const CPU_NUMBERS = os.cpus().length;

if (MODE === 'CLUSTER' && cluster.isPrimary) {
  console.log(`I am the primary process with pid ${process.pid}!`);
  const WORK_NUMBERS = os.cpus().length;
  console.log(`Cores number => ${CPU_NUMBERS}`);

  for (let i = 0; i < WORK_NUMBERS; i++) {
    cluster.fork(); //para crear un proceso secundario
  }

  //Escuchamos cuando se detiene algún proceso y volvemos a levantar uno nuevo para seguir con 1 subproceso por núcleo
  cluster.on('exit', (worker, code) => {
    console.log(`Worker ${worker.process.pid} died :(`)
    cluster.fork();
  });
}

if (!cluster.isPrimary || MODE === 'FORK') {
  const Koa = require('koa');
  const KoaBody = require('koa-body');

  const app = new Koa();
  // const nombreArchivo = "mensajesNuevoFormato.txt";

  //Middlewares
  app.use(KoaBody());

  //Importamos index del router
  const apiRoutes = require('./routers/app.routes')

  // Routes
  app.use(apiRoutes.routes());

  //Creamos escuchador
  const connectedServer = app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
  });

  //Definimos manejo de errores
  connectedServer.on('error', (error) => {
    console.error('Error: ', error);
  });
}