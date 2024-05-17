// Import thư viện redis
import { RedisClientType, createClient } from 'redis';

class Redis {
    public client: RedisClientType;

    constructor() {
        this.client = createClient({
            url: 'redis://localhost:6379'
        });
    }

    async connect() {
        await this.client.connect();
        console.log("Connected to Redis");
    }
    async set(key: string, value: string): Promise<string> {
        return this.client.set(key, value);
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async keys(pattern: string): Promise<string[]> {
        return this.client.keys(pattern);
    }

    async del(...keys: string[]): Promise<number> {
        return this.client.del(keys);
    }

    async setex(key: string, ttl: number, value: string): Promise<string> {
        return this.client.setEx(key, ttl, value);
    }

    close() {
        this.client.quit();
    }
}

export const redis = new Redis()

