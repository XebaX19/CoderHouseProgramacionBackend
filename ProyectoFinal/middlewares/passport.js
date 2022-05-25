const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const logger = require('../logger/index');
const { enviarEmail } = require('../utils/envioMails');
const env = require('../env.config');

const { UsuariosMongooseDao } = require('../models/daos/usuarios/UsuariosMongooseDao');
const usuariosDao = new UsuariosMongooseDao();

//Genera un Salt (elemento aleatorio utilizado para hashear)
const salt = () => bcrypt.genSaltSync(10);
//Se crea el hash con el salt creado anteriormente
const createHash = (pass) => bcrypt.hashSync(pass, salt());
//bcrypt encripta la información...luego se compara las cadenas encriptadas para verificar si son iguales o no
const isValidPassword = (user, pass) => bcrypt.compareSync(pass, user.password);

//Passport Local Strategy
//Se declara la siguiente estrategia llamada "login" (es un string que identifica la estrategia, es opcional)
//Tener en cuenta que el "done" es como el next del Middleware, para continuar la ejecución
passport.use('login', new LocalStrategy(async (username, password, done) => {
    try {
        const user = await usuariosDao.getByEmail(username);

        if (!isValidPassword(user, password)) {
            logger.info('Invalid user or password');

            return done(null, false); //el 2do parámetro en false indica que se vaya a la redirección que se indica en el "failureRedirect"
        }

        return done(null, user); //acá Passport almacena el usuario en la session
    } catch (error) {
        logger.error('Error signing in >>> ', error);

        return done(null, false);
    }
}));

//Passport Local Strategy
//Se declara la siguiente estrategia llamada "register" (es un string que identifica la estrategia, es opcional)
passport.use('register', new LocalStrategy({
    passReqToCallback: true,    //con esta propiedad, podemos usar el "req" de la llamada
    },
    async (req, username, password, done) => {
        try {
            const extension = req.file?.mimetype?.split('/')[1];
            const userObject = {
                email: username,
                password: createHash(password),
                nombre: req.body.nombre,
                direccion: req.body.direccion,
                edad: req.body.edad,
                nroTelefono: req.body.nroTelefono,
                avatar: extension != undefined ? `${req.body.username}.${extension}` : undefined
            };

            const user = await usuariosDao.save(userObject);
            if (user === -1) {
                return done(null, false);
            }
            
            logger.info('User registration sucessful!');

            enviarEmail(env.EMAIL_ADMINISTRATOR, 'Nuevo registro', JSON.stringify(userObject, null, 2));
            
            return done(null, user);
        } catch (error) {
            logger.error('Error signing up >>> ', error);

            return done(null, false);
        }
}));

//Serializacion
//1ro Passport serializa el usuario y lo guarda en la session
passport.serializeUser((user, done) => {
    //logger.info('Inside serializer');
    done(null, user._id);
});

//Deserializacion
//2do Passport deserializa el usuario y lo utiliza
passport.deserializeUser(async (id, done) => {
    //logger.info('Inside deserializer');
    const user = await usuariosDao.getById(id);

    done(null, user);
});

module.exports = passport;