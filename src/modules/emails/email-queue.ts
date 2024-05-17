import { createBullBoard } from 'bull-board';
import { BullMQAdapter } from 'bull-board/bullMQAdapter';
import { Queue, Worker } from 'bullmq';
import express from 'express';
import IORedis from 'ioredis';
import { EmailService } from './email-service';

const bullConnection = new IORedis({
    host: '127.0.0.1',
    port: 6379,
    db: 0,
    maxRetriesPerRequest: null
});

export class EmailQueue {
    queue: Queue;
    worker: Worker;
    bullBoardRouter: express.Router;
    private emailService: EmailService;

    constructor() {
        this.queue = new Queue('myqueue', { connection: bullConnection });
        this.emailService = new EmailService();
        this.worker = new Worker('myqueue', this.emailService.sendEmailJob.bind(this.emailService), { connection: bullConnection });

        const { router } = createBullBoard([new BullMQAdapter(this.queue)]);
        this.bullBoardRouter = router;
    }

    async addEmailJob(to: string, subject: string, body: string) {
        return this.queue.add('sendEmail', { to, subject, body });
    }
}
