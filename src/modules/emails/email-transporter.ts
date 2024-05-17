
export class EmailTransporter {
    host: string
    port: number
    secure: boolean
    auth: {
        user: string
        pass: string
    }
    constructor(host: string, port: number, secure: boolean, user: string, pass: string) {
        this.host = host;
        this.port = port;
        this.secure = secure;
        this.auth = {
            user: user,
            pass: pass
        }
    }
}
export const emailTransporter = new EmailTransporter(
    process.env.mailHost,
    parseInt(process.env.mailPort),
    false,
    process.env.mailUser,
    process.env.mailPass
)


