
import nodemailer from "nodemailer"


const sendMail = async(toAddress: string,subject:string, message: string) => {

    var transport = nodemailer.createTransport({
        host:  process.env.SMTP_HOST,
        port: 2525,
        auth: {
          user:  process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        }
    });
    
    const mailOptions = {
        from:  process.env.SMTP_FROM_EMAIL,
        to: toAddress,
        subject,
        text:message
    };
   await  transport.sendMail(mailOptions)
}

export default sendMail