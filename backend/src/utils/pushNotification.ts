import axios from "axios";

type RecipientType = 'all-student' | 'all-counselor' | 'student' | 'counselor';

async function pushNotification(
    recipient: { type: RecipientType, id?: number },
    notification: {
        title: string,
        body: string,
        icon?: string
    }
) {
    return await axios.post('http://localhost:3000/api/v1/push/send-notification', {
        key: process.env.PUSH_NOTIFICATION_KEY || 'dhanuganteng',
        recipient,
        notification
    });
}

export default pushNotification;