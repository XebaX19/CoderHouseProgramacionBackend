const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(process.cwd(), `${process.env.NODE_ENV?.trim()}.env`)
});

const {
  NODE_ENV,
  HOST,
  PORT,
  PERS,
  DB_PASSWORD,
  SESSION_SECRET,
  EMAIL_ADMINISTRATOR,
  CEL_ADMINISTRATOR,
  GMAIL_FROM_SEND,
  GMAIL_PASS_APPLICATION,
  TWILIO_ACCOUNT_SID,
  TWILIO_ACCOUNT_TOKEN,
  TWILIO_NUMBER_WHATSAPP,
  TWILIO_NUMBER_SMS,
  JWT_PRIVATE_KEY,
  SESSION_TTL,
  SESSION_MAX_AGE
} = process.env;

module.exports = {
  NODE_ENV: NODE_ENV || 'development',
  HOST: HOST || 'localhost',
  PORT: PORT || 8080,
  PERS: PERS || 'mongo', //memory//filesystem//mongo//firebase//mariadb//sqlite
  DB_PASSWORD,
  SESSION_SECRET,
  EMAIL_ADMINISTRATOR,
  CEL_ADMINISTRATOR,
  GMAIL_FROM_SEND,
  GMAIL_PASS_APPLICATION,
  TWILIO_ACCOUNT_SID,
  TWILIO_ACCOUNT_TOKEN,
  TWILIO_NUMBER_WHATSAPP,
  TWILIO_NUMBER_SMS,
  JWT_PRIVATE_KEY,
  SESSION_TTL,
  SESSION_MAX_AGE
}