import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


// Send Email Function
export const sendEmail = async (
    email,
    subject,
    message
) => {

    try {

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: message
        });


        console.log("Email sent successfully");


    } catch (error) {

        console.log(
            "Email sending failed:",
            error.message
        );

    }
};