const nodemailer = require("nodemailer");
const emailKeys = require(__dirname + "/../config/keys.js").email;

async function sendMail(receiver, subject, body) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailKeys.user,
        pass: emailKeys.password // naturally, replace both with your real credentials or an application-specific password
      }
    });
    const mailOptions = {
      from: emailKeys.user,
      to: receiver,
      subject,
      html: body
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error.message);
        resolve(false);
      } else {
        console.log("Email sent: " + info.response);
        resolve(true);
      }
    });
  });
}

module.exports = sendMail;
