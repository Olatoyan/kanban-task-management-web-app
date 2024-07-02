import nodemailer from "nodemailer";

export async function sendEmail({
  email,
  subject,
  message,
}: {
  email: string;
  subject: string;
  message: string;
}) {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: "George Olatoyan <golatoyan@gmail.com>",
    to: email,
    subject: subject,
    html: message,
  };

  // 3) Send the email
  await transporter.sendMail(mailOptions);
}
