import express from 'express';
import nodemailer from 'nodemailer';
const router = express.Router();

router.get('/hello', async(req, res)=>{
  res.json({
    message: "hello"
  })
});

router.post('/sendmail', async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS  
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: 'anukoolvikram777@gmail.com', 
      subject: subject || 'No subject',
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
    res.status(500).json({ success: false, message: error.message });
  }
});




export default router;