const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //mailtrap.io
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: '"Ryan Arqueza 👻" <kakqwezxc@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: '<b>Hello world?</b>', // html body
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
