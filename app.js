const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
const cors=require('cors');
app.use(cors())
const PORT =4000;

//mongoose.connect('mongodb+srv://deepamahesh0794:dKUYxEPt58OuXglE@cluster0.gagjqb1.mongodb.net/', {
 // useNewUrlParser: true,
 /// useUnifiedTopology: true,
//});
//dKUYxEPt58OuXglE
const connectDB = async () => {
  try {
      const connection = await mongoose.connect('mongodb+srv://deepamahesh0794:dKUYxEPt58OuXglE@cluster0.gagjqb1.mongodb.net/')
      console.log("Connected to the mongoDB");
      return connection;

  } catch (error) {
      console.log(error);
  }
}
connectDB();
const EmailModel = mongoose.model('Email', {
  recipients: [String],
  subject: String,
  message: String,
});

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'deepamahesh0794@gmail.com',
    pass: 'gykj tfvp geqo lrua',
  },
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('../email-app-frontend/build'));

app.post('/sendEmail', async (req, res) => {
  const { recipients, subject, message } = req.body;

  const email = new EmailModel({ recipients, subject, message });
  await email.save();

  const mailOptions = {
    from: 'deepamahesh0794@gmail.com',
    to: recipients.join(','),
    subject: subject,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Email not sent');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});