const moment = require('moment');

const formatMessage = (email, mensaje) => {
    return {
        email,
        mensaje,
        time: moment().format('DD/MM/YYYY HH:mm:ss') 
    }
};

module.exports = {
    formatMessage
};