const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const nodemailer = require('nodemailer')
const cors = require('cors')

const app = express()
const port = 5000
// app.use(cors())


dotenv.config();

const corsOptions = {
    origin: process.env.FRONTEND_URL, 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}
app.use(cors(corsOptions))
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

// Define POST route
app.post("/", (req, res) => { // Correctly define the route
    const { name, email, phone, message } = req.body; // Destructure incoming data
    console.log("Data received:", { name, email, phone, message });
    console.log(process.env.SMTP_HOST);
    console.log(process.env.SMTP_PORT);
    console.log(process.env.SMTP_MAIL);
    console.log(process.env.SMTP_PASSWORD);
    
    var mailOptions = {
        from:process.env.SMTP_MAIL,
        to:process.env.SMTP_MAIL,
        replyTo: `${email}`,
        subject:"Contact us form",
        text: `Name: ${name}\nEmail: ${email}\nPhone no. : ${phone}\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.error("Email Error:", error);
            return res.status(500).json({ success: false, message: "Failed to send email", error });
        } else {
            console.log("Email sent successfully:", info.response);
            return res.status(200).json({ success: true, message: "Email sent successfully!" });
        }
    })
    res.status(200).json({
        success: true,
        message: "Data received successfully!",
        data: { name, email, phone, message },
    });
});

app.get("/", (req, res) => {
    res.send("Hello World!")
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
