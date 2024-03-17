const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  pool: true,
  service: "hotmail",
  port: 2525,
  auth: {
    user: "himanshuhim1230@outlook.com",
    pass: "Pintuhunmai@1",
  },
  maxConnections: 1,
});

const sendMail = (to, subject, body) => {
  const mailOptions = {
    from: "himanshuhim1230@outlook.com",
    to: to,
    subject: subject,
    html: body,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) return console.log(err);
    console.log(info);
  });
};

module.exports = sendMail;
