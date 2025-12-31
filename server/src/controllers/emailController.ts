import { Request, Response } from "express";
import nodemailer from "nodemailer";
import pool from "../db";
import { generateToken } from '../utils/tokenUtils'; 


export const sendEmail = async (req: Request, res: Response) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_SENDER,
            pass: process.env.EMAIL_APP_PASSWORD,
        }
    });
    
    try {
        const { emailAddress, generatedPDF, PDFName } = req.body;

        const patientDetails = PDFName.split("Response")[1]

        const mailOptions = {
            from: "MINI-Q Tool <miniq.service@gmail.com>",
            to: emailAddress,
            subject: `MINI-Q Response:${patientDetails}`,
            html: '<p>Kia ora,<br><br>A MINI-Q response (attached below) has been sent to you from the MINI-Q tool.<br><br>'+ 
            'If you did not send the response to your email address via the tool or have not been informed ' +
            'about receiving a response, please delete this email.<br><br><i>Note: Do not reply to this email. This email address is not monitored.</i></p>',
            attachments: [
                {
                    filename: `${PDFName.trim()}.pdf`,
                    path: generatedPDF
                }
            ]
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {           
                console.log("Error in sending email");       
                return res.status(500).json({ error: info });
            } else {
                res.status(200).json({ message: "Successfly sent email." });
            }
        });
        
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const sendInvitationEmail = async (req: Request, res: Response) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_SENDER,
            pass: process.env.EMAIL_APP_PASSWORD,
        }
    });

    try {
        const { email, name, isAdminStatus } = req.body;

        const isAdmin = Boolean(isAdminStatus);


        if (!email || !name) {
            return res.status(400).json({ error: "Name and email address are required." });
        }

        const token = generateToken();

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 30 * 24);  // the token will expire in a month

        await pool.query(
            "INSERT INTO invitations (name, email, token, expires_at, used, is_admin) VALUES ($1, $2, $3, $4, $5, $6)",
            [name, email, token, expiresAt, false, isAdmin] 
          );

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'; // URL is website deployment link or just localhost

        const mailOptions = {
            from: "MINI-Q Tool <miniq.service@gmail.com>",
            to: email,
            subject: "You are invited to register as a clinician",
            html: `<p>Kia ora ${name},<br><br>You have been invited to register as a clinician in the MINI-Q Tool.<br>
            ${isAdmin ? "<p><strong>You have been granted admin privileges.</strong></p>" : ""}
                Please click the link below to complete your registration:<br><br>
                <a href="${frontendUrl}/register?token=${token}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}">Register</a><br><br>
                If you did not request this invitation, please delete this email.<br><br>
                <i>Note: Do not reply to this email. This email address is not monitored.</i></p>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Error in sending email:", error);
                return res.status(500).json({ error: error.message });
            } else {
                res.status(200).json({ message: "Invitation email successfully sent." });
            }
        });

    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

