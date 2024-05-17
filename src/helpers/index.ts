export class Helpers {
    async convertTimeToString(timeElapsed: number) {
        const days = Math.floor(timeElapsed / (60 * 60 * 24));
        const hours = Math.floor((timeElapsed % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((timeElapsed % (60 * 60)) / 60);
        if (days > 0) {
            return `${days}d`;
        } else if (hours > 0) {
            return `${hours}h`;
        } else {
            return `${minutes}m`;
        }
    }

    getSeconds(expireStr: string): number {
        const timeUnit = expireStr.slice(-1);
        const timeValue = parseInt(expireStr.slice(0, -1));
        switch (timeUnit) {
            case 's': // Giây
                return timeValue;
            case 'm': // Phút
                return timeValue * 60;
            case 'h': // Giờ
                return timeValue * 3600;
            case 'd': // Ngày
                return timeValue * 86400;
            default:
                throw new Error("Invalid time format");
        }
    }


}