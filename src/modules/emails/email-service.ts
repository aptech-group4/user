import { emailTransporter } from "./email-transporter";
import { EmailJobData } from './email';
import { Job } from 'bullmq';
import { EmailOption } from "./email-options";
const nodemailer = require('nodemailer');


export class EmailService {

    async sendEmailJob(job: Job<EmailJobData>) {
        try {
            await this.sendEmail(job.data.to, job.data.subject, job.data.body);
        } catch (error) {
            console.error('Error processing email job:', error);
            throw error;
        }
    }
    async sendEmail(to: string, subject: string, body: string) {
        const transporter = nodemailer.createTransport(emailTransporter);
        const mailOptions = await this.setMailOption(to, subject, body)
        try {
            let info = await transporter.sendMail(mailOptions);
            console.log('Email sent:', info.messageId);
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    async setMailOption(to: string, subject: string, body: string) {
        const emailOption = new EmailOption(
            'dev.trungnhan@gmail.com',
            to,
            subject,
            body
        )
        return emailOption
    }
}
