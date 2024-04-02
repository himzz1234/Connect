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

const sendMail = async (to, subject, body) => {
  const mailOptions = {
    from: "himanshuhim1230@outlook.com",
    to: to,
    subject: subject,
    html: body,
  };

  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
};

module.exports = sendMail;
