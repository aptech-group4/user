
import { EmailService } from "./email-service";

export class EmailController {

    public emailService: EmailService

    constructor(emailService: EmailService) {
        this.emailService = emailService;
    }
    async sendEmail(to: string, subject: string, body: string) {
        try {
            await this.sendEmail(to, subject, body)
        } catch (error) {
            throw error
        }
    }

}