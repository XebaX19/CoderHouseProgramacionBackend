const nodemailer = require('nodemailer');
const env = require('../env.config');
const logger = require('../logger/index');

const enviarEmail = async (destinatario, asunto, mensaje) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        auth: {
            user: env.GMAIL_FROM_SEND,
            pass: env.GMAIL_PASS_APPLICATION //contraseña de aplicación que se genera desde Google en "Contraseñas de aplicaciones"
        },
        tls: { //Para que no de error de TLS ("Error: self signed certificate in certificate chain")
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: 'Node JS Server', //Remitente del correo
        to: destinatario, //Destinatario del correo
        subject: asunto, //Asunto del correo,
        text: mensaje //Mensaje del correo
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        logger.error(error);
    }
};

module.exports = {
    enviarEmail
};