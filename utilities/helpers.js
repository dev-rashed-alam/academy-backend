const nodemailer = require("nodemailer");

const sendMail = async (to, subject, body) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_TRANSPORT_USER,
        pass: process.env.MAIL_TRANSPORT_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: to,
      subject: subject,
      html: body,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Message sent: ${info.messageId}`);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
  }
};

const allowedFileTypes = {
  thumbnail: ["image/jpeg", "image/jpg", "image/png"],
  videos: [
    "video/x-flv",
    "video/mp4",
    "application/x-mpegURL",
    "video/MP2T",
    "video/3gpp",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-ms-wmv",
  ],
  materials: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ],
};

const removeEmptyValues = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined || obj[key] === "") {
      delete obj[key];
    }
  });
  return obj;
};

const numberToBase64 = (num) => {
  let base64Chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let base64String = "";
  do {
    let remainder = num % 64;
    base64String = base64Chars[remainder] + base64String;
    num = Math.floor(num / 64);
  } while (num > 0);
  return base64String;
};

const base64ToNumber = (base64String) => {
  let base64Chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let num = 0;
  for (const element of base64String) {
    let charValue = base64Chars.indexOf(element);
    num = num * 64 + charValue;
  }
  return num;
};

const generateResetToken = (sixDigitNumber) => {
  return sixDigitNumber.toString().split("").reverse().join("");
};

const generateSixDigitRandomNumber = () => {
  return Math.floor(Math.random() * 900000) + 100000;
};

const regenerateSixDigitNumberFromToken = (token) => {
  return parseInt(token.toString().split("").reverse().join(""));
};

module.exports = {
  allowedFileTypes,
  removeEmptyValues,
  generateResetToken,
  generateSixDigitRandomNumber,
  regenerateSixDigitNumberFromToken,
  sendMail,
  numberToBase64,
  base64ToNumber,
};
