const twilio = require('twilio');
const env = require('../env.config');
const logger = require('../logger/index');

const twilioClient = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_ACCOUNT_TOKEN);

const enviarSMS = async (destinatario, mensaje) => {
    try {
        const messagePayload = {
            from: env.TWILIO_NUMBER_SMS, //Sacarlo de Twilio
            to: destinatario, //Hacia donde vamos a enviar el msj
            body: mensaje  //Msj a enviar
        };

        const messageResponse = await twilioClient.messages.create(messagePayload);
        //logger.info(messageResponse);
    } catch (error) {
        logger.error(error);
    }
}

module.exports = {
    enviarSMS
};