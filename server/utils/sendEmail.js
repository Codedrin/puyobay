import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); 
const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: options.email, 
      subject: options.subject,
      text: options.message, 
    };


    const info = await transporter.sendMail(mailOptions);

  } catch (error) {
    console.error('Error sending email:', error);
  }
};


export default sendEmail;
