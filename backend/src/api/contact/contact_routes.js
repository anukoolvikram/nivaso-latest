import express from 'express';
import nodemailer from 'nodemailer';
const router = express.Router();

router.post('/send-mail', async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS  
      }
    });

    const mailOptions = {
      from: email, 
      to: 'nivaso.biz@gmail.com', 
      subject: subject,
      text: `
        You have a new message:

        Name: ${name}
        Email: ${email}
        Message: ${message}
      `
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
});




export default router;