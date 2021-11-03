const dotenv = require('dotenv');

dotenv.config();

let PORT, DB_URI, SERVER_URL;
let FB_APP_ID = process.env.FB_APP_ID;
let FB_SECRET = process.env.FB_SECRET;

const MAILING = {
  ETHEREAL_HOST: process.env.ETHEREAL_HOST,
  ETHEREAL_PORT: process.env.ETHEREAL_PASS,
  ETHEREAL_USER: process.env.ETHEREAL_USER,
  ETHEREAL_PASS: process.env.ETHEREAL_PASS,
  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_PASS: process.env.GMAIL_PASS,
};
const TWILIO = {
  ACCOUNT_SID: process.env.TWILIO_SID,
  AUTH_TOKEN: process.env.TWILIO_TOKEN,
  NUMBER: process.env.TWILIO_NUMBER,
  ADMIN_NUMBER: process.env.TWILIO_ADMIN_NUMBER,
};

let SERVER_MODE;
if (process.argv.length > 2) {
  process.argv.forEach((value, index) => {
    const args = value.split('=');
    if (args[0] == 'PORT') PORT = args[1];
    if (args[0] == 'FB_APP_ID') FB_APP_ID = args[1];
    if (args[0] == 'FB_SECRET') FB_SECRET = args[1];
    if (args[0] == 'SERVER_MODE') SERVER_MODE = args[1];
  });
}

if (process.env.ENV == 'development' || !process.env.ENV) {
  PORT = PORT || process.env.PORT_dev || 5000;
  SERVER_URL = `${process.env.SERVER_URL_dev}:${PORT}`;
  DB_URI = process.env.DB_URI_dev || 'mongodb://localhost:27017/ecommerce';
} else if (process.env.ENV == 'production') {
  PORT = PORT || process.env.PORT_prod;
  DB_URI = process.env.DB_URI_prod;
  SERVER_URL = `https://eproducts.herokuapp.com/products`;
}

module.exports = {
  PORT,
  DB_URI,
  SERVER_URL,
  FB_APP_ID,
  FB_SECRET,
  SERVER_MODE,
  MAILING,
  TWILIO,
};
