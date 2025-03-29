import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class EmailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === "true", // Use TLS if true
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendEmail(to, subject, htmlContent) {
        try {
            const mailOptions = {
                from: process.env.SMTP_FROM,
                to: to,
                subject: subject,
                html: htmlContent
            };
    
            await this.transporter.sendMail(mailOptions);
            return { success: true };
        } 
        catch (error) {
            console.error("Email sending error:", error);
            throw new Error("Failed to send email.");
        }
    }

    async sendVerificationEmail(to, verificationLink) {
        const emailSubject = "Email Verification";
        // Read the HTML template
        const templatePath = path.join(__dirname, '../templates', 'verification_email.html');
        let emailContent = fs.readFileSync(templatePath, 'utf8');

        // Inject the verification link into the HTML template
        emailContent = emailContent.replace('{{VERIFICATION_URL}}', verificationLink);
        return await this.sendEmail(to, emailSubject, emailContent);
    }
}

export default EmailService;