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

exports.sendEthEmail = async (subject = '', htmlText = '', receiver) => {
  try {
    await ethTransport.sendMail({
      from: 'administration@product.com',
      to: receiver,
      subject: subject,

      html: htmlText,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.signUpEmail = async (newUser) => {
  try {
    const htmlText = `<h1>Un nuevo usuario se ha registrado.</h1>
    <h2>Debajo se encuentra su informacion de registro</h2>
    ${newUser}`;
    await ethTransport.sendMail({
      from: 'administration@product.com',
      to: MAILING.ADMIN_EMAIL,
      subject: 'Nuevo registro',
      html: htmlText,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.sendGmailEmail = async (
  subject = '',
  bodyText = '',
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

exports.sendSms = async (
  sender = '',
  msg = `${sender} necesita un administrador en la sala de chat`
) => {
  try {
    await twilioClient.messages.create({
      from: TWILIO.NUMBER,
      to: TWILIO.ADMIN_NUMBER,
      body: `${msg}`,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.notifyPurchase = async (user, productList) => {
  try {
    console.log(productList);
    htmlText =
      '<h2> Estamos preparando su pedido con los siguientes productos</h2>';
    productList.forEach((el) => {
      console.log(el);
      htmlText = htmlText + `<li>${el}</li>`;
    });
    console.log(htmlText);
    await this.sendEthEmail(
      `Nuevo pedido de ${user.email}`,
      htmlText,
      MAILING.ADMIN_EMAIL
    );
    await this.sendSms('', `${user.email} estamos preparando su pedido`);
    return;
  } catch (err) {
    console.log(err);
  }
};
