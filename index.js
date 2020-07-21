const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config()

const index = express();
index.use(bodyParser.json());
index.use(bodyParser.urlencoded({ extended: true }));
index.use(cors());

index.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Change later to only allow our server
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

const PORT = process.env.PORT || 3030
index.listen(PORT, () => {
    console.log(`\n=== Server listening on port ${PORT} ===\n`)
});

index.get('/api', (req, res) => {
    const messageOfTheDay = process.env.MOTD || 'Hello World!'
    res.send('API Status: Welcome to Jensen Koch\'s Portfolio API')
});

index.post('/api/v1', (req,res) => {
    const data = req.body;
  
  const smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    port: 465,
    auth: {
      user: process.env.USER_NAME,
      pass: process.env.PASS
    }
  });
  
  const mailOptions = {
    from: data.email,
    to: process.env.USER_NAME,
    subject: 'Portfolio Contact Form',
    html: `<p>${data.name}</p>
            <p>${data.email}</p>
            <p>${data.message}</p>`
  };
  
  smtpTransport.sendMail(mailOptions,
  (error, response) => {
    if(error) {
      res.send(error)
    }else {
      res.send('Success')
    }
    smtpTransport.close();
  });
  
  })