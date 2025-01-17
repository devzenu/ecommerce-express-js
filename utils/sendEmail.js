import nodemailer from "nodemailer";
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    // service: process.env.SMPT_SERVICE,
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    // secure: false, // true for 465, false for others
    auth: {
      user: process.env.SMPT_USER,
      pass: process.env.SMPT_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.SMPT_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
