const nodemailer = require('nodemailer');
const { Twilio } = require('twilio');
/* const twilio = require('twilio'); */

const { MAILING, TWILIO } = require(`${__dirname}/../config/enviroment.js`);
const ethTransport = nodemailer.createTransport({
  host: MAILING.ETHEREAL_HOST,
  port: MAILING.ETHEREAL_PORT,
  auth: {
    user: MAILING.ETHEREAL_USER,
    pass: MAILING.ETHEREAL_PASS,
  },
});

const gmailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MAILING.GMAIL_USER,
    pass: MAILING.GMAIL_PASS,
  },
});

exports.sendEthEmail = async (subject = '', bodyText, htmlText = '') => {
  try {
    await ethTransport.sendMail({
      from: 'administration@product.com',
      to: 'enzo.e.vignolo@gmail.com',
      subject: subject,
      text: bodyText,
      html: htmlText,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.sendGmailEmail = async (
  subject = '',
  bodyText,
  htmlText = '',
  receiver
) => {
  try {
    await gmailTransport.sendMail({
      from: 'administration@product.com',
      to: receiver,
      subject: subject,
      text: bodyText,
      html: htmlText,
    });
  } catch (err) {
    console.log(err);
  }
};

const twilioClient = new Twilio(TWILIO.ACCOUNT_SID, TWILIO.AUTH_TOKEN);

exports.sendSms = async (sender) => {
  try {
    await twilioClient.messages.create({
      from: TWILIO.NUMBER,
      to: TWILIO.ADMIN_NUMBER,
      body: `${sender} necesita un administrador en la sala de chat`,
    });
  } catch (err) {
    console.log(err);
  }
};
