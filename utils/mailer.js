const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendOTPEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"EventClick" <${process.env.MAIL_USER}>`,
    to,
    subject: "Your OTP for Password Reset",
    html: `
      <h2>Reset Your Password</h2>
      <p>Your One-Time Password (OTP) is: <strong>${otp}</strong></p>
      <p>This OTP will expire in <b>5 minutes</b>. Do not share this with anyone.</p>
    `,
  });
};

module.exports = sendOTPEmail;
