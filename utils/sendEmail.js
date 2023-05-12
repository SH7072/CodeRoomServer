const nodemailer= require("nodemailer");
const sendgridTransport= require("nodemailer-sendgrid-transport");

export const sendEmail=async(to,subject,message)=>{

    const transporter = nodemailer.createTransport(sendgridTransport({
        auth:{
            
            api_key:process.env.SENDGRID_API_KEY
        }
        
    }));
    await transporter.sendMail({
        to:to,
        from:"codeEditor@class.com",
        subject:subject,
        html:message
    });
    
};
